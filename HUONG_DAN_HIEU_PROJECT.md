# 📚 TỔNG HỢP KIẾN THỨC - LIGHTWEIGHT BIKE STORE API

> **Dành cho:** Newbie học Backend  
> **Ngày tạo:** 27/11/2024  
> **Công nghệ:** FastAPI + PostgreSQL + JWT Authentication + Alembic

---

# 📋 MỤC LỤC

1. [Tổng quan Project](#1-tổng-quan-project)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Giải thích từng file](#3-giải-thích-từng-file)
4. [Flow hoạt động](#4-flow-hoạt-động)
5. [Các khái niệm quan trọng](#5-các-khái-niệm-quan-trọng)
6. [Hướng dẫn chạy project](#6-hướng-dẫn-chạy-project)
7. [Câu hỏi thường gặp](#7-câu-hỏi-thường-gặp)

---

# 1. TỔNG QUAN PROJECT

## 1.1. Project này làm gì?

Đây là **Backend API** cho một cửa hàng xe đạp, bao gồm:

- **Authentication (Xác thực):** Đăng ký, đăng nhập tài khoản
- **Authorization (Phân quyền):** Phân biệt quyền ADMIN và STAFF
- **JWT Token:** Bảo mật API bằng token
- **Database:** Kết nối với Supabase (PostgreSQL)
- **Alembic:** Quản lý thay đổi database

## 1.2. Công nghệ sử dụng

| Công nghệ      | Mục đích                                 |
| -------------- | ---------------------------------------- |
| **FastAPI**    | Framework Python để tạo API              |
| **SQLAlchemy** | ORM - Giao tiếp với database bằng Python |
| **PostgreSQL** | Database (Supabase)                      |
| **JWT**        | Token để xác thực người dùng             |
| **Bcrypt**     | Mã hóa password                          |
| **Alembic**    | Quản lý migration database               |
| **Pydantic**   | Validate dữ liệu đầu vào                 |

## 1.3. Sơ đồ tổng quan

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   FastAPI   │────▶│  SQLAlchemy │────▶│  Supabase   │
│  (Browser)  │◀────│   (API)     │◀────│   (ORM)     │◀────│ (Database)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  JWT Token  │
                    │ (Bảo mật)   │
                    └─────────────┘
```

---

# 2. CẤU TRÚC THƯ MỤC

```
LightWeightBikeStore-main/
│
├── database/                      # Scripts SQL
│   ├── create_database.sql        # Tạo bảng trong database
│   └── loading_data_to_database.sql # Thêm data mẫu
│
├── src/                           # Source code chính
│   │
│   ├── core/                      # ⭐ CỐT LÕI - Cấu hình hệ thống
│   │   ├── __init__.py
│   │   ├── database.py            # Kết nối database
│   │   └── security.py            # Mã hóa password + JWT
│   │
│   ├── models/                    # ⭐ MODELS - Định nghĩa bảng database
│   │   ├── __init__.py
│   │   ├── staff.py               # Bảng nhân viên
│   │   ├── customer.py            # Bảng khách hàng
│   │   ├── product.py             # Bảng sản phẩm
│   │   ├── brand.py               # Bảng thương hiệu
│   │   ├── category.py            # Bảng danh mục
│   │   ├── order.py               # Bảng đơn hàng
│   │   ├── order_item.py          # Bảng chi tiết đơn hàng
│   │   └── stock.py               # Bảng tồn kho
│   │
│   ├── schemas/                   # ⭐ SCHEMAS - Validate dữ liệu
│   │   ├── __init__.py
│   │   └── auth.py                # Schema cho đăng ký, đăng nhập
│   │
│   ├── services/                  # ⭐ SERVICES - Logic nghiệp vụ
│   │   ├── __init__.py
│   │   └── auth_service.py        # Xử lý đăng ký, đăng nhập
│   │
│   ├── middleware/                # ⭐ MIDDLEWARE - Kiểm tra trước khi vào API
│   │   ├── __init__.py
│   │   └── auth.py                # Kiểm tra token, phân quyền
│   │
│   ├── routers/                   # ⭐ ROUTERS - Định nghĩa API endpoints
│   │   ├── __init__.py
│   │   ├── auth_routers.py        # API đăng ký, đăng nhập
│   │   ├── customer_routers.py    # API khách hàng
│   │   ├── product_routers.py     # API sản phẩm
│   │   └── ...
│   │
│   ├── alembic/                   # ⭐ ALEMBIC - Quản lý database migration
│   │   ├── env.py                 # Cấu hình Alembic
│   │   └── versions/              # Các file migration
│   │
│   ├── .env                       # ⚠️ QUAN TRỌNG - Biến môi trường (SECRET!)
│   ├── main.py                    # Entry point - Khởi động server
│   ├── create_admin.py            # Script tạo admin user
│   ├── requirements.txt           # Danh sách packages cần cài
│   └── alembic.ini                # Cấu hình Alembic
│
├── .gitignore                     # Các file không push lên git
└── README.md                      # Hướng dẫn project
```

---

# 3. GIẢI THÍCH TỪNG FILE

## 3.1. FILE `.env` - Biến môi trường

```env
# Kết nối database Supabase
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Authentication
SECRET_KEY=your-secret-key-here    # Khóa bí mật để mã hóa token
ALGORITHM=HS256                     # Thuật toán mã hóa
ACCESS_TOKEN_EXPIRE_MINUTES=30      # Token hết hạn sau 30 phút
```

### Giải thích:

- **DATABASE_URL:** Địa chỉ kết nối tới Supabase PostgreSQL
- **SECRET_KEY:** Khóa bí mật dùng để tạo JWT token (KHÔNG được để lộ!)
- **ALGORITHM:** Thuật toán mã hóa HS256 (chuẩn công nghiệp)
- **ACCESS_TOKEN_EXPIRE_MINUTES:** Token sẽ hết hạn sau 30 phút, phải login lại

### Tại sao cần `.env`?

- **Bảo mật:** Không hardcode password/secret vào code
- **Linh hoạt:** Dễ thay đổi khi deploy lên server khác
- **An toàn:** File `.env` được gitignore, không push lên GitHub

---

## 3.2. FILE `core/database.py` - Kết nối Database

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load biến từ file .env
load_dotenv()

# Lấy DATABASE_URL từ .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Tạo engine kết nối database
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "require",      # Supabase yêu cầu SSL
        "connect_timeout": 10,     # Timeout 10 giây
    },
    pool_pre_ping=True,            # Kiểm tra connection trước khi dùng
    pool_recycle=3600,             # Tạo lại connection sau 1 giờ
    pool_size=5,                   # Tối đa 5 connections
    max_overflow=10                # Cho phép thêm 10 connections nếu cần
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class cho tất cả models
Base = declarative_base()

# Dependency để lấy database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Giải thích từng phần:

| Code                        | Ý nghĩa                                          |
| --------------------------- | ------------------------------------------------ |
| `load_dotenv()`             | Đọc file `.env` và load các biến vào môi trường  |
| `os.getenv("DATABASE_URL")` | Lấy giá trị của DATABASE_URL từ .env             |
| `create_engine()`           | Tạo "máy móc" để giao tiếp với database          |
| `SessionLocal`              | "Nhà máy" tạo ra các phiên làm việc với database |
| `Base`                      | Class cha cho tất cả models (bảng)               |
| `get_db()`                  | Hàm cung cấp session, tự động đóng khi xong      |

### Ví dụ minh họa:

```python
# Khi có request API:
# 1. get_db() tạo session mới
# 2. Dùng session để query database
# 3. Khi xong, session tự động đóng (finally: db.close())
```

---

## 3.3. FILE `core/security.py` - Bảo mật

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from dotenv import load_dotenv
import os

# Load biến từ .env
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def hash_password(password: str) -> str:
    """Mã hóa password bằng bcrypt"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh password gốc với password đã hash"""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Tạo JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Giải mã JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### Giải thích từng hàm:

#### 1. `hash_password(password)` - Mã hóa password

```
Input:  "Admin@123456"
Output: "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Tại sao cần hash password?**

- KHÔNG BAO GIỜ lưu password gốc vào database
- Nếu database bị hack, hacker chỉ thấy chuỗi hash vô nghĩa
- Không thể "giải mã" ngược từ hash về password gốc

#### 2. `verify_password(plain, hashed)` - So sánh password

```python
# Khi user đăng nhập:
verify_password("Admin@123456", "$2b$12$N9qo8u...")  # True
verify_password("WrongPass", "$2b$12$N9qo8u...")    # False
```

#### 3. `create_access_token(data)` - Tạo JWT Token

```python
# Input:
data = {
    "sub": "admin",        # Username
    "staff_id": 1,
    "role": "ADMIN"
}

# Output (JWT Token):
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInN0YWZmX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3MzI3MDAwMDB9.xxxxx"
```

**JWT Token gồm 3 phần:**

```
HEADER.PAYLOAD.SIGNATURE

1. HEADER: {"alg": "HS256", "typ": "JWT"}
2. PAYLOAD: {"sub": "admin", "staff_id": 1, "role": "ADMIN", "exp": 1732700000}
3. SIGNATURE: Chữ ký số để verify token không bị sửa
```

#### 4. `decode_access_token(token)` - Giải mã Token

```python
# Input: JWT Token
# Output: Payload (nếu token hợp lệ)
{
    "sub": "admin",
    "staff_id": 1,
    "role": "ADMIN",
    "exp": 1732700000
}
# Output: None (nếu token sai/hết hạn)
```

---

## 3.4. FILE `models/staff.py` - Model Database

```python
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
    role = Column(String(20), default="STAFF")
    is_active = Column(Boolean, default=True)
    manager_id = Column(Integer, ForeignKey("staffs.staff_id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Giải thích:

| Code                            | Ý nghĩa                                  |
| ------------------------------- | ---------------------------------------- |
| `__tablename__ = "staffs"`      | Tên bảng trong database                  |
| `primary_key=True`              | Khóa chính, tự động tăng                 |
| `unique=True`                   | Không được trùng lặp                     |
| `nullable=False`                | Bắt buộc phải có giá trị                 |
| `index=True`                    | Tạo index để tìm kiếm nhanh hơn          |
| `ForeignKey("staffs.staff_id")` | Khóa ngoại - manager cũng là staff       |
| `default="STAFF"`               | Giá trị mặc định nếu không truyền        |
| `server_default=func.now()`     | Database tự động điền thời gian hiện tại |
| `onupdate=func.now()`           | Tự động cập nhật khi có thay đổi         |

### Tương đương với SQL:

```sql
CREATE TABLE staffs (
    staff_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'STAFF',
    is_active BOOLEAN DEFAULT TRUE,
    manager_id INTEGER REFERENCES staffs(staff_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_staffs_username ON staffs(username);
CREATE INDEX idx_staffs_email ON staffs(email);
```

---

## 3.5. FILE `schemas/auth.py` - Validation

```python
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    """Schema đăng ký tài khoản"""
    username: str
    email: EmailStr                    # Tự động validate email
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None        # Không bắt buộc
    role: Optional[str] = "STAFF"      # Mặc định là STAFF

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
    """Schema response JWT token"""
    access_token: str
    token_type: str

class StaffResponse(BaseModel):
    """Schema response thông tin staff"""
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
```

### Giải thích:

**Schema là gì?**

- Schema = "Khuôn mẫu" để validate dữ liệu
- Kiểm tra dữ liệu đầu vào có đúng format không
- Tự động chuyển đổi kiểu dữ liệu

**Ví dụ:**

```python
# Request body khi đăng ký:
{
    "username": "john",
    "email": "not-an-email",    # ❌ Lỗi: không đúng format email
    "password": "123",          # ❌ Lỗi: < 8 ký tự
    "role": "HACKER"            # ❌ Lỗi: không phải ADMIN/STAFF
}

# Pydantic sẽ trả về lỗi chi tiết:
{
    "detail": [
        {"loc": ["body", "email"], "msg": "value is not a valid email"},
        {"loc": ["body", "password"], "msg": "Password must be at least 8 characters"},
        {"loc": ["body", "role"], "msg": "Role must be ADMIN or STAFF"}
    ]
}
```

---

## 3.6. FILE `middleware/auth.py` - Kiểm tra Token & Phân quyền

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from core.database import get_db
from models.staff import Staff
from core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Staff:
    """Middleware: Lấy thông tin user từ JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Giải mã token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    # Lấy username từ token
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception

    # Query user từ database
    user = db.query(Staff).filter(Staff.username == username).first()
    if user is None:
        raise credentials_exception

    # Kiểm tra tài khoản còn active
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    return user

def require_admin(current_user: Staff = Depends(get_current_user)) -> Staff:
    """Middleware: Yêu cầu quyền ADMIN"""
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
```

### Giải thích:

**Middleware là gì?**

- Code chạy TRƯỚC KHI vào API endpoint
- Dùng để kiểm tra authentication/authorization

**Flow hoạt động:**

```
Request với header: "Authorization: Bearer eyJhbGciOiI..."
                              │
                              ▼
                    ┌─────────────────────┐
                    │  oauth2_scheme      │ Lấy token từ header
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  decode_access_token│ Giải mã token
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Query database     │ Tìm user theo username
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Return user object │ Trả về thông tin user
                    └─────────────────────┘
```

**Cách sử dụng:**

```python
# API cần đăng nhập:
@router.get("/me")
def get_me(current_user: Staff = Depends(get_current_user)):
    return current_user

# API chỉ ADMIN truy cập được:
@router.get("/admin-only")
def admin_route(current_user: Staff = Depends(require_admin)):
    return {"message": "Hello Admin!"}
```

---

## 3.7. FILE `services/auth_service.py` - Logic Nghiệp vụ

```python
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from models.staff import Staff
from schemas.auth import RegisterRequest, LoginRequest
from core.security import hash_password, verify_password, create_access_token
from datetime import timedelta

class AuthService:
    @staticmethod
    def register_staff(db: Session, request: RegisterRequest) -> Staff:
        """Đăng ký tài khoản staff mới"""
        # 1. Kiểm tra username/email đã tồn tại chưa
        existing_user = db.query(Staff).filter(
            (Staff.username == request.username) | (Staff.email == request.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )

        # 2. Hash password
        hashed_pwd = hash_password(request.password)

        # 3. Tạo staff mới
        new_staff = Staff(
            username=request.username,
            email=request.email,
            hashed_password=hashed_pwd,
            first_name=request.first_name,
            last_name=request.last_name,
            phone=request.phone,
            role=request.role
        )

        # 4. Lưu vào database
        try:
            db.add(new_staff)
            db.commit()
            db.refresh(new_staff)
            return new_staff
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    @staticmethod
    def login(db: Session, request: LoginRequest) -> dict:
        """Đăng nhập và trả về JWT token"""
        # 1. Tìm user theo username
        user = db.query(Staff).filter(Staff.username == request.username).first()

        # 2. Verify password
        if not user or not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        # 3. Kiểm tra tài khoản active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account"
            )

        # 4. Tạo JWT token
        access_token = create_access_token(
            data={
                "sub": user.username,
                "staff_id": user.staff_id,
                "role": user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
```

### Giải thích:

**Service là gì?**

- Nơi chứa logic nghiệp vụ (business logic)
- Tách biệt logic ra khỏi router để code sạch hơn
- Dễ test và bảo trì

**Flow đăng ký:**

```
RegisterRequest → Validate → Check trùng → Hash password → Insert DB → Return Staff
```

**Flow đăng nhập:**

```
LoginRequest → Find user → Verify password → Check active → Create token → Return token
```

---

## 3.8. FILE `routers/auth_routers.py` - API Endpoints

```python
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
    """Đăng ký tài khoản mới"""
    return AuthService.register_staff(db, request)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập"""
    return AuthService.login(db, request)

@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """OAuth2 token (cho Swagger UI)"""
    request = LoginRequest(username=form_data.username, password=form_data.password)
    return AuthService.login(db, request)

@router.get("/me", response_model=StaffResponse)
def get_current_user_info(current_user: Staff = Depends(get_current_user)):
    """Thông tin user hiện tại"""
    return current_user

@router.get("/admin-only")
def admin_only_route(current_user: Staff = Depends(require_admin)):
    """Endpoint chỉ admin"""
    return {"message": f"Hello Admin {current_user.username}!"}
```

### Giải thích:

**Router là gì?**

- Định nghĩa các API endpoints
- Xác định URL, method (GET/POST/PUT/DELETE)
- Kết nối với service và middleware

**Bảng tổng hợp endpoints:**

| Method | URL                    | Chức năng         | Auth              |
| ------ | ---------------------- | ----------------- | ----------------- |
| POST   | `/api/auth/register`   | Đăng ký tài khoản | Không             |
| POST   | `/api/auth/login`      | Đăng nhập         | Không             |
| POST   | `/api/auth/token`      | OAuth2 token      | Không             |
| GET    | `/api/auth/me`         | Thông tin user    | Cần token         |
| GET    | `/api/auth/admin-only` | Test admin        | Cần token + ADMIN |

---

## 3.9. FILE `main.py` - Entry Point

```python
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth_routers

app = FastAPI(
    title="LightWeight Bike Store API",
    description="Backend API with JWT Authentication & Authorization",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Cho phép tất cả domain
    allow_credentials=True,
    allow_methods=["*"],           # Cho phép tất cả methods
    allow_headers=["*"],           # Cho phép tất cả headers
)

# Default router
default_route = APIRouter(tags=['DEFAULT'])

@default_route.get("/", response_class=JSONResponse)
def read_root():
    return {
        "message": "LightWeight Bike Store API v2.0",
        "docs": "/docs"
    }

@default_route.get("/health", response_class=JSONResponse)
def health_check():
    return {"status": "healthy", "version": "2.0.0"}

# Include routers
app.include_router(default_route)
app.include_router(auth_routers.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

### Giải thích:

**`main.py` là gì?**

- File khởi động của ứng dụng
- Tạo FastAPI app
- Include tất cả routers
- Cấu hình CORS, middleware

**CORS là gì?**

- Cross-Origin Resource Sharing
- Cho phép frontend (VD: React ở localhost:3000) gọi API (localhost:8000)
- Nếu không có CORS, browser sẽ block request

---

## 3.10. FILE `alembic/env.py` - Database Migration

```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import sys
import os

# Thêm đường dẫn src vào Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

# Import Base và tất cả models
from core.database import Base
from models.staff import Staff
from models.customer import Customer
from models.brand import Brand
from models.category import Category
from models.product import Product
from models.order import Order
from models.order_item import OrderItem
from models.stock import Stock

config = context.config
DATABASE_URL = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

target_metadata = Base.metadata
```

### Giải thích:

**Alembic là gì?**

- Tool quản lý database migration
- Theo dõi thay đổi của models
- Tạo scripts để update database

**Migration là gì?**

- "Di cư" = Thay đổi cấu trúc database
- VD: Thêm cột mới, đổi tên bảng, thêm index...

**Tại sao cần Migration?**

- Database đã có data, không thể xóa tạo lại
- Nhiều người làm việc trên cùng project
- Theo dõi lịch sử thay đổi database

**Các lệnh Alembic quan trọng:**

```bash
# Tạo migration mới (sau khi sửa models)
alembic revision --autogenerate -m "Add new column"

# Apply migration lên database
alembic upgrade head

# Xem version hiện tại
alembic current

# Rollback 1 version
alembic downgrade -1
```

---

# 4. FLOW HOẠT ĐỘNG

## 4.1. Flow Đăng ký

```
┌─────────┐    POST /api/auth/register    ┌─────────────┐
│ Client  │ ─────────────────────────────▶│   Router    │
│         │   {username, email, pass...}  │auth_routers │
└─────────┘                               └──────┬──────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │   Schema    │ Validate input
                                          │RegisterReq  │
                                          └──────┬──────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │   Service   │
                                          │ AuthService │
                                          └──────┬──────┘
                                                 │
                              ┌──────────────────┼──────────────────┐
                              │                  │                  │
                              ▼                  ▼                  ▼
                       ┌───────────┐      ┌───────────┐      ┌───────────┐
                       │Check trùng│      │Hash pass  │      │Insert DB  │
                       │username   │      │bcrypt     │      │SQLAlchemy │
                       └───────────┘      └───────────┘      └───────────┘
                                                 │
                                                 ▼
┌─────────┐         201 Created           ┌─────────────┐
│ Client  │ ◀─────────────────────────────│  Response   │
│         │      {staff_id, username...}  │StaffResponse│
└─────────┘                               └─────────────┘
```

## 4.2. Flow Đăng nhập

```
┌─────────┐      POST /api/auth/login      ┌─────────────┐
│ Client  │ ──────────────────────────────▶│   Router    │
│         │     {username, password}       │auth_routers │
└─────────┘                                └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │   Service   │
                                           │ AuthService │
                                           └──────┬──────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                       ┌────────────┐      ┌────────────┐      ┌────────────┐
                       │Find user   │      │Verify pass │      │Create JWT  │
                       │by username │      │bcrypt      │      │Token       │
                       └────────────┘      └────────────┘      └────────────┘
                                                  │
                                                  ▼
┌─────────┐            200 OK              ┌─────────────┐
│ Client  │ ◀──────────────────────────────│  Response   │
│         │      {access_token, type}      │TokenResponse│
└─────────┘                                └─────────────┘
```

## 4.3. Flow Truy cập API có bảo vệ

```
┌─────────┐   GET /api/auth/me             ┌─────────────┐
│ Client  │ ──────────────────────────────▶│   Router    │
│         │   Header: Bearer <token>       │auth_routers │
└─────────┘                                └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │ Middleware  │
                                           │get_current_ │
                                           │    user     │
                                           └──────┬──────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                       ┌────────────┐      ┌────────────┐      ┌────────────┐
                       │Extract     │      │Decode JWT  │      │Query user  │
                       │token from  │      │verify      │      │from DB     │
                       │header      │      │signature   │      │            │
                       └────────────┘      └────────────┘      └────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │Token valid? │
                                           └──────┬──────┘
                                     ┌────────────┴────────────┐
                                     │                         │
                                    Yes                        No
                                     │                         │
                                     ▼                         ▼
┌─────────┐            200 OK        │       ┌─────────┐   401 Unauthorized
│ Client  │ ◀────────────────────────┘       │ Client  │ ◀─────────────────
│         │   {user info}                    │         │   "Could not validate"
└─────────┘                                  └─────────┘
```

---

# 5. CÁC KHÁI NIỆM QUAN TRỌNG

## 5.1. Authentication vs Authorization

|                | Authentication       | Authorization      |
| -------------- | -------------------- | ------------------ |
| **Nghĩa**      | Xác thực             | Phân quyền         |
| **Câu hỏi**    | "Bạn là ai?"         | "Bạn được làm gì?" |
| **Ví dụ**      | Đăng nhập            | ADMIN vs STAFF     |
| **Trong code** | `get_current_user()` | `require_admin()`  |

## 5.2. JWT Token

**JWT = JSON Web Token**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInN0YWZmX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3MzI3MDAwMDB9.xxxxxxxxxxxxx
└──────────── Header ────────────┘└───────────────── Payload ─────────────────┘└─── Signature ───┘
```

**Ưu điểm JWT:**

- Stateless: Server không cần lưu session
- Scalable: Dễ mở rộng nhiều server
- Portable: Dùng được trên mobile, web, API

## 5.3. Bcrypt - Hash Password

```
Password: "Admin@123456"
    ↓
Salt: Random bytes (VD: "$2b$12$N9qo8uLOickgx2ZMRZoMye")
    ↓
Hash: "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Tại sao dùng Bcrypt?**

- Một chiều: Không thể giải mã ngược
- Salt: Cùng password cho hash khác nhau
- Slow: Khó brute-force

## 5.4. ORM - Object Relational Mapping

**Không dùng ORM:**

```python
cursor.execute("SELECT * FROM staffs WHERE username = 'admin'")
```

**Dùng ORM (SQLAlchemy):**

```python
db.query(Staff).filter(Staff.username == "admin").first()
```

**Ưu điểm ORM:**

- Code Python, không cần viết SQL
- Tự động escape để tránh SQL injection
- Dễ đổi database (PostgreSQL → MySQL)

## 5.5. Dependency Injection

```python
def get_current_user(
    token: str = Depends(oauth2_scheme),    # Inject token
    db: Session = Depends(get_db)           # Inject database session
) -> Staff:
    ...
```

**Dependency Injection là gì?**

- "Tiêm" các phụ thuộc vào hàm
- FastAPI tự động gọi các hàm dependency
- Dễ test và tái sử dụng code

---

# 6. HƯỚNG DẪN CHẠY PROJECT

## 6.1. Cài đặt môi trường

```bash
# 1. Di chuyển vào thư mục src
cd c:\Users\iamtp\Documents\STUDY\LightWeightBikeStore-main\src

# 2. Tạo môi trường ảo
python -m venv venv

# 3. Kích hoạt môi trường ảo
.\venv\Scripts\activate

# 4. Cài đặt packages
pip install -r requirements.txt
```

## 6.2. Cấu hình .env

```bash
# Copy file .env.example thành .env (nếu có)
# Hoặc tạo file .env với nội dung:

DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 6.3. Chạy migration (nếu cần)

```bash
# Tạo migration mới
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## 6.4. Chạy server

```bash
# Development mode (auto-reload)
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 6.5. Truy cập API

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc
- **API Root:** http://127.0.0.1:8000/

---

# 7. CÂU HỎI THƯỜNG GẶP

## Q1: Tại sao cần virtual environment (venv)?

**A:** Để isolate packages của project này với các project khác. Mỗi project có thể dùng version khác nhau của cùng một package.

## Q2: `.env` có cần push lên GitHub không?

**A:** KHÔNG! File `.env` chứa thông tin nhạy cảm (password, secret key). Phải thêm vào `.gitignore`.

## Q3: JWT token lưu ở đâu?

**A:** Client (browser/mobile) lưu token, thường là:

- LocalStorage/SessionStorage (web)
- Keychain/SharedPreferences (mobile)

## Q4: Token hết hạn thì sao?

**A:** User phải login lại để lấy token mới. Hoặc implement refresh token (advanced).

## Q5: Tại sao không dùng session như PHP?

**A:** JWT là stateless:

- Server không cần lưu session
- Dễ scale nhiều server
- Phù hợp cho mobile app và SPA

## Q6: Làm sao biết request nào cần auth?

**A:** Nhìn vào parameter của endpoint:

```python
# Không cần auth
def login(request: LoginRequest, db: Session = Depends(get_db)):

# Cần auth (có Depends(get_current_user))
def get_me(current_user: Staff = Depends(get_current_user)):

# Cần auth + ADMIN (có Depends(require_admin))
def admin_route(current_user: Staff = Depends(require_admin)):
```

## Q7: Alembic tự động detect thay đổi như nào?

**A:** Alembic so sánh:

- **Models:** Code Python định nghĩa bảng
- **Database:** Cấu trúc thực tế trong DB

Từ đó tạo migration script để đồng bộ.

---

# 8. TÀI LIỆU THAM KHẢO

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [JWT.io](https://jwt.io/) - Debug JWT token

---

# 9. LIÊN HỆ

Nếu có thắc mắc, hãy:

1. Đọc lại documentation
2. Google error message
3. Hỏi ChatGPT/Copilot
4. Hỏi bạn bè/mentor

---

**Happy coding!** 🚀
