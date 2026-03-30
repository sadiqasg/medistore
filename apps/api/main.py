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

from database import engine, create_db_and_tables, get_session
from models import (
    Product, Customer, Order, OrderItem, Supply, Expense, 
    OrderCreate, User, Token, UserRead, PasswordReset, 
    Settings, LoginSession, UserUpdate, ProfitSharer, ProfitPayment
)
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash, verify_password
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI(title="Medistore API")

# --- CORS Configuration ---
# Origins can be a comma-separated list in CORS_ORIGINS env var
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:8080")
origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

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

@app.get("/")
async def root():
    return {"message": "Welcome to Medistore API", "status": "running"}

@app.post("/")
async def root_post():
    return {
        "error": "Method Not Allowed on root",
        "message": "To login, please use the /auth/login endpoint.",
        "hint": "POST your credentials to /auth/login instead of /"
    }

@app.get("/csrf-token")
async def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    token, signed_token = csrf_protect.generate_csrf_tokens()
    response = JSONResponse(content={"csrf_token": token})
    csrf_protect.set_csrf_cookie(signed_token, response)
    return response
@app.on_event("startup")
def on_startup():
    print("API Starting up...")
    try:
        create_db_and_tables()
        
        with Session(engine) as session:
            # Seed initial admin
            admin_email = "abulex7@yahoo.com"
            admin = session.exec(select(User).where(User.email == admin_email)).first()
            if not admin:
                admin = User(
                    email=admin_email,
                    name="Abu Nabeelah",
                    hashed_password=get_password_hash("admin01"),
                    role="admin"
                )
                session.add(admin)
                print(f"Admin user seeded: {admin_email}")
            
            # Seed default settings
            settings = session.exec(select(Settings)).first()
            if not settings:
                settings = Settings(
                    company_name="Medistore",
                    max_debt_per_customer=50000.0,
                    logo_url="/logo.svg"
                )
                session.add(settings)
                print("Default settings seeded.")
                
            session.commit()
            print("Startup seeding complete.")
    except Exception as e:
        print(f"ERROR during startup: {str(e)}")
        # We don't re-raise here to allow the app to start even if DB is briefly down,
        # otherwise Render will loop the restart.

@app.get("/")
def read_root():
    return {"message": "Welcome to Medistore API"}

# --- Auth Endpoints ---

@app.post("/auth/login", response_model=Token)
async def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Record Login Session
    # In a real app, we'd use a better way to get user-agent, but for this mock-to-real:
    user_agent = request.headers.get("user-agent", "Unknown Device")
    ip_address = request.client.host if request.client else "127.0.0.1"
    
    login_session = LoginSession(
        user_id=user.id,
        ip_address=ip_address,
        device=user_agent
    )
    session.add(login_session)
    session.commit()

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

@app.patch("/auth/me", response_model=UserRead)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if user_update.name:
        current_user.name = user_update.name
    if user_update.email:
        # Check if email taken
        existing_user = session.exec(select(User).where(User.email == user_update.email)).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = user_update.email
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@app.get("/auth/sessions", response_model=List[LoginSession])
async def list_login_sessions(
    page: int = 1,
    size: int = 10,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    offset = (page - 1) * size
    statement = select(LoginSession).where(LoginSession.user_id == current_user.id).order_by(LoginSession.created_at.desc()).offset(offset).limit(size)
    return session.exec(statement).all()

@app.get("/settings", response_model=Settings)
async def get_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(Settings)).first()
    if not settings:
        settings = Settings()
        session.add(settings)
        session.commit()
        session.refresh(settings)
    return settings

@app.patch("/settings", response_model=Settings)
async def update_settings(
    settings_update: Settings,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to change settings")
        
    db_settings = session.exec(select(Settings)).first()
    if not db_settings:
        db_settings = Settings()
    
    db_settings.company_name = settings_update.company_name
    db_settings.max_debt_per_customer = settings_update.max_debt_per_customer
    db_settings.logo_url = settings_update.logo_url
    
    session.add(db_settings)
    session.commit()
    session.refresh(db_settings)
    return db_settings



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
        payment_method=order_payload.payment_method,
        empty_crates_returned=order_payload.empty_crates_returned,
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

# --- Module D: Expense Management ---

@app.get("/expenses", response_model=List[Expense])
def list_expenses(session: Session = Depends(get_session)):
    return session.exec(select(Expense)).all()

@app.post("/expenses", response_model=Expense)
def create_expense(expense: Expense, session: Session = Depends(get_session)):
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

# --- Module E: Advanced Reporting & Profit Sharing ---

@app.get("/customers/{customer_id}/transactions")
def get_customer_transactions(customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    orders = session.exec(select(Order).where(Order.customer_id == customer_id).order_by(Order.created_at)).all()
    
    transactions = []
    running_balance = 0
    
    for order in orders:
        # For each order, we calculate the balance impact
        running_balance += (order.total_amount - order.amount_paid)
        
        # We need supply info (categories of items)
        supply_names = list(set([item.product.category for item in order.items]))
        item_count = sum(item.quantity for item in order.items)
        
        transactions.append({
            "date": order.created_at,
            "supply": ", ".join(supply_names),
            "items_number": item_count,
            "unit": "Crates", # Defaulting to Crates for this business
            "total": order.total_amount,
            "amount_paid": order.amount_paid,
            "balance": running_balance,
            "payment_method": order.payment_method
        })
        
    return transactions

@app.get("/reports/balance-sheet")
def get_balance_sheet(session: Session = Depends(get_session)):
    orders = session.exec(select(Order)).all()
    expenses = session.exec(select(Expense)).all()
    
    cash_revenue = sum(o.total_amount for o in orders if o.payment_method == "cash")
    bank_revenue = sum(o.total_amount for o in orders if o.payment_method == "bank")
    total_revenue = cash_revenue + bank_revenue
    total_expenses = sum(e.amount for e in expenses)
    net_profit = total_revenue - total_expenses
    
    return {
        "cash_revenue": cash_revenue,
        "bank_revenue": bank_revenue,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
        "net_profit": net_profit
    }

@app.get("/reports/statement-summary")
def get_statement_summary(
    start_date: Optional[str] = None, 
    end_date: Optional[str] = None,
    session: Session = Depends(get_session)
):
    statement = select(Order)
    if start_date:
        statement = statement.where(Order.created_at >= datetime.strptime(start_date, "%Y-%m-%d"))
    if end_date:
        statement = statement.where(Order.created_at <= datetime.strptime(end_date, "%Y-%m-%d"))
    
    orders = session.exec(statement).all()
    
    total_amount = sum(o.total_amount for o in orders)
    total_paid = sum(o.amount_paid for o in orders)
    total_debt = total_amount - total_paid
    
    # Empty crates logic
    total_crates_returned = sum(o.empty_crates_returned for o in orders)
    
    return {
        "period": {"start": start_date, "end": end_date},
        "total_amount": total_amount,
        "total_paid": total_paid,
        "total_debt": total_debt,
        "total_crates_returned": total_crates_returned,
        "order_count": len(orders)
    }

@app.get("/profit/sharers", response_model=List[ProfitSharer])
def list_profit_sharers(session: Session = Depends(get_session)):
    return session.exec(select(ProfitSharer)).all()

@app.post("/profit/sharers", response_model=ProfitSharer)
def create_profit_sharer(sharer: ProfitSharer, session: Session = Depends(get_session)):
    session.add(sharer)
    session.commit()
    session.refresh(sharer)
    return sharer

@app.get("/profit/analysis")
def get_profit_analysis(session: Session = Depends(get_session)):
    # Calculate net profit
    balance_sheet = get_balance_sheet(session)
    net_profit = balance_sheet["net_profit"]
    
    sharers = session.exec(select(ProfitSharer)).all()
    
    analysis = []
    for s in sharers:
        allocated = (s.percentage / 100) * net_profit
        analysis.append({
            "id": s.id,
            "name": s.name,
            "percentage": s.percentage,
            "allocated_profit": allocated,
            "total_paid": s.total_paid,
            "balance": allocated - s.total_paid
        })
        
    return {
        "net_profit": net_profit,
        "sharers_breakdown": analysis
    }

@app.post("/profit/payments", response_model=ProfitPayment)
def record_profit_payment(payment: ProfitPayment, session: Session = Depends(get_session)):
    sharer = session.get(ProfitSharer, payment.sharer_id)
    if not sharer:
        raise HTTPException(status_code=404, detail="Sharer not found")
        
    sharer.total_paid += payment.amount
    session.add(payment)
    session.add(sharer)
    session.commit()
    session.refresh(payment)
    return payment

@app.get("/profit/history/{sharer_id}", response_model=List[ProfitPayment])
def get_profit_history(sharer_id: int, session: Session = Depends(get_session)):
    return session.exec(select(ProfitPayment).where(ProfitPayment.sharer_id == sharer_id)).all()

