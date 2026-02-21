from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.mysql import LONGBLOB
from database import Base

class ImageModel(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    filename = Column(String(255))
    image_data = Column(LONGBLOB)  # Can store up to 4GB