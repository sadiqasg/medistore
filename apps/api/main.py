from fastapi import FastAPI, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from .database import create_db_and_tables, get_session
from .models import Product, Customer, Order, OrderItem, Supply

app = FastAPI(title="Medistore API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to Medistore API"}

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
def create_order(order_data: Order, items: List[OrderItem], session: Session = Depends(get_session)):
    customer = session.get(Customer, order_data.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    total = 0
    # Process items and deduct inventory
    for item in items:
        product = session.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        product.stock_quantity -= item.quantity
        item.price_at_time_of_sale = product.unit_price
        total += item.price_at_time_of_sale * item.quantity
        session.add(product)
    
    order_data.total_amount = total
    order_data.created_at = datetime.utcnow()
    
    # Calculate debt
    unpaid = total - order_data.amount_paid
    if unpaid > 0:
        customer.current_debt += unpaid
        session.add(customer)
    
    session.add(order_data)
    session.commit()
    session.refresh(order_data)
    
    # Associate items with order
    for item in items:
        item.order_id = order_data.id
        session.add(item)
    
    session.commit()
    session.refresh(order_data)
    return order_data

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

