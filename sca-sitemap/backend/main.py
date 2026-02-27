from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.templating import Jinja2Templates
from sqlalchemy import text, or_
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from schemas import PageCreate, PageResponse, PageUpdate
from models import ScreenList
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
def create_page(page: PageCreate, db: Session = Depends(get_db)):

    new_page = ScreenList(
            alpha=page.alpha,
            screen_number=page.screen_number,
            screen_type=page.screen_type,
            screen_description=page.screen_description,
            file_label=page.file_label,
            screen_label=page.screen_label,
            notes=page.notes,
            sitemap=page.sitemap,
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
def update_screen(id: int, data: PageUpdate, db: Session = Depends(get_db)):
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


# Search Screen
@app.get("/api/v1/screens/search")
def search_screen(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    
    results = (db.query(Screen).filter(or_(Screen.screen_label.ilike(f"%{q}"))).order_by(Screen.id.desc()).all())


    return results

# Delete Screen
@app.delete("/api/v1/DeleteScreen/{id}")
def delete_screen(id: int, db: Session = Depends(get_db)):
    screen = db.query(ScreenList).filter(ScreenList.id == id).first()
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")
    
    db.delete(screen)
    db.commit()
    return {"message": "Successfully Deleted"}
