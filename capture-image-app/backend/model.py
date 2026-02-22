from sqlalchemy import Column, Integer, String, LargeBinary
from backend.database import Base


class ImageModel(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    filename = Column(String(255))
    image_data = Column(LargeBinary)  # Cross-database binary column