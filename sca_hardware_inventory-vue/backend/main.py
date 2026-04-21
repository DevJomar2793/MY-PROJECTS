from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import os
import shutil
import uuid
import hashlib
import secrets
import base64

import models, schemas
from database import engine, Sessionlocal

# Create all tables in the SQLite database
models.Base.metadata.create_all(bind=engine)

# ---- Startup Migration: add new columns if they don't exist ----
def _run_migrations():
    from sqlalchemy import inspect, text
    inspector = inspect(engine)
    existing_cols = {col["name"] for col in inspector.get_columns("hardware_items")}
    migrations = [
        ("price_php", "ALTER TABLE hardware_items ADD COLUMN price_php REAL"),
        ("price_usd", "ALTER TABLE hardware_items ADD COLUMN price_usd REAL"),
        ("notes",     "ALTER TABLE hardware_items ADD COLUMN notes TEXT"),
        ("issued_date", "ALTER TABLE hardware_items ADD COLUMN issued_date TEXT"),
    ]
    with engine.connect() as conn:
        for col_name, sql in migrations:
            if col_name not in existing_cols:
                conn.execute(text(sql))
        # User table migrations
        user_cols = {col["name"] for col in inspector.get_columns("users")}
        if "full_name" not in user_cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN full_name TEXT"))
        conn.commit()

_run_migrations()

# Delete table hardware_items
# models.HardwareItem.metadata.drop_all(bind=engine)

app = FastAPI(title="SCA Hardware Inventory API", version="1.0.0")

# Allow requests from Vue dev server
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://sca-hardware-inventory-vue.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
# Mount the uploads folder
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# DB Dependency
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()


# ---- Health Check ----        
@app.get("/")
def root():
    return {"message": "SCA Hardware Inventory API is running 🚀"}

# ========================
# File Upload Endpoint
# ========================

@app.post("/api/v1/upload")
async def upload_images(files: List[UploadFile] = File(...)):
    uploaded_files = []
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_location = f"uploads/{unique_filename}"
        
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Return URL-like path to be stored by the frontend
        uploaded_files.append(f"/uploads/{unique_filename}")
        
    return {"file_paths": uploaded_files}


# ========================
# Hardware Item Endpoints
# ========================

@app.get("/api/v1/hardware", response_model=List[schemas.HardwareItemResponse])
def get_all_hardware(db: Session = Depends(get_db)):
    return db.query(models.HardwareItem).options(joinedload(models.HardwareItem.deployment)).all()


@app.get("/api/v1/hardware/{item_id}", response_model=schemas.HardwareItemResponse)
def get_hardware(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.HardwareItem).filter(models.HardwareItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Hardware item not found")
    return item


@app.post("/api/v1/hardware", response_model=schemas.HardwareItemResponse, status_code=201)
def create_hardware(item: schemas.HardwareItemCreate, db: Session = Depends(get_db)):
    # Extract images from payload
    item_data = item.model_dump(exclude={"images"})
    db_item = models.HardwareItem(**item_data)
    
    # Process images if they exist
    if item.images:
        for path in item.images:
            db_item.images.append(models.HardwareImage(image_path=path))
            
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.put("/api/v1/hardware/{item_id}", response_model=schemas.HardwareItemResponse)
def update_hardware(item_id: int, item: schemas.HardwareItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.HardwareItem).filter(models.HardwareItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Hardware item not found")
        
    # Update base fields
    for key, value in item.model_dump(exclude={"images"}).items():
        setattr(db_item, key, value)
        
    # Re-associate images (simple approach: clear old and add new ones from payload)
    db.query(models.HardwareImage).filter(models.HardwareImage.hardware_id == item_id).delete()
    if item.images:
        for path in item.images:
            db_item.images.append(models.HardwareImage(image_path=path))
            
    db.commit()
    db.refresh(db_item)
    return db_item


@app.delete("/api/v1/hardware/{item_id}", status_code=204)
def delete_hardware(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.HardwareItem).filter(models.HardwareItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Hardware item not found")
    db.delete(db_item)
    db.commit()


# ========================
# Deployment Endpoints
# ========================

@app.get("/api/v1/deployments", response_model=List[schemas.DeploymentResponse])
def get_all_deployments(db: Session = Depends(get_db)):
    return db.query(models.Deployment).all()


@app.get("/api/v1/deployments/{dep_id}", response_model=schemas.DeploymentResponse)
def get_deployment(dep_id: int, db: Session = Depends(get_db)):
    dep = db.query(models.Deployment).filter(models.Deployment.id == dep_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
    return dep


@app.post("/api/v1/deployments", response_model=schemas.DeploymentResponse, status_code=201)
def create_deployment(dep: schemas.DeploymentCreate, db: Session = Depends(get_db)):
    dep_data = dep.model_dump(exclude={"hardware_ids", "tagged_hardware"})
    db_dep = models.Deployment(**dep_data)
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    
    if dep.tagged_hardware:
        for tag in dep.tagged_hardware:
            hw = db.query(models.HardwareItem).filter(models.HardwareItem.id == tag.id).first()
            if hw:
                hw.deployment_id = db_dep.id
                hw.issued_date = tag.issued_date
        db.commit()
        db.refresh(db_dep)
    elif dep.hardware_ids:
        hardware_items = db.query(models.HardwareItem).filter(models.HardwareItem.id.in_(dep.hardware_ids)).all()
        for hw in hardware_items:
            hw.deployment_id = db_dep.id
        db.commit()
        db.refresh(db_dep)
        
    return db_dep


@app.put("/api/v1/deployments/{dep_id}", response_model=schemas.DeploymentResponse)
def update_deployment(dep_id: int, dep: schemas.DeploymentCreate, db: Session = Depends(get_db)):
    db_dep = db.query(models.Deployment).filter(models.Deployment.id == dep_id).first()
    if not db_dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
        
    dep_data = dep.model_dump(exclude={"hardware_ids", "tagged_hardware"})
    for key, value in dep_data.items():
        setattr(db_dep, key, value)
        
    # Reset old hardware
    old_hw = db.query(models.HardwareItem).filter(models.HardwareItem.deployment_id == dep_id).all()
    for hw in old_hw:
        hw.deployment_id = None
        hw.issued_date = None
        
    # Assign new hardware
    if dep.tagged_hardware:
        for tag in dep.tagged_hardware:
            hw = db.query(models.HardwareItem).filter(models.HardwareItem.id == tag.id).first()
            if hw:
                hw.deployment_id = dep_id
                hw.issued_date = tag.issued_date
    elif dep.hardware_ids:
        new_hw = db.query(models.HardwareItem).filter(models.HardwareItem.id.in_(dep.hardware_ids)).all()
        for hw in new_hw:
            hw.deployment_id = dep_id
            
    db.commit()
    db.refresh(db_dep)
    return db_dep


@app.delete("/api/v1/deployments/{dep_id}", status_code=204)
def delete_deployment(dep_id: int, db: Session = Depends(get_db)):
    db_dep = db.query(models.Deployment).filter(models.Deployment.id == dep_id).first()
    if not db_dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
        
    # Free existing hardware
    old_hw = db.query(models.HardwareItem).filter(models.HardwareItem.deployment_id == dep_id).all()
    for hw in old_hw:
        hw.deployment_id = None
        hw.issued_date = None
        
    db.delete(db_dep)
    db.commit()


# ========================
# Employee Endpoints
# ========================

@app.get("/api/v1/employee/deployments", response_model=List[schemas.DeploymentResponse])
def get_employee_deployments(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db)
):
    user = _get_user_from_token(authorization, db)
    # Match deployments where deployed_to equals the employee's full_name (primary), or fallback to username/email
    conditions = (models.Deployment.deployed_to == user.username)
    if user.full_name:
        conditions = conditions | (models.Deployment.deployed_to == user.full_name)
    conditions = conditions | (models.Deployment.emp_3_code == user.username) | (models.Deployment.contact_info == user.email)
    return db.query(models.Deployment).options(joinedload(models.Deployment.hardware_items)).filter(conditions).all()


# ========================
# Reports Endpoint
# ========================

@app.get("/api/v1/reports/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    all_hardware = db.query(models.HardwareItem).options(joinedload(models.HardwareItem.deployment)).all()
    all_deployments = db.query(models.Deployment).options(joinedload(models.Deployment.hardware_items)).all()

    total_items = len(all_hardware)
    total_deployed = len([h for h in all_hardware if h.deployment_id is not None])
    total_undeployed = total_items - total_deployed
    total_deployments = len(all_deployments)

    # Designation breakdown
    designation_counts = {}
    for hw in all_hardware:
        d = hw.designation or "Unset"
        designation_counts[d] = designation_counts.get(d, 0) + 1

    # Hardware type breakdown
    type_counts = {}
    for hw in all_hardware:
        t = hw.hardware_type or "Unknown"
        type_counts[t] = type_counts.get(t, 0) + 1

    # Department breakdown
    dept_counts = {}
    for dep in all_deployments:
        dept = dep.department or "Unknown"
        dept_counts[dept] = dept_counts.get(dept, 0) + len(dep.hardware_items)

    # Per-employee summary
    employee_list = []
    for dep in all_deployments:
        employee_list.append({
            "id": dep.id,
            "emp_3_code": dep.emp_3_code,
            "deployed_to": dep.deployed_to,
            "department": dep.department,
            "location": dep.location,
            "contact_info": dep.contact_info,
            "received_date": dep.received_date,
            "hardware_count": len(dep.hardware_items),
            "hardware_items": [
                {
                    "ckt_item_number": hw.ckt_item_number,
                    "hardware_type": hw.hardware_type,
                    "manufacturer": hw.manufacturer,
                    "model": hw.model,
                    "serial_number": hw.serial_number,
                    "designation": hw.designation,
                    "issued_date": hw.issued_date,
                }
                for hw in dep.hardware_items
            ]
        })

    return {
        "total_items": total_items,
        "total_deployed": total_deployed,
        "total_undeployed": total_undeployed,
        "total_deployments": total_deployments,
        "designation_breakdown": designation_counts,
        "type_breakdown": type_counts,
        "department_breakdown": dept_counts,
        "employee_list": employee_list,
    }


# ========================
# Auth Endpoints
# ========================

# In-memory token store: {token: user_id}
_active_tokens: dict = {}

# In-memory reset tokens: {token: email}
_reset_tokens: dict = {}


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def _make_token(user_id: int) -> str:
    raw = secrets.token_bytes(32)
    token = base64.urlsafe_b64encode(raw).decode()
    _active_tokens[token] = user_id
    return token


def _get_user_from_token(authorization: Optional[str], db: Session):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    user_id = _active_tokens.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.post("/api/v1/auth/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = models.User(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        hashed_password=_hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/v1/auth/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not db_user or db_user.hashed_password != _hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = _make_token(db_user.id)
    return {"access_token": token, "token_type": "bearer", "user": db_user}


@app.get("/api/v1/auth/me", response_model=schemas.UserResponse)
def get_me(authorization: Optional[str] = Header(default=None), db: Session = Depends(get_db)):
    return _get_user_from_token(authorization, db)


@app.post("/api/v1/auth/logout")
def logout(authorization: Optional[str] = Header(default=None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        _active_tokens.pop(token, None)
    return {"message": "Logged out"}


@app.post("/api/v1/auth/forgot-password")
def forgot_password(body: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    # Always return success to avoid email enumeration
    if user:
        token = secrets.token_urlsafe(32)
        _reset_tokens[token] = body.email
    return {"message": "If an account with that email exists, a reset link has been sent."}


@app.post("/api/v1/auth/reset-password")
def reset_password(body: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    email = _reset_tokens.get(body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = _hash_password(body.new_password)
    db.commit()
    _reset_tokens.pop(body.token, None)
    return {"message": "Password reset successful"}
