import os
import logging
from dotenv import load_dotenv
from sqlmodel import create_engine, SQLModel, Session

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Connection Selection
# 1. Use DATABASE_URL if set (highest priority, set by Railway/Render)
# 2. Use PROD_DATABASE_URL if DB_ENV is 'prod'
# 3. Default to local DATABASE_URL from .env or hardcoded fallback
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if os.getenv("DB_ENV") == "prod":
    DATABASE_URL = os.getenv("PROD_DATABASE_URL")
elif not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:sas@localhost:5432/medistore"

# Fix potential protocol mismatch (some platforms use postgres://, SQLAlchemy needs postgresql://)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Log the database host (safe version)
try:
    db_host = DATABASE_URL.split('@')[-1].split('/')[0] if DATABASE_URL else 'None'
    logger.info(f"Connecting to database at: {db_host}")
except Exception:
    logger.info("Connecting to database...")

engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    try:
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables verified/created.")
    except Exception as e:
        logger.error(f"Failed to create tables: {str(e)}")
        # We don't raise here to allow the app to start even if DB is briefly down
        # This prevents restart loops on some platforms.

def get_session():
    with Session(engine) as session:
        yield session