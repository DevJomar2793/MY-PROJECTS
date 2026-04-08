from typing import Optional
from pydantic import BaseModel


class ScreenBase(BaseModel):
    """Shared fields for Screen create and update."""

    alpha: str
    Screen_type: int
    screen_number: int
    screen_description: str
    file_label: str
    screen_label: str
    notes: Optional[str] = ""
    status: str
    sitemap: Optional[str] = ""


class ScreenCreate(ScreenBase):
    """Schema used when creating a new Screen (POST body)."""

    pass


class ScreenUpdate(BaseModel):
    """
    Schema used when updating a Screen (PUT body).
    All fields are optional so partial updates are supported.
    """

    alpha: Optional[str] = None
    Screen_type: Optional[int] = None
    screen_number: Optional[int] = None
    screen_description: Optional[str] = None
    file_label: Optional[str] = None
    screen_label: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    sitemap: Optional[str] = None


class ScreenResponse(ScreenBase):
    """Schema returned in API responses (includes the auto-generated id)."""

    id: int

    model_config = {"from_attributes": True}
