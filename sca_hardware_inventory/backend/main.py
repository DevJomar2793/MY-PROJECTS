from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db

# Create all tables in the SQLite database
models.Base.metadata.create_all(bind=engine)

#Delete table hardware_items
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


# ---- Health Check ----        
@app.get("/")
def root():
    return {"message": "SCA Hardware Inventory API is running 🚀"}


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
    db_item = models.HardwareItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.put("/api/v1/hardware/{item_id}", response_model=schemas.HardwareItemResponse)
def update_hardware(item_id: int, item: schemas.HardwareItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.HardwareItem).filter(models.HardwareItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Hardware item not found")
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
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
    db_dep = models.Deployment(**dep.model_dump())
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    return db_dep


@app.put("/api/v1/deployments/{dep_id}", response_model=schemas.DeploymentResponse)
def update_deployment(dep_id: int, dep: schemas.DeploymentCreate, db: Session = Depends(get_db)):
    db_dep = db.query(models.Deployment).filter(models.Deployment.id == dep_id).first()
    if not db_dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
    for key, value in dep.model_dump().items():
        setattr(db_dep, key, value)
    db.commit()
    db.refresh(db_dep)
    return db_dep


@app.delete("/api/v1/deployments/{dep_id}", status_code=204)
def delete_deployment(dep_id: int, db: Session = Depends(get_db)):
    db_dep = db.query(models.Deployment).filter(models.Deployment.id == dep_id).first()
    if not db_dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
    db.delete(db_dep)
    db.commit()
