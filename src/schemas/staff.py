from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ========== REQUEST SCHEMAS ==========

class StaffUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    active: Optional[bool] = None
    manager_id: Optional[int] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

# ========== RESPONSE SCHEMAS ==========

class StaffListResponse(BaseModel):
    staff_id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    active: bool
    manager_id: Optional[int] = None
    username: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
