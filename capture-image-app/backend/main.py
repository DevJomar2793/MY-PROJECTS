from fastapi import FastAPI, UploadFile, File, Depends
from sqlalchemy.orm import Session

from database import Sessionlocal, engine
from model import Base, ImageModel
from schema import ImageCreate

app = FastAPI()

#Create Database Table
Base.metadata.create_all(bind=engine)

#Dependency
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/v1/upload-image", response_model=ImageCreate)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    image_byte = await file.read()

    new_image = ImageModel(filename=file.filename, image_data=image_byte)

    db.add(new_image)
    db.commit()

    return new_image