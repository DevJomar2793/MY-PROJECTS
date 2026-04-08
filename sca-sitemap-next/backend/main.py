from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

import model
import schema
from database import engine, get_db
from auth import Token, TokenData, get_current_user, login_for_access_token

# ---------------------------------------------------------------------------
# Create all tables on startup (idempotent – safe to run multiple times)
# ---------------------------------------------------------------------------
model.Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SCA Sitemap API",
    description="CRUD API for managing screen records in the SCA Sitemap tool.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS – allow the Next.js dev server (and any localhost port) to call this API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/", tags=["Health"])
def health_check():
    """Verify the API is running."""
    return {"status": "ok", "message": "SCA Sitemap API is running 🚀"}


# ── Auth ──────────────────────────────────────────────────────────────────────


@app.post("/auth/login", response_model=Token, tags=["Auth"], summary="Login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Exchange username + password for a JWT access token."""
    return login_for_access_token(form_data)


# ── Screens ──────────────────────────────────────────────────────────────────


@app.get(
    "/screens",
    response_model=List[schema.ScreenResponse],
    tags=["Screens"],
    summary="List all screens",
)
def get_screens(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Return every screen in the database, ordered by id."""
    return db.query(model.ScreenModel).order_by(model.ScreenModel.id).all()


@app.get(
    "/screens/{screen_id}",
    response_model=schema.ScreenResponse,
    tags=["Screens"],
    summary="Get a single screen",
)
def get_screen(screen_id: int, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """Return the screen with the given id, or 404 if not found."""
    screen = (
        db.query(model.ScreenModel)
        .filter(model.ScreenModel.id == screen_id)
        .first()
    )
    if not screen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Screen with id={screen_id} not found.",
        )
    return screen


@app.post(
    "/screens",
    response_model=schema.ScreenResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Screens"],
    summary="Create a new screen",
)
def create_screen(payload: schema.ScreenCreate, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """Add a new screen record to the database."""
    new_screen = model.ScreenModel(**payload.model_dump())
    db.add(new_screen)
    db.commit()
    db.refresh(new_screen)
    return new_screen


@app.put(
    "/screens/{screen_id}",
    response_model=schema.ScreenResponse,
    tags=["Screens"],
    summary="Update an existing screen",
)
def update_screen(
    screen_id: int,
    payload: schema.ScreenUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """
    Partially update the screen with the given id.
    Only fields present in the request body are changed.
    """
    screen = (
        db.query(model.ScreenModel)
        .filter(model.ScreenModel.id == screen_id)
        .first()
    )
    if not screen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Screen with id={screen_id} not found.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(screen, field, value)

    db.commit()
    db.refresh(screen)
    return screen


@app.delete(
    "/screens/{screen_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Screens"],
    summary="Delete a screen",
)
def delete_screen(screen_id: int, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """Permanently delete the screen with the given id."""
    screen = (
        db.query(model.ScreenModel)
        .filter(model.ScreenModel.id == screen_id)
        .first()
    )
    if not screen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Screen with id={screen_id} not found.",
        )
    db.delete(screen)
    db.commit()
