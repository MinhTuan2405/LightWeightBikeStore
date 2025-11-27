from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, StaffResponse
from services.auth_service import AuthService
from middleware.auth import get_current_user, require_admin
from models.staff import Staff

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    DANG KY TAI KHOAN MOI
    
    - **username**: Ten dang nhap (unique)
    - **email**: Email (unique)
    - **password**: Mat khau (>= 8 ky tu)
    - **role**: ADMIN hoac STAFF
    """
    return AuthService.register_staff(db, request)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    DANG NHAP
    
    Tra ve JWT access token
    """
    return AuthService.login(db, request)

@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAUTH2 TOKEN
    
    Dung cho Swagger UI Authorize button
    """
    request = LoginRequest(username=form_data.username, password=form_data.password)
    return AuthService.login(db, request)

@router.get("/me", response_model=StaffResponse)
def get_current_user_info(current_user: Staff = Depends(get_current_user)):
    """
    THONG TIN USER HIEN TAI
    
    Yeu cau JWT token trong header
    """
    return current_user

@router.get("/admin-only")
def admin_only_route(current_user: Staff = Depends(require_admin)):
    """
    ENDPOINT CHI ADMIN
    
    Vi du ve phan quyen
    """
    return {
        "message": f"Hello Admin {current_user.username}!",
        "role": current_user.role
    }
