from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid

import models, schemas
from database import engine, get_db

# Create all tables in the SQLite database
models.Base.metadata.create_all(bind=engine)

# Delete table hardware_items
# models.HardwareItem.metadata.drop_all(bind=engine)

app = FastAPI(title="SCA Hardware Inventory API", version="1.0.0")

# Allow requests from Vue dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
# Mount the uploads folder
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


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
    return db.query(models.HardwareItem).all()


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
    dep_data = dep.model_dump(exclude={"hardware_ids"})
    db_dep = models.Deployment(**dep_data)
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    
    if dep.hardware_ids:
        hardware_items = db.query(models.HardwareItem).filter(models.HardwareItem.id.in_(dep.hardware_ids)).all()
        for hw in hardware_items:
            hw.deployment_id = db_dep.id
            hw.designation = "Deployed"
        db.commit()
        db.refresh(db_dep)
        
    return db_dep


@app.put("/api/v1/deployments/{dep_id}", response_model=schemas.DeploymentResponse)
def update_deployment(dep_id: int, dep: schemas.DeploymentCreate, db: Session = Depends(get_db)):
    db_dep = db.query(models.Deployment).filter(models.Deployment.id == dep_id).first()
    if not db_dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
        
    dep_data = dep.model_dump(exclude={"hardware_ids"})
    for key, value in dep_data.items():
        setattr(db_dep, key, value)
        
    # Reset old hardware
    old_hw = db.query(models.HardwareItem).filter(models.HardwareItem.deployment_id == dep_id).all()
    for hw in old_hw:
        hw.deployment_id = None
        hw.designation = "Available"
        
    # Assign new hardware
    if dep.hardware_ids:
        new_hw = db.query(models.HardwareItem).filter(models.HardwareItem.id.in_(dep.hardware_ids)).all()
        for hw in new_hw:
            hw.deployment_id = dep_id
            hw.designation = "Deployed"
            
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
        hw.designation = "Available"
        
    db.delete(db_dep)
    db.commit()
