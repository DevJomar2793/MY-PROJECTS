from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PageCreate(BaseModel):
    alpha: str
    screen_number: int
    screen_type: str
    screen_description: str
    file_label: str
    screen_label: str
    notes: str
    sitemap: str


class PageResponse(BaseModel):
    id: int
    alpha: str
    screen_number: int
    screen_type: str
    screen_description: Optional[str]
    file_label: str
    screen_label: Optional[str]
    notes: Optional[str]
    sitemap: Optional[str]
    created_at: Optional[datetime]

class PageUpdate(BaseModel):
    alpha: str | None = None
    screen_number: int | None = None
    screen_type: str | None = None
    screen_description: str | None = None
    file_label: str | None = None
    screen_label: str | None = None
    notes: str | None = None
    sitemap: str | None = None


    class Config:
        from_attributes = True
     