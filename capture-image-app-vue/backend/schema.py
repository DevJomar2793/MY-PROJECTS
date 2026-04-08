from pydantic import BaseModel

class ImageCreate(BaseModel):
    id: int
    filename: str

    class Config:
        from_attributes = True

class ImageResponse(BaseModel):
    id: int
    filename: str

    class Config:
        from_attributes = True