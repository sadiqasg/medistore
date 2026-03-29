from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    sku: str = Field(unique=True, index=True)
    category: str
    unit_cost: float
    unit_price: float
    stock_quantity: int = Field(default=0)
    safety_stock: int = Field(default=10)
    
    order_items: List["OrderItem"] = Relationship(back_populates="product")
    supplies: List["Supply"] = Relationship(back_populates="product")

class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    phone: Optional[str] = None
    address: Optional[str] = None
    current_debt: float = Field(default=0.0)
    trust_level: int = Field(default=1)  # 1 to 5
    
    orders: List["Order"] = Relationship(back_populates="customer")

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    total_amount: float
    amount_paid: float
    status: str = Field(default="pending")  # pending, completed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    customer: Customer = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    price_at_time_of_sale: float
    
    order: Order = Relationship(back_populates="items")
    product: Product = Relationship(back_populates="order_items")

class Supply(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    cost_price: float
    date: datetime = Field(default_factory=datetime.utcnow)
    
    product: Product = Relationship(back_populates="supplies")

class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    amount: float
    category: str  # fuel, electricity, wages, etc.
    date: datetime = Field(default_factory=datetime.utcnow)

