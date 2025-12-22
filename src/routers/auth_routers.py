from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, StaffResponse, StaffProfileUpdate
from services.auth_service import AuthService
from middleware.auth import get_current_user, require_admin
from models.staff import Staff

# Nhóm các endpoint liên quan đến xác thực dưới prefix /api/auth
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest, 
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """
    ĐĂNG KÝ TÀI KHOẢN MỚI (CHỈ ADMIN)
    - Mặc định tạo ADMIN (role không quản lý ai)
    - Nếu tạo STAFF: Staff đó sẽ được quản lý bởi admin tạo ra họ
    - username: Tên đăng nhập (duy nhất)
    - email: Email (duy nhất, bắt buộc)
    - password: Mật khẩu (>= 8 ký tự)
    - role: ADMIN hoặc STAFF (mặc định ADMIN)
    """
    return AuthService.register_staff(db, request, current_user)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    ĐĂNG NHẬP: Trả về JWT access token
    """
    return AuthService.login(db, request)

@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Lấy token theo chuẩn OAuth2 (dùng cho Swagger UI Authorize)
    """
    request = LoginRequest(username=form_data.username, password=form_data.password)
    return AuthService.login(db, request)

@router.get("/me", response_model=StaffResponse)
def get_current_user_info(current_user: Staff = Depends(get_current_user)):
    """
    Lấy thông tin user hiện tại (cần JWT Bearer token)
    """
    return current_user

@router.put("/profile", response_model=StaffResponse)
def update_own_profile(
    request: StaffProfileUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """
    CẬP NHẬT THÔNG TIN CÁ NHÂN (CẢ ADMIN VÀ STAFF)
    Staff có thể tự cập nhật thông tin của mình NGOẠI TRỪ email
    - first_name, last_name, phone, password có thể thay đổi
    - Email CHỈ admin mới có quyền thay đổi (qua endpoint /api/staffs/{id})
    """
    return AuthService.update_own_profile(db, current_user.staff_id, request)

@router.get("/admin-only")
def admin_only_route(current_user: Staff = Depends(require_admin)):
    """
    Endpoint ví dụ chỉ cho ADMIN (minh họa phân quyền)
    """
    return {
        "message": f"Hello Admin {current_user.username}!",
        "role": current_user.role
    }
