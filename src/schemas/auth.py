from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    """Schema đăng ký tài khoản"""
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: Optional[str] = "STAFF"
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ['ADMIN', 'STAFF']:
            raise ValueError('Role must be ADMIN or STAFF')
        return v

class LoginRequest(BaseModel):
    """Schema đăng nhập"""
    username: str
    password: str

class TokenResponse(BaseModel):
    """Schema JWT token response"""
    access_token: str
    token_type: str

class StaffResponse(BaseModel):
    """Schema thông tin staff (không có password)"""
    staff_id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
