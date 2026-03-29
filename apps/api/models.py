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
    is_recurring: bool = Field(default=False)
    
    orders: List["Order"] = Relationship(back_populates="customer")

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    total_amount: float
    amount_paid: float
    payment_method: str = Field(default="cash")  # cash, bank
    empty_crates_returned: int = Field(default=0)
    status: str = Field(default="completed")  # pending, completed, cancelled
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

class ProfitSharer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    percentage: float
    total_paid: float = Field(default=0.0)
    
    payments: List["ProfitPayment"] = Relationship(back_populates="sharer")

class ProfitPayment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sharer_id: int = Field(foreign_key="profitsharer.id")
    amount: float
    date: datetime = Field(default_factory=datetime.utcnow)
    
    sharer: ProfitSharer = Relationship(back_populates="payments")

# --- Pydantic Schemas for API Requests ---

class OrderItemBase(SQLModel):
    product_id: int
    quantity: int

class OrderCreate(SQLModel):
    customer_id: int
    amount_paid: float
    payment_method: str = "cash"
    empty_crates_returned: int = 0
    items: List[OrderItemBase]

# --- Auth Models ---

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    name: str
    hashed_password: str
    role: str = "admin"
    is_active: bool = True

class UserRead(SQLModel):
    id: int
    email: str
    name: str
    role: str

class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    email: Optional[str] = None

class PasswordReset(SQLModel):
    current_password: str
    new_password: str

class Settings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_name: str = Field(default="Medistore")
    max_debt_per_customer: float = Field(default=50000.0)
    logo_url: Optional[str] = Field(default=None)

class LoginSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    ip_address: str
    device: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

