from sqlalchemy import Column, Integer, String, Text
from database import Base


class ScreenModel(Base):
    """
    ORM model for the 'screens' table.
    Mirrors the Screen type defined in the Next.js frontend context.
    """

    __tablename__ = "screens"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alpha = Column(String(10), nullable=False)
    Screen_type = Column(Integer, nullable=False, default=0)
    screen_number = Column(Integer, nullable=False)
    screen_description = Column(String(255), nullable=False, default="")
    file_label = Column(String(255), nullable=False, default="")
    screen_label = Column(String(100), nullable=False, default="")
    notes = Column(Text, nullable=True, default="")
    status = Column(String(50), nullable=False, default="Active")
    sitemap = Column(Text, nullable=True, default="")
