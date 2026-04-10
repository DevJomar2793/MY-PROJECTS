# from backend import schema
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

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
    "/api/v1/screen/admin", response_model=List[schema.ScreenResponse],
    tags=["Screens"],
    summary="List of Admin Screens",
)
def get_admin_screens(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)):

    return db.query(model.ScreenModel).filter(model.ScreenModel.alpha == "A").all()

@app.get(
    "/api/v1/screen/seller", response_model=List[schema.ScreenResponse],
    tags=["Screens"],
    summary="List of Seller Screens",
)
def get_seller_screens(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)):

    return db.query(model.ScreenModel).filter(model.ScreenModel.alpha == "S").all()



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
    
    # Add notification and run cleanup
    notif = model.NotificationModel(message=f"Screen {payload.screen_label} was added.")
    db.add(notif)
    cleanup_old_notifications(db)
    
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

    # Add notification and run cleanup
    notif = model.NotificationModel(message=f"Screen {screen.screen_label} was updated.")
    db.add(notif)
    cleanup_old_notifications(db)

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
    
    # Add notification and run cleanup
    notif = model.NotificationModel(message=f"Screen {screen.screen_label} was deleted.")
    db.add(notif)
    cleanup_old_notifications(db)
    
    db.delete(screen)
    db.commit()

# ── Notifications ─────────────────────────────────────────────────────────────

def cleanup_old_notifications(db: Session):
    """Delete notifications older than 30 days."""
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    db.query(model.NotificationModel).filter(
        model.NotificationModel.created_at < thirty_days_ago
    ).delete(synchronize_session=False)

@app.get(
    "/notifications",
    response_model=List[schema.NotificationResponse],
    tags=["Notifications"],
    summary="List all notifications",
)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Return all notifications, newest first."""
    return db.query(model.NotificationModel).order_by(model.NotificationModel.created_at.desc()).all()


@app.put(
    "/notifications/{notification_id}/read",
    response_model=schema.NotificationResponse,
    tags=["Notifications"],
    summary="Mark a notification as read",
)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Mark the given notification as read."""
    notif = db.query(model.NotificationModel).filter(model.NotificationModel.id == notification_id).first()
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with id={notification_id} not found.",
        )
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

