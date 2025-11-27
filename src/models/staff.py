from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base

class Staff(Base):
    __tablename__ = "staffs"
    
    staff_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    phone = Column(String(15))
    role = Column(String(20), default="STAFF")  # ADMIN hoặc STAFF
    is_active = Column(Boolean, default=True)
    manager_id = Column(Integer, ForeignKey("staffs.staff_id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
