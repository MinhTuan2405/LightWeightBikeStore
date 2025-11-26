from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from core.database import Base

class Staff(Base):
    __tablename__ = "staffs"

    staff_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column (String, nullable=False, unique=True)
    phone = Column(String(25))
    active = Column(Boolean, nullable=False)
    store_id = Column(Integer, ForeignKey("stores.store_id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("staffs.staff_id"))
