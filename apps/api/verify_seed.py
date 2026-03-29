from sqlmodel import Session, select
from database import engine
from models import User
from auth import get_password_hash

def seed_and_check():
    with Session(engine) as session:
        admin_email = "abulex7@yahoo.com"
        admin = session.exec(select(User).where(User.email == admin_email)).first()
        if not admin:
            print("Seeding admin user...")
            admin = User(
                email=admin_email,
                name="Admin User",
                hashed_password=get_password_hash("admin01"),
                role="admin"
            )
            session.add(admin)
            session.commit()
            print("Admin user seeded successfully!")
        else:
            print(f"Admin user already exists: {admin.email}")

if __name__ == "__main__":
    seed_and_check()
