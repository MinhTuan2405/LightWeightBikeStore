from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from models.staff import Staff
from schemas.auth import RegisterRequest, LoginRequest
from core.security import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

class AuthService:
    @staticmethod
    def register_staff(db: Session, request: RegisterRequest) -> Staff:
        """Đăng ký tài khoản staff mới (hash mật khẩu, kiểm tra trùng lặp)"""
        # Kiểm tra username hoặc email đã tồn tại
        existing_user = db.query(Staff).filter(
            (Staff.username == request.username) | (Staff.email == request.email)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )
        
        # Hash password (không lưu plain-text)
        hashed_pwd = hash_password(request.password)
        
        # Tạo staff mới
        new_staff = Staff(
            username=request.username,
            email=request.email,
            hashed_password=hashed_pwd,
            first_name=request.first_name,
            last_name=request.last_name,
            phone=request.phone,
            role=request.role
        )
        
        try:
            db.add(new_staff)
            db.commit()
            db.refresh(new_staff)
            return new_staff
        except IntegrityError as e:
            db.rollback()
            print(f"IntegrityError: {e}")  # Log để debug (ví dụ: vi phạm unique)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Database integrity error: {str(e.orig)}"
            )
    
    @staticmethod
    def login(db: Session, request: LoginRequest) -> dict:
        """Đăng nhập: xác thực mật khẩu, kiểm tra active, trả JWT"""
        # Tìm user theo username
        user = db.query(Staff).filter(Staff.username == request.username).first()
        
        # Verify password
        if not user or not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        # Kiểm tra tài khoản active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account"
            )
        
        # Tạo JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user.username,
                "staff_id": user.staff_id,
                "role": user.role
            },
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
