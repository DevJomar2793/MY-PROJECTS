from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)
except Exception:
    pass

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://photobooth_db_c4bq_user:S1dzx9dA4t3vFZfk6dqaOVjftl1DvWCN@dpg-d7et9cvaqgkc739ss960-a.singapore-postgres.render.com/photobooth_db_c4bq")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing in environment variables")

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg2://"
    )

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"sslmode": "require"}
)

Sessionlocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()