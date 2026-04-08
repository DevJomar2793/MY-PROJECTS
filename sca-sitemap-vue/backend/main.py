from fastapi import FastAPI, Depends, HTTPException, Query, APIRouter
from fastapi.templating import Jinja2Templates
from sqlalchemy import text, or_, func
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from schemas import PageCreate, PageResponse, PageUpdate, UserCreate, UserLogin, UserResponse, Token, ForgotPasswordRequest, ResetPasswordRequest
import secrets
from models import ScreenList, User
from auth import hash_password, verify_password, create_access_token, get_current_user
from typing import List

import models

app = FastAPI()

# CORS for Vue
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#Jinja2 Templating
templates = Jinja2Templates(directory="/src/views")

#Create Table
models.Base.metadata.create_all(bind=engine)

#Delete Table
# models.Base.metadata.drop_all(bind=engine)


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




# Screen Creation
@app.post("/api/v1/PageCreate")
def create_page(page: PageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    new_page = ScreenList(
            alpha=page.alpha,
            screen_number=page.screen_number,
            screen_type=page.screen_type,
            screen_description=page.screen_description,
            file_label=page.file_label,
            screen_label=page.screen_label,
            notes=page.notes,
            sitemap=page.sitemap,
            link=page.link,
    )

    db.add(new_page)
    db.commit()
    db.refresh(new_page)

    return {"message": "Item Added Successfully", "page_id": new_page.id }

# Screen Reading
@app.get("/api/v1/GetSpecificScreen", response_model=List[PageResponse])
def get_screen(db: Session = Depends(get_db)):
    return db.query(ScreenList).order_by(ScreenList.id.desc()).all()

# Get Buyer Screen
@app.get("/api/v1/GetBuyerScreen", response_model=List[PageResponse])
def get_buyers_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "B").order_by(ScreenList.id.desc()).all()

# Update Screen
@app.put("/api/v1/UpdateScreen/{id}")
def update_screen(id: int, data: PageUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    screen = db.query(ScreenList).filter(ScreenList.id == id).first()



    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")
    
    screen.alpha = data.alpha
    screen.screen_number = data.screen_number
    screen.screen_type = data.screen_type
    screen.screen_description = data.screen_description
    screen.file_label = data.file_label
    screen.screen_label = data.screen_label
    screen.notes = data.notes
    screen.sitemap = data.sitemap
    screen.link = data.link
    screen.updated_at = func.now()

    db.commit()
    # db.refresh(screen)

    return {"message": "Successfully Updated"}

# Get Seller Screen
@app.get("/api/v1/GetSellerScreen", response_model=List[PageResponse])
def get_seller_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "S").order_by(ScreenList.id.desc()).all()

# Get Appraisal Boss Screen
@app.get("/api/v1/GetAppraisalBossScreen", response_model=List[PageResponse])
def get_appraisal_boss_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "AB").order_by(ScreenList.id.desc()).all()

# Get Admin Screen
@app.get("/api/v1/GetAdminScreen", response_model=List[PageResponse])
def get_admin_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "A").order_by(ScreenList.id.desc()).all()

# Get Mobile Worker App Screen
@app.get("/api/v1/GetMobileWorkerScreen", response_model=List[PageResponse])
def get_mobile_worker_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "MW").order_by(ScreenList.id.desc()).all()

# Get Marketplace Screen
@app.get("/api/v1/GetMarketplaceScreen", response_model=List[PageResponse])
def get_marketplace_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "M").order_by(ScreenList.id.desc()).all()

# Get Read Module Screen
@app.get("/api/v1/GetReadModuleScreen", response_model=List[PageResponse])
def get_read_module_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "RM").order_by(ScreenList.id.desc()).all()

#Get Controller Module Screen
@app.get("/api/v1/GetControllerModuleScreen", response_model=List[PageResponse])
def get_controller_module_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "CM").order_by(ScreenList.id.desc()).all()


# Search Screen
@app.get("/api/v1/screens/search")
def search_screen(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    
    results = (db.query(Screen).filter(or_(Screen.screen_label.ilike(f"%{q}"))).order_by(Screen.id.desc()).all())


    return results

# Delete Screen
@app.delete("/api/v1/DeleteScreen/{id}")
def delete_screen(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    screen = db.query(ScreenList).filter(ScreenList.id == id).first()
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")
    
    db.delete(screen)
    db.commit()
    return {"message": "Successfully Deleted"}


# Get Total Count Screen of Buyer
@app.get("/api/v1/gettotalcountforbuyers")
def get_total_count_buyers(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "B").scalar()

# Get Total Count Screen of Sellers
@app.get("/api/v1/gettotalcountforsellers")
def get_total_count_sellers(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "S").scalar()

#Get total Count Screen of Appraisal Boss
@app.get("/api/v1/gettotalcountforappraisalboss")
def get_total_count_appraisal_boss(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "AB").scalar()

#Get total Count Screen of Admin
@app.get("/api/v1/gettotalcountforadmin")
def get_total_count_admin(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "A").scalar()

#Get total Count Screen of Mobile Worker
@app.get("/api/v1/gettotalcountformobileworker")
def get_total_count_mobile_worker(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "MW").scalar()

#Get total Count Screen of Marketplace
@app.get("/api/v1/gettotalcountformarketplace")
def get_total_count_marketplace(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "M").scalar()

#Get total Count Screen of Read Module
@app.get("/api/v1/gettotalcountforreadmodule")
def get_total_count_read_module(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "RM").scalar()

#Get total Count Screen of Controller Module
@app.get("/api/v1/gettotalcountforcontrollermodule")
def get_total_count_controller_module(db: Session = Depends(get_db)):
    return db.query(func.count(ScreenList.alpha)).filter(ScreenList.alpha == "CM").scalar()


# ═══════════════════════════════════════════════════════════════
# AUTH ENDPOINTS
# ═══════════════════════════════════════════════════════════════

# Register
@app.post("/api/v1/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Validate passwords match
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Validate password length
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # Check for duplicate email
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Account created successfully"}


# Login
@app.post("/api/v1/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# Get Current User (Protected)
@app.get("/api/v1/users/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


# Forgot Password — generate reset token
@app.post("/api/v1/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with that email")

    # Generate secure token and set 1-hour expiry
    from datetime import datetime, timedelta, timezone
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.token_expiration = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    # In production, send email with: /reset-password?token=<token>
    return {"message": "Password reset link has been sent to your email", "token": token}


# Reset Password — validate token and set new password
@app.post("/api/v1/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user = db.query(User).filter(User.reset_token == req.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    from datetime import datetime, timezone
    if user.token_expiration is None or user.token_expiration.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token has expired")

    # Update password and clear token
    user.hashed_password = hash_password(req.new_password)
    user.reset_token = None
    user.token_expiration = None
    db.commit()

    return {"message": "Password has been reset successfully"}
