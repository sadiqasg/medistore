from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect
from fastapi_csrf_protect.exceptions import CsrfProtectError
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import os

from database import create_db_and_tables, get_session
from models import Product, Customer, Order, OrderItem, Supply, Expense, OrderCreate, User, Token, UserRead, PasswordReset
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash, verify_password
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI(title="Medistore API")

# --- CORS Configuration ---
origins = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CSRF Configuration ---
class CsrfSettings(BaseModel):
    secret_key: str = os.getenv("CSRF_SECRET_KEY", "secret")

@CsrfProtect.load_config
def get_csrf_settings():
    return CsrfSettings()

@app.exception_handler(CsrfProtectError)
def csrf_protect_exception_handler(request: Request, exc: CsrfProtectError):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

@app.get("/csrf-token")
async def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    token, signed_token = csrf_protect.generate_csrf_tokens()
    response = JSONResponse(content={"csrf_token": token})
    csrf_protect.set_csrf_cookie(signed_token, response)
    return response

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Seed initial admin
    with Session(create_db_and_tables.engine if hasattr(create_db_and_tables, 'engine') else next(get_session()).bind) as session:
        admin_email = "abulex7@yahoo.com"
        admin = session.exec(select(User).where(User.email == admin_email)).first()
        if not admin:
            admin = User(
                email=admin_email,
                name="Admin User",
                hashed_password=get_password_hash("admin01"),
                role="admin"
            )
            session.add(admin)
            session.commit()

@app.get("/")
def read_root():
    return {"message": "Welcome to Medistore API"}

# --- Auth Endpoints ---

@app.post("/auth/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/auth/reset-password")
async def reset_password(
    data: PasswordReset,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = get_password_hash(data.new_password)
    session.add(current_user)
    session.commit()
    return {"message": "Password updated successfully"}



# --- Module A: Inventory & Supply Management ---

@app.get("/inventory/products", response_model=List[Product])
def list_products(session: Session = Depends(get_session)):
    return session.exec(select(Product)).all()

@app.post("/inventory/products", response_model=Product)
def create_product(product: Product, session: Session = Depends(get_session)):
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@app.get("/inventory/low-stock", response_model=List[Product])
def low_stock_alerts(session: Session = Depends(get_session)):
    statement = select(Product).where(Product.stock_quantity <= Product.safety_stock)
    return session.exec(statement).all()

@app.post("/inventory/supplies", response_model=Supply)
def add_supply(supply: Supply, session: Session = Depends(get_session)):
    product = session.get(Product, supply.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Logic: Update cost price and stock
    old_stock = product.stock_quantity
    new_stock = old_stock + supply.quantity
    
    if new_stock > 0:
        # Weighted average cost calculation
        product.unit_cost = ((product.unit_cost * old_stock) + (supply.cost_price * supply.quantity)) / new_stock
    else:
        product.unit_cost = supply.cost_price
        
    product.stock_quantity = new_stock
    
    session.add(supply)
    session.add(product)
    session.commit()
    session.refresh(supply)
    return supply

# --- Module B: Customer & Debt Management ---

@app.get("/customers", response_model=List[Customer])
def list_customers(session: Session = Depends(get_session)):
    return session.exec(select(Customer)).all()

@app.post("/customers", response_model=Customer)
def create_customer(customer: Customer, session: Session = Depends(get_session)):
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return customer

@app.get("/customers/{customer_id}/ledger", response_model=Customer)
def get_customer_ledger(customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.post("/customers/{customer_id}/payment")
def record_payment(customer_id: int, amount: float, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    customer.current_debt -= amount
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return {"message": f"Payment of {amount} recorded. Remaining debt: {customer.current_debt}"}

# --- Module C: Sales & Order Processing ---

@app.post("/orders", response_model=Order)
def create_order(
    order_payload: OrderCreate, 
    request: Request,
    csrf_protect: CsrfProtect = Depends(),
    session: Session = Depends(get_session)
):
    # CSRF Validation
    csrf_protect.validate_csrf(request)
    
    customer = session.get(Customer, order_payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Create the order object
    db_order = Order(
        customer_id=order_payload.customer_id,
        amount_paid=order_payload.amount_paid,
        total_amount=0, # Will be calculated
        status="completed",
        created_at=datetime.utcnow()
    )
    session.add(db_order)
    session.flush() # Get the order ID
    
    total = 0
    # Process items and deduct inventory
    for item_data in order_payload.items:
        product = session.get(Product, item_data.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item_data.product_id} not found")
        if product.stock_quantity < item_data.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        product.stock_quantity -= item_data.quantity
        
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item_data.quantity,
            price_at_time_of_sale=product.unit_price
        )
        total += db_item.price_at_time_of_sale * db_item.quantity
        session.add(product)
        session.add(db_item)
    
    db_order.total_amount = total
    
    # Calculate debt
    unpaid = total - order_payload.amount_paid
    if unpaid > 0:
        customer.current_debt += unpaid
        session.add(customer)
    
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order

# --- Module D: Profit & Margin Engine ---

@app.get("/expenses", response_model=List[Expense])
def list_expenses(session: Session = Depends(get_session)):
    return session.exec(select(Expense)).all()

@app.post("/expenses", response_model=Expense)
def create_expense(expense: Expense, session: Session = Depends(get_session)):
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

@app.get("/reports/daily-profit")
def get_daily_profit(session: Session = Depends(get_session), date: Optional[str] = None):
    # Filter by date if provided, otherwise today
    target_date = datetime.utcnow().date()
    if date:
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
    
    orders = session.exec(select(Order)).all()
    expenses = session.exec(select(Expense)).all()
    
    # Filter orders and expenses for the target date
    day_orders = [o for o in orders if o.created_at.date() == target_date]
    day_expenses = [e for e in expenses if e.date.date() == target_date]
    
    total_revenue = sum(o.total_amount for o in day_orders)
    total_expenses = sum(e.amount for e in day_expenses)
    
    # Simplified net profit calculation
    net_profit = total_revenue - total_expenses
    
    return {
        "date": target_date,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
        "net_profit": net_profit,
        "expense_breakdown": {e.category: e.amount for e in day_expenses}
    }

