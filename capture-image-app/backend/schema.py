from pydantic import BaseModel

class ImageCreate(BaseModel):
    id: int
    filename: str

    class config:
        orm_model = True
    