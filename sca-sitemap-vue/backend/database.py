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

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://db_projects_fqbk_user:fSUhzFrdqOckOUFylHRFSBsGv6E6bdru@dpg-d7fiarnaqgkc739r2fbg-a/db_projects_fqbk")

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