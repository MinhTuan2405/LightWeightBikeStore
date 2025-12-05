# 📚 HƯỚNG DẪN CHI TIẾT - LightWeight Bike Store API

> **Dành cho người mới học Backend với FastAPI + Python**

---

## 📑 MỤC LỤC

1. [Tổng quan Project](#1-tổng-quan-project)
2. [Kiến trúc thư mục](#2-kiến-trúc-thư-mục)
3. [Các khái niệm quan trọng](#3-các-khái-niệm-quan-trọng)
4. [Flow xử lý Request](#4-flow-xử-lý-request)
5. [Chi tiết từng thành phần](#5-chi-tiết-từng-thành-phần)
6. [Hệ thống Authentication](#6-hệ-thống-authentication)
7. [Ví dụ thực tế](#7-ví-dụ-thực-tế)
8. [API Thống kê (Statistics)](#8-api-thống-kê-statistics)
9. [Tips & Best Practices](#9-tips--best-practices)

---

## 1. Tổng quan Project

### 🎯 Project này làm gì?

Đây là **Backend API** cho cửa hàng xe đạp, cho phép:

- Quản lý sản phẩm (xe đạp)
- Quản lý thương hiệu, danh mục
- Quản lý khách hàng
- Quản lý đơn hàng
- Đăng nhập/Đăng ký nhân viên
- Thống kê doanh thu

### 🛠 Công nghệ sử dụng

| Công nghệ                | Mục đích                       |
| ------------------------ | ------------------------------ |
| **FastAPI**              | Framework web Python - tạo API |
| **SQLAlchemy**           | ORM - tương tác với database   |
| **Pydantic**             | Validate dữ liệu đầu vào/ra    |
| **JWT (JSON Web Token)** | Xác thực người dùng            |
| **bcrypt**               | Mã hóa password                |
| **Supabase/PostgreSQL**  | Database                       |

### 📊 Sơ đồ tổng quan

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   FastAPI   │────▶│   Service   │────▶│  SQLAlchemy │────▶│  Database   │
│  (Postman)  │◀────│   (Router)  │◀────│   (Logic)   │◀────│   (ORM)     │◀────│ (Supabase)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │  Schemas  │
                    │  Models   │
                    └───────────┘
```

---

## 2. Kiến trúc thư mục

```
src/
├── main.py              # 🚀 Entry point - Khởi động server
├── requirements.txt     # 📦 Danh sách thư viện cần cài
│
├── core/                # ⚙️ CẤU HÌNH CHUNG
│   ├── database.py      # Kết nối database
│   └── security.py      # Mã hóa password, tạo JWT token
│
├── models/              # 📊 MODELS - Định nghĩa bảng database
│   ├── product.py       # Model sản phẩm
│   ├── brand.py         # Model thương hiệu
│   ├── category.py      # Model danh mục
│   ├── customer.py      # Model khách hàng
│   ├── staff.py         # Model nhân viên
│   ├── order.py         # Model đơn hàng
│   └── order_item.py    # Model chi tiết đơn hàng
│
├── schemas/             # 📝 SCHEMAS - Validate dữ liệu
│   ├── product.py       # Schema cho product
│   ├── auth.py          # Schema cho authentication
│   └── ...
│
├── routers/             # 🛣️ ROUTERS - Định nghĩa API endpoints
│   ├── product_routers.py
│   ├── auth_routers.py
│   └── ...
│
├── services/            # 💼 SERVICES - Business logic (Xử lý nghiệp vụ)
│   ├── product_service.py
│   ├── auth_service.py
│   └── ...
│
└── middleware/          # 🔒 MIDDLEWARE - Xử lý trước khi vào router
    └── auth.py          # Kiểm tra JWT token
```

### 🎭 Vai trò từng thư mục (dễ nhớ)

| Thư mục       | Vai trò                     | Ví von                                   |
| ------------- | --------------------------- | ---------------------------------------- |
| `models/`     | Định nghĩa cấu trúc bảng DB | **Bản vẽ kiến trúc nhà**                 |
| `schemas/`    | Validate dữ liệu vào/ra     | **Bảo vệ cửa** - kiểm tra ai được vào    |
| `routers/`    | Định nghĩa đường dẫn API    | **Lễ tân** - nhận yêu cầu và chuyển tiếp |
| `services/`   | Xử lý logic nghiệp vụ       | **Nhân viên** - người thực sự làm việc   |
| `middleware/` | Xử lý trung gian            | **Bảo vệ vòng ngoài** - check thẻ ra vào |
| `core/`       | Cấu hình chung              | **Nền móng** - điện, nước, kết nối       |

---

## 3. Các khái niệm quan trọng

### 3.1. Model (SQLAlchemy ORM)

**Model** là cách Python "nói chuyện" với Database. Mỗi Model = 1 Bảng trong DB.

```python
# models/product.py
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from core.database import Base

class Product(Base):
    __tablename__ = "products"  # Tên bảng trong database

    # Định nghĩa các cột
    product_id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    brand_id = Column(Integer, ForeignKey("brands.brand_id"), nullable=False)  # Khóa ngoại
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    list_price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0)
```

### 3.2. Schema (Pydantic)

**Schema** định nghĩa dữ liệu **đầu vào (Request)** và **đầu ra (Response)**. Giúp kiểm tra dữ liệu tự động.

```python
# schemas/product.py
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

# Schema cho việc TẠO sản phẩm (Request)
class ProductCreate(BaseModel):
    product_name: str          # Bắt buộc
    brand_id: int              # Bắt buộc
    category_id: int           # Bắt buộc
    model_year: int            # Bắt buộc
    list_price: Decimal        # Bắt buộc
    stock: Optional[int] = 0   # Không bắt buộc, mặc định = 0

# Schema cho RESPONSE (trả về cho client)
class ProductResponse(BaseModel):
    product_id: int
    product_name: str
    brand_id: int
    list_price: Decimal
    stock: int

    class Config:
        from_attributes = True  # Cho phép chuyển từ Model sang Schema
```

### 3.3. Service Layer (Logic nghiệp vụ)

Đây là nơi chứa logic chính của ứng dụng. Router sẽ gọi Service, và Service sẽ gọi Database.

```python
# services/product_service.py
class ProductService:
    @staticmethod
    def create_product(db: Session, request: ProductCreate) -> Product:
        # 1. Kiểm tra logic nghiệp vụ (Ví dụ: Brand có tồn tại không?)
        brand = db.query(Brand).filter(Brand.brand_id == request.brand_id).first()
        if not brand:
            raise HTTPException(status_code=400, detail="Brand not found")
        
        # 2. Tạo model từ request
        product = Product(**request.model_dump())
        
        # 3. Lưu vào DB
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
```

### 3.4. Router (API Endpoints)

**Router** chỉ làm nhiệm vụ nhận request và gọi Service tương ứng.

```python
# routers/product_routers.py
@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    request: ProductCreate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin) # Chỉ Admin mới được tạo
):
    """Tạo sản phẩm mới (Admin only)"""
    # Gọi Service để xử lý
    return ProductService.create_product(db, request)
```

---

## 4. Flow xử lý Request

Khi client gửi request tạo sản phẩm, dữ liệu đi qua các bước sau:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     CLIENT GỬI REQUEST                               │
│              POST /api/products với body JSON                        │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  1️⃣ MIDDLEWARE (middleware/auth.py)                                  │
│     - Kiểm tra JWT token trong header                                │
│     - Xác thực user và quyền (Admin)                                 │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  2️⃣ SCHEMA VALIDATION (schemas/product.py)                           │
│     - Kiểm tra dữ liệu JSON có đúng format ProductCreate không       │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  3️⃣ ROUTER (routers/product_routers.py)                              │
│     - Nhận request hợp lệ                                            │
│     - Gọi ProductService.create_product(db, request)                 │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  4️⃣ SERVICE (services/product_service.py)                            │
│     - Kiểm tra logic (Brand/Category có tồn tại không?)              │
│     - Chuyển đổi Schema -> Model                                     │
│     - Gọi DB để lưu                                                  │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  5️⃣ MODEL + DATABASE (models/ + core/database.py)                    │
│     - Thực hiện câu lệnh SQL INSERT vào bảng products                │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  6️⃣ RESPONSE                                                         │
│     - Trả về kết quả cho Client theo format ProductResponse          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Chi tiết từng thành phần

### 5.1. main.py - Entry Point

```python
from fastapi import FastAPI
from routers import product_routers, auth_routers, ...

app = FastAPI(
    title="LightWeight Bike Store API",
    version="2.0.0"
)

# Cấu hình CORS
app.add_middleware(CORSMiddleware, ...)

# Đăng ký các router
app.include_router(auth_routers.router)
app.include_router(product_routers.router)
# ...

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

### 5.2. core/database.py - Kết nối Database

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Lấy URL database từ biến môi trường .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Tạo engine kết nối
engine = create_engine(DATABASE_URL)

# Tạo session factory
SessionLocal = sessionmaker(bind=engine)

# Dependency: Cung cấp DB session cho mỗi request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 6. Hệ thống Authentication

### 6.1. Cách hoạt động

1. **Đăng nhập**: User gửi username/password -> Server kiểm tra -> Trả về **JWT Token**.
2. **Sử dụng API**: User gửi kèm Token trong Header `Authorization: Bearer <token>`.
3. **Server xác thực**: Middleware giải mã Token -> Lấy thông tin User -> Cho phép/Chặn request.

### 6.2. Code Middleware (middleware/auth.py)

```python
def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    # 1. Giải mã token
    payload = decode_access_token(token)
    username = payload.get("sub")
    
    # 2. Tìm user trong DB
    user = db.query(Staff).filter(Staff.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return user

def require_admin(current_user: Staff = Depends(get_current_user)):
    # Kiểm tra quyền Admin
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
```

---

## 7. Ví dụ thực tế

### 7.1. Test API với Postman/Swagger

**Bước 1: Login lấy Token**
- URL: `POST /api/auth/login`
- Body: `{"username": "admin", "password": "..."}`
- Result: Copy `access_token`

**Bước 2: Gọi API cần quyền (Ví dụ: Lấy danh sách Staff)**
- URL: `GET /api/staffs`
- Header: `Authorization: Bearer <paste_token_here>`
- Result: Danh sách nhân viên.

---

## 8. API Thống kê (Statistics)

Project cung cấp các API thống kê mạnh mẽ trong `routers/statistics_routers.py`:

- `/api/statistics/store/overview`: Tổng quan doanh thu, đơn hàng.
- `/api/statistics/products/top-selling`: Top sản phẩm bán chạy.
- `/api/statistics/staffs/sales`: Doanh số theo nhân viên.

---

## 9. Tips & Best Practices

### ✅ Nên làm
1. **Tách biệt Logic**: Luôn viết logic trong `services/`, Router chỉ để điều hướng.
2. **Validate kỹ**: Dùng Pydantic Schema để kiểm tra dữ liệu đầu vào.
3. **Bảo mật**: Luôn dùng `Depends(get_current_user)` cho các API cần bảo vệ.
4. **Môi trường**: Dùng file `.env` để lưu thông tin nhạy cảm (DB URL, Secret Key).

### ❌ Không nên làm
1. **Viết logic trong Router**: Làm code rối và khó bảo trì.
2. **Hardcode**: Không viết cứng password hay key trong code.
3. **Commit file .env**: Không bao giờ đẩy file .env lên Git.

---

> 💡 **Lời khuyên**: Hãy mở file `src/services/product_service.py` và đọc kỹ code để hiểu cách xử lý logic nghiệp vụ!
