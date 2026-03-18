from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class HardwareItem(Base):
    __tablename__ = "hardware_items"

    id = Column(Integer, primary_key=True, index=True)
    ckt_item_number = Column(String, unique=True, index=True)
    hardware_type = Column(String)
    qty = Column(Integer)
    manufacturer = Column(String)
    model = Column(String)
    serial_number = Column(String)
    warranty = Column(String)
    screen_size = Column(String)
    processor = Column(String)
    processor_speed = Column(String)
    operating_system = Column(String)
    ram = Column(String)
    storage_type = Column(String)
    storage = Column(String)
    date_added = Column(String)
    date_received = Column(String)
    delivered_by = Column(String)
    date_tested = Column(String)
    designation = Column(String)
    deployment_id = Column(Integer, ForeignKey("deployments.id"), nullable=True)

    # Relationships
    images = relationship("HardwareImage", back_populates="hardware", cascade="all, delete-orphan")
    deployment = relationship("Deployment", back_populates="hardware_items")


class HardwareImage(Base):
    __tablename__ = "hardware_images"

    id = Column(Integer, primary_key=True, index=True)
    hardware_id = Column(Integer, ForeignKey("hardware_items.id"))
    image_path = Column(String)

    hardware = relationship("HardwareItem", back_populates="images")


class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    emp_3_code = Column(String, index=True)
    deployed_to = Column(String)
    location = Column(String)
    department = Column(String)
    contact_info = Column(String)
    received_date = Column(String)
    
    # Relationship to hardware
    hardware_items = relationship("HardwareItem", back_populates="deployment")

