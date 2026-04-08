import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
import bcrypt
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Config (read from env, with sane defaults for local dev)
# ---------------------------------------------------------------------------

SECRET_KEY = os.getenv("SECRET_KEY", "sca-sitemap-super-secret-key-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 hours

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

# ---------------------------------------------------------------------------
# Password hashing (using bcrypt directly – avoids passlib/bcrypt version clash)
# ---------------------------------------------------------------------------


def verify_password(plain: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed)


def hash_password(plain: str) -> bytes:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt())


# Pre-hash at startup so verify is fast on every request
_HASHED_ADMIN_PASSWORD: bytes = hash_password(ADMIN_PASSWORD)


# ---------------------------------------------------------------------------
# Token schema
# ---------------------------------------------------------------------------


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# ---------------------------------------------------------------------------
# OAuth2 scheme (the frontend will send `Authorization: Bearer <token>`)
# ---------------------------------------------------------------------------

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> TokenData:
    """Decode and validate a JWT. Raises 401 on any error."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
        return TokenData(username=username)
    except JWTError:
        raise credentials_exception


# ---------------------------------------------------------------------------
# FastAPI dependency – call this on every protected route
# ---------------------------------------------------------------------------


def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    return decode_token(token)


# ---------------------------------------------------------------------------
# Login handler (imported and registered in main.py)
# ---------------------------------------------------------------------------


def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """Validate credentials and return a JWT on success."""
    if form_data.username != ADMIN_USERNAME or not verify_password(
        form_data.password, _HASHED_ADMIN_PASSWORD
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username})
    return Token(access_token=access_token, token_type="bearer")
