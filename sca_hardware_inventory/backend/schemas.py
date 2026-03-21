from pydantic import BaseModel
from typing import Optional, List


# ---- Image Schemas ----
class HardwareImageResponse(BaseModel):
    id: int
    image_path: str

    model_config = {"from_attributes": True}


# ---- Deployment Schemas ----
class DeploymentBase(BaseModel):
    emp_3_code: str
    deployed_to: str
    location: Optional[str] = None
    department: Optional[str] = None
    contact_info: Optional[str] = None
    received_date: Optional[str] = None


# ---- Hardware Schemas ----
class HardwareItemBase(BaseModel):
    ckt_item_number: str
    hardware_type: str
    manufacturer: str
    model: str
    qty: int
    serial_number: str
    warranty: str
    screen_size: str
    processor: str
    processor_speed: str
    operating_system: str
    ram: str
    storage_type: str
    storage: str
    date_added: Optional[str] = None
    date_received: Optional[str] = None
    delivered_by: Optional[str] = None
    date_tested: Optional[str] = None
    designation: Optional[str] = None
    price_php: Optional[float] = None
    price_usd: Optional[float] = None
    notes: Optional[str] = None
    deployment_id: Optional[int] = None


class HardwareItemCreate(HardwareItemBase):
    # Optional list of image paths (URLs or filenames) chosen during creation
    images: Optional[List[str]] = []


class HardwareItemResponse(HardwareItemBase):
    id: int
    images: List[HardwareImageResponse] = []
    deployment: Optional[DeploymentBase] = None

    model_config = {"from_attributes": True}


class DeploymentCreate(DeploymentBase):
    hardware_ids: Optional[List[int]] = []


class DeploymentResponse(DeploymentBase):
    id: int
    hardware_items: List[HardwareItemResponse] = []

    model_config = {"from_attributes": True}


# ---- Auth Schemas ----
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
