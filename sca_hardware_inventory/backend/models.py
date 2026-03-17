from sqlalchemy import Column, Integer, String, Date
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
    date_tested = Column(String)
    designation = Column(String)


class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    ckt_item_number = Column(String, index=True)
    deployed_to = Column(String)
    location = Column(String)
    quantity = Column(Integer, default=1)
    history = Column(String)
    received_date = Column(String)
