from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Sessionlocal, engine
from model import Base, ImageModel
from schema import ImageCreate, ImageResponse
import base64


app = FastAPI()

# Add CORS middleware BEFORE other middleware and routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

#Create Database Table
# Base.metadata.drop_all(bind=engine)  # Drop existing tables
Base.metadata.create_all(bind=engine)  # Recreate with new schema

#Dependency
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/v1/upload-image", response_model=ImageResponse)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        print(f"Receiving file: {file.filename}")
        image_byte = await file.read()
        print(f"File size: {len(image_byte)} bytes")

        new_image = ImageModel(filename=file.filename, image_data=image_byte)
        print("ImageModel created")

        db.add(new_image)
        db.commit()
        db.refresh(new_image)
        print(f"Image saved with ID: {new_image.id}")

        return new_image
    except Exception as e:
        print(f"Error in upload_image: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/v1/images")
def list_images(db: Session = Depends(get_db)):
    """Return list of images with base64-encoded data."""
    imgs = db.query(ImageModel).order_by(ImageModel.id.desc()).all()
    result = []
    for img in imgs:
        try:
            b64 = base64.b64encode(img.image_data).decode("utf-8") if img.image_data else ""
        except Exception:
            b64 = ""
        result.append({
            "id": img.id,
            "filename": img.filename,
            "data": b64,
        })
    return result

# if __name__ == " __main__ ":
#     uvicorn.run(app, host="0.0.0.0", port=8000)