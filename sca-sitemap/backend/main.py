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

#Database Connection
# @app.get("/db-check")
# def get_data(db: Session = Depends(get_db)):
#     try:
#         db.execute(text("SELECT 1"))
#         return {"Status:": "Database Connected"}
#     except Exception as e:
#         return {"Status": "Database Failed", "error": str(e)}

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


@app.get("/api/v1/GetSpecificScreen", response_model=List[PageResponse])
def get_screen(db: Session = Depends(get_db)):
    return db.query(ScreenList).order_by(ScreenList.id.desc()).all()

@app.get("/api/v1/GetBuyerScreen", response_model=List[PageResponse])
def get_buyers_creen(db: Session = Depends(get_db)):
    return db.query(ScreenList).filter(ScreenList.alpha == "B").order_by(ScreenList.id.desc()).all()

@app.put("/api/v1/UpdateBuyerScreen/{id}")
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

    @app.get("/api/v1/screens/search")
    def search_screen(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
        
        results = (db.query(Screen).filter(or_(Screen.screen_label.ilike(f"%{q}"))).order_by(Screen.id.desc()).all())


    return results
