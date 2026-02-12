from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class ScreenList(Base):
    __tablename__ = "tbl_screen_list"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    alpha = Column(String(5))
    screen_number = Column(String(10), nullable=False)
    screen_type = Column(String(10), nullable=False)
    screen_description = Column(String(250), nullable=False)
    file_label = Column(String(100), nullable=False)
    screen_label = Column(String(150), nullable=False)
    notes = Column(String(250), nullable=True)
    sitemap = Column(String(250), nullable=False)
    created_at = Column(DateTime, default=func.now(), server_default=func.now(), nullable=False)

