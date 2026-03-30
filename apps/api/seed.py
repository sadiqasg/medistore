import os
import sys
from datetime import datetime, timedelta
from sqlmodel import Session, SQLModel, select
from database import engine
from models import Product, Customer, Order, OrderItem, Expense, User, Settings
from auth import get_password_hash

def seed_data():
    print("Starting database seeding...")
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # 1. Seed Admin User
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
            print(f"Admin user created: {admin_email}")
        
        # 1b. Seed Test Admin
        test_email = "testadmin@medistore.com"
        test_admin = session.exec(select(User).where(User.email == test_email)).first()
        if not test_admin:
            test_admin = User(
                email=test_email,
                name="Test Admin",
                hashed_password=get_password_hash("admin01"),
                role="admin"
            )
            session.add(test_admin)
            print(f"Test admin user created: {test_email}")
        
        # 2. Seed Settings
        settings = session.exec(select(Settings)).first()
        if not settings:
            settings = Settings(
                company_name="MEDIS Store",
                max_debt_per_customer=50000.0,
                logo_url="/logo.svg"
            )
            session.add(settings)
            print("Default settings created")

        # 3. Seed Products (Coca-Cola Soft Drinks)
        products_data = [
            {"sku": "CC-35CL", "name": "Coca-Cola", "category": "crates", "unit_cost": 150.0, "unit_price": 200.0, "stock": 24},
            {"sku": "CC-50CL", "name": "Coca-Cola", "category": "crates", "unit_cost": 190.0, "unit_price": 250.0, "stock": 18},
            {"sku": "CC-1L", "name": "Coca-Cola", "category": "crates", "unit_cost": 320.0, "unit_price": 400.0, "stock": 12},
            {"sku": "FT-35CL", "name": "Fanta Orange", "category": "crates", "unit_cost": 150.0, "unit_price": 200.0, "stock": 20},
            {"sku": "FT-50CL", "name": "Fanta Orange", "category": "crates", "unit_cost": 190.0, "unit_price": 250.0, "stock": 0},
            {"sku": "SP-35CL", "name": "Sprite", "category": "crates", "unit_cost": 150.0, "unit_price": 200.0, "stock": 15},
            {"sku": "SP-50CL", "name": "Sprite", "category": "crates", "unit_cost": 190.0, "unit_price": 250.0, "stock": 22},
            {"sku": "EVA-75CL", "name": "Eva Water", "category": "crates", "unit_cost": 100.0, "unit_price": 150.0, "stock": 35},
        ]
        
        for p in products_data:
            existing = session.exec(select(Product).where(Product.sku == p["sku"])).first()
            if not existing:
                product = Product(
                    sku=p["sku"],
                    name=p["name"],
                    category=p["category"],
                    unit_cost=p["unit_cost"],
                    unit_price=p["unit_price"],
                    stock_quantity=p["stock"]
                )
                session.add(product)
                print(f"Product added: {p['name']} ({p['sku']})")

        # 4. Seed Customers
        customers_data = [
            {"name": "Mama Chidi", "phone": "08012345678", "debt": 45000.0, "is_recurring": True},
            {"name": "Oga Tunde", "phone": "08098765432", "debt": 12600.0, "is_recurring": False},
            {"name": "Mr. Johnson", "phone": "08055555555", "debt": 52000.0, "is_recurring": True},
        ]
        
        for c in customers_data:
            existing = session.exec(select(Customer).where(Customer.phone == c["phone"])).first()
            if not existing:
                customer = Customer(
                    name=c["name"],
                    phone=c["phone"],
                    current_debt=c["debt"],
                    is_recurring=c["is_recurring"]
                )
                session.add(customer)
                print(f"Customer added: {c['name']}")

        # 5. Seed some Expenses
        expenses_data = [
            {"description": "Electricity Bill - January", "amount": 4500.0, "category": "utilities"},
            {"description": "Delivery Van Fuel", "amount": 1200.0, "category": "transport"},
        ]
        
        for e in expenses_data:
            existing = session.exec(select(Expense).where(Expense.description == e["description"])).first()
            if not existing:
                expense = Expense(
                    description=e["description"],
                    amount=e["amount"],
                    category=e["category"]
                )
                session.add(expense)
                print(f"Expense added: {e['description']}")

        session.commit()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
