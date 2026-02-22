from backend.database import Sessionlocal
from backend.model import ImageModel

def main():
    db = Sessionlocal()
    try:
        imgs = db.query(ImageModel).all()
        print(f"Found {len(imgs)} rows")
        for img in imgs:
            print(img.id, img.filename, len(img.image_data) if img.image_data else 0)
    finally:
        db.close()

if __name__ == '__main__':
    main()
