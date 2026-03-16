from pydantic import BaseModel
from typing import Optional


# ---- Hardware Schemas ----
class HardwareItemBase(BaseModel):
    ckt_item_number: str
    hardware_type: str
    manufacturer: str
    model: str
    date_tested: Optional[str] = None
    designation: Optional[str] = None


class HardwareItemCreate(HardwareItemBase):
    pass


class HardwareItemResponse(HardwareItemBase):
    id: int

    model_config = {"from_attributes": True}


# ---- Deployment Schemas ----
class DeploymentBase(BaseModel):
    ckt_item_number: str
    deployed_to: str
    location: Optional[str] = None
    quantity: Optional[int] = 1
    history: Optional[str] = None
    received_date: Optional[str] = None


class DeploymentCreate(DeploymentBase):
    pass


class DeploymentResponse(DeploymentBase):
    id: int

    model_config = {"from_attributes": True}
