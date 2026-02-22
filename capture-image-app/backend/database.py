from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Load `.env` from the backend folder when available (optional).
try:
	from dotenv import load_dotenv
	env_path = Path(__file__).parent / ".env"
	if env_path.exists():
		load_dotenv(env_path)
except Exception:
	# python-dotenv is optional; if not installed we rely on real env vars
	pass

# Read DATABASE_URL from environment. Do NOT hardcode credentials here.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://jow_capture_image_user:K2SeDee0ILvljYUVFoD4WtNGnLsrQBEw@dpg-d6df1nfpm1nc739ovubg-a.singapore-postgres.render.com/jow_capture_image")
if not DATABASE_URL:
	raise RuntimeError(
		"DATABASE_URL environment variable is not set. Create backend/.env or set the env var."
	)

# Use pool_pre_ping to avoid stale connections
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
Sessionlocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()