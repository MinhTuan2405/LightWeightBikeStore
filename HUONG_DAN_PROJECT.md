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
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   FastAPI   │────▶│  SQLAlchemy │────▶│  Database   │
│  (Postman)  │◀────│   (main.py) │◀────│   (ORM)     │◀────│ (Supabase)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │  Routers  │
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
├── middleware/          # 🔒 MIDDLEWARE - Xử lý trước khi vào router
│   └── auth.py          # Kiểm tra JWT token
│
└── services/            # 💼 SERVICES - Business logic
    └── auth_service.py  # Logic đăng nhập/đăng ký
```

### 🎭 Vai trò từng thư mục (dễ nhớ)

| Thư mục       | Vai trò                     | Ví von                                   |
| ------------- | --------------------------- | ---------------------------------------- |
| `models/`     | Định nghĩa cấu trúc bảng DB | **Bản vẽ kiến trúc nhà**                 |
| `schemas/`    | Validate dữ liệu vào/ra     | **Bảo vệ cửa** - kiểm tra ai được vào    |
| `routers/`    | Định nghĩa đường dẫn API    | **Bảng chỉ đường** - endpoint nào làm gì |
| `services/`   | Xử lý logic nghiệp vụ       | **Nhân viên** - làm việc thực sự         |
| `middleware/` | Xử lý trung gian            | **Bảo vệ** - kiểm tra trước khi vào      |
| `core/`       | Cấu hình chung              | **Nền móng** - database, security        |

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
    brand_id = Column(Integer, ForeignKey("brands.brand_id"))  # Khóa ngoại
    list_price = Column(Numeric(10, 2), nullable=False)
```

📌 **Giải thích:**

- `__tablename__`: Tên bảng trong database
- `Column(Integer, primary_key=True)`: Cột số nguyên, là khóa chính
- `ForeignKey("brands.brand_id")`: Liên kết với bảng `brands`
- `nullable=False`: Bắt buộc phải có giá trị

---

### 3.2. Schema (Pydantic)

**Schema** định nghĩa dữ liệu **đầu vào (Request)** và **đầu ra (Response)**.

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

# Schema cho việc CẬP NHẬT sản phẩm (Request)
class ProductUpdate(BaseModel):
    product_name: Optional[str] = None   # Tất cả đều không bắt buộc
    brand_id: Optional[int] = None
    list_price: Optional[Decimal] = None

# Schema cho RESPONSE (trả về cho client)
class ProductResponse(BaseModel):
    product_id: int
    product_name: str
    brand_id: int
    list_price: Decimal

    class Config:
        from_attributes = True  # Cho phép chuyển từ Model sang Schema
```

📌 **Tại sao cần Schema?**

- **Validate tự động**: FastAPI tự kiểm tra dữ liệu đầu vào
- **Documentation**: Tự sinh docs tại `/docs`
- **Type safety**: IDE hiểu được kiểu dữ liệu

---

### 3.3. Router

**Router** định nghĩa các **API endpoints** - đường dẫn URL.

```python
# routers/product_routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db

router = APIRouter(
    prefix="/api/products",  # Tất cả route bắt đầu bằng /api/products
    tags=["Products"]        # Nhóm trong docs
)

# GET /api/products - Lấy danh sách
@router.get("", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# GET /api/products/1 - Lấy chi tiết
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# POST /api/products - Tạo mới
@router.post("", response_model=ProductResponse, status_code=201)
def create_product(request: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**request.model_dump())  # Chuyển schema -> model
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
```

---

### 3.4. Dependency Injection

**Dependency Injection (DI)** là cách FastAPI "tiêm" các thành phần cần thiết.

```python
# Depends(get_db) = Tự động lấy database session
def get_products(db: Session = Depends(get_db)):
    ...

# Depends(get_current_user) = Tự động lấy user đang đăng nhập
def create_product(current_user: Staff = Depends(get_current_user)):
    ...
```

📌 **Lợi ích:**

- Code sạch, dễ đọc
- Dễ test (có thể mock)
- Tự động quản lý lifecycle (ví dụ: đóng DB connection)

---

## 4. Flow xử lý Request

Khi client gửi request, dữ liệu đi qua các bước sau:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     CLIENT GỬI REQUEST                               │
│              POST /api/products với body JSON                        │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  1️⃣ MIDDLEWARE (middleware/auth.py)                                  │
│     - Kiểm tra JWT token trong header                                │
│     - Nếu không hợp lệ → trả về 401 Unauthorized                     │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  2️⃣ SCHEMA VALIDATION (schemas/product.py)                           │
│     - Kiểm tra dữ liệu đầu vào có đúng format không                  │
│     - Nếu sai → trả về 422 Unprocessable Entity                      │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  3️⃣ ROUTER (routers/product_routers.py)                              │
│     - Nhận request đã validate                                       │
│     - Gọi database để xử lý                                          │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  4️⃣ MODEL + DATABASE (models/ + core/database.py)                    │
│     - Thực hiện CRUD với database                                    │
│     - Trả về kết quả                                                 │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  5️⃣ RESPONSE SCHEMA                                                  │
│     - Format dữ liệu trả về theo schema                              │
│     - Gửi về client                                                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Chi tiết từng thành phần

### 5.1. main.py - Entry Point

```python
from fastapi import FastAPI
from routers import product_routers, auth_routers, ...

# Tạo ứng dụng FastAPI
app = FastAPI(
    title="LightWeight Bike Store API",
    description="Backend API with JWT Authentication",
    version="2.0.0",
    docs_url="/docs",      # Swagger UI
    redoc_url="/redoc"     # ReDoc UI
)

# Cấu hình CORS (cho phép frontend gọi API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Cho phép tất cả domain
    allow_methods=["*"],   # Cho phép tất cả method (GET, POST, ...)
    allow_headers=["*"],   # Cho phép tất cả headers
)

# Đăng ký các router
app.include_router(auth_routers.router)
app.include_router(product_routers.router)
# ...

# Chạy server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

### 5.2. core/database.py - Kết nối Database

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Lấy URL database từ biến môi trường
DATABASE_URL = os.getenv("DATABASE_URL")

# Tạo engine (kết nối đến DB)
engine = create_engine(DATABASE_URL)

# Tạo session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class cho tất cả models
Base = declarative_base()

# Dependency: Lấy database session
def get_db():
    db = SessionLocal()
    try:
        yield db           # Trả về session cho router sử dụng
    finally:
        db.close()         # Đóng session sau khi xong
```

📌 **Giải thích:**

- `create_engine`: Tạo kết nối đến database
- `SessionLocal`: Factory để tạo session
- `get_db()`: Dependency để inject DB session vào router

---

### 5.3. core/security.py - Bảo mật

```python
from jose import jwt
import bcrypt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"     # Khóa bí mật
ALGORITHM = "HS256"                 # Thuật toán mã hóa
ACCESS_TOKEN_EXPIRE_MINUTES = 30    # Token hết hạn sau 30 phút

# Mã hóa password
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Kiểm tra password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

# Tạo JWT token
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Giải mã JWT token
def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
```

---

## 6. Hệ thống Authentication

### 6.1. Flow Đăng ký

```
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/auth/register                                        │
│  Body: { username, email, password, first_name, last_name }     │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Kiểm tra username/email đã tồn tại chưa                     │
│  2. Hash password bằng bcrypt                                   │
│  3. Tạo record mới trong bảng staffs                           │
│  4. Trả về thông tin user (không có password)                   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2. Flow Đăng nhập

```
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/auth/login                                           │
│  Body: { username, password }                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Tìm user theo username                                      │
│  2. Verify password với bcrypt                                  │
│  3. Tạo JWT token chứa: username, staff_id, role                │
│  4. Trả về: { access_token, token_type: "bearer" }              │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3. Flow Xác thực Request

```
┌─────────────────────────────────────────────────────────────────┐
│  GET /api/products (có header: Authorization: Bearer <token>)   │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  middleware/auth.py                                             │
│  1. Lấy token từ header                                         │
│  2. Decode token bằng SECRET_KEY                                │
│  3. Kiểm tra token hết hạn chưa                                 │
│  4. Tìm user trong DB theo username trong token                 │
│  5. Trả về user object → Router tiếp tục xử lý                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.4. Phân quyền (Authorization)

```python
# middleware/auth.py

# Lấy user hiện tại (bất kỳ user đã đăng nhập)
def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    # Decode token và tìm user
    ...
    return user

# Yêu cầu quyền ADMIN
def require_admin(current_user: Staff = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
```

**Sử dụng trong router:**

```python
# Ai cũng xem được
@router.get("/products")
def get_products(db = Depends(get_db)):
    ...

# Phải đăng nhập
@router.get("/orders")
def get_orders(current_user = Depends(get_current_user)):
    ...

# Chỉ Admin
@router.post("/products")
def create_product(current_user = Depends(require_admin)):
    ...
```

---

## 7. Ví dụ thực tế

### 7.1. Tạo sản phẩm mới (Complete Flow)

**Bước 1: Đăng nhập lấy token**

```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "Admin@123456"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Bước 2: Tạo sản phẩm với token**

```http
POST /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
    "product_name": "Giant Escape 3",
    "brand_id": 1,
    "category_id": 1,
    "model_year": 2024,
    "list_price": 599.99,
    "stock": 10
}
```

**Response (201 Created):**

```json
{
  "product_id": 22,
  "product_name": "Giant Escape 3",
  "brand_id": 1,
  "category_id": 1,
  "model_year": 2024,
  "list_price": 599.99,
  "stock": 10
}
```

---

### 7.2. Các HTTP Status Code thường gặp

| Code                       | Ý nghĩa        | Khi nào xảy ra         |
| -------------------------- | -------------- | ---------------------- |
| `200 OK`                   | Thành công     | GET, PUT thành công    |
| `201 Created`              | Tạo thành công | POST tạo mới           |
| `204 No Content`           | Xóa thành công | DELETE thành công      |
| `400 Bad Request`          | Lỗi dữ liệu    | Dữ liệu không hợp lệ   |
| `401 Unauthorized`         | Chưa đăng nhập | Token không có/sai     |
| `403 Forbidden`            | Không có quyền | User không phải Admin  |
| `404 Not Found`            | Không tìm thấy | ID không tồn tại       |
| `422 Unprocessable Entity` | Validate lỗi   | Schema validation fail |

---

## 8. API Thống kê (Statistics)

Project có bộ **API thống kê** đầy đủ để phân tích dữ liệu kinh doanh.

### 8.1. Thống kê Nhân viên

```python
# Số lượng nhân viên
GET /api/statistics/staffs/count

# Response:
{
    "total_staffs": 10,
    "active_staffs": 8,
    "inactive_staffs": 2
}
```

```python
# Doanh số tất cả nhân viên
GET /api/statistics/staffs/sales

# Response:
[
    {
        "staff_id": 1,
        "staff_name": "Nguyen Van A",
        "total_orders": 50,
        "total_bikes_sold": 120,
        "total_revenue": 150000.00
    },
    ...
]
```

```python
# Doanh số 1 nhân viên theo tháng
GET /api/statistics/staffs/1/sales/by-month?year=2024

# Doanh số 1 nhân viên theo ngày
GET /api/statistics/staffs/1/sales/by-day?start_date=2024-01-01&end_date=2024-12-31
```

### 8.2. Thống kê Cửa hàng

```python
# Tổng quan cửa hàng
GET /api/statistics/store/overview

# Response:
{
    "total_revenue": 500000.00,
    "total_orders": 200,
    "total_bikes_sold": 450,
    "total_customers": 150,
    "total_products": 50,
    "avg_order_value": 2500.00
}
```

```python
# Doanh số theo các kỳ
GET /api/statistics/store/sales/by-day?start_date=2024-01-01&end_date=2024-01-31
GET /api/statistics/store/sales/by-month?year=2024
GET /api/statistics/store/sales/by-quarter?year=2024
GET /api/statistics/store/sales/by-year

# Response (by-month):
[
    {
        "period": "2024-01",
        "period_type": "month",
        "total_orders": 20,
        "total_bikes_sold": 45,
        "total_revenue": 50000.00,
        "avg_order_value": 2500.00
    },
    ...
]
```

### 8.3. Thống kê Sản phẩm

```python
# Top sản phẩm bán chạy
GET /api/statistics/products/top-selling?limit=10

# Response:
{
    "products": [
        {
            "product_id": 1,
            "product_name": "Trek Mountain Bike",
            "brand_name": "Trek",
            "category_name": "Mountain Bikes",
            "total_quantity_sold": 100,
            "total_revenue": 99900.00
        },
        ...
    ],
    "total_count": 10
}
```

### 8.4. Thống kê Khách hàng

```python
# Top khách hàng mua nhiều nhất
GET /api/statistics/customers/top-buyers?limit=10

# Response:
{
    "customers": [
        {
            "customer_id": 1,
            "customer_name": "John Doe",
            "email": "john@example.com",
            "total_orders": 15,
            "total_bikes_bought": 20,
            "total_spent": 25000.00
        },
        ...
    ],
    "total_count": 10
}
```

```python
# Danh sách đơn hàng có giá trị cao nhất
GET /api/statistics/customers/highest-orders?limit=10

# Response:
{
    "orders": [
        {
            "customer_id": 5,
            "customer_name": "Jane Smith",
            "email": "jane@example.com",
            "order_id": 123,
            "order_date": "2024-06-15",
            "order_value": 15000.00,
            "items_count": 3
        },
        ...
    ],
    "total_count": 10
}
```

### 8.5. Cách tính doanh thu

Công thức tính doanh thu trong project:

```
Doanh thu = Σ (quantity × list_price × (1 - discount))
```

Code SQLAlchemy:

```python
func.sum(
    OrderItem.quantity * OrderItem.list_price * (1 - OrderItem.discount)
)
```

---

## 9. Tips & Best Practices

### ✅ Nên làm

1. **Luôn validate dữ liệu** với Pydantic Schema
2. **Sử dụng Dependency Injection** cho database session
3. **Hash password** trước khi lưu DB
4. **Trả về status code phù hợp** (201 khi tạo, 204 khi xóa)
5. **Viết docstring** cho mỗi endpoint
6. **Sử dụng environment variables** cho config nhạy cảm

### ❌ Không nên làm

1. **Lưu password dạng plain text**
2. **Hardcode SECRET_KEY** trong code
3. **Trả về toàn bộ thông tin user** (bao gồm password)
4. **Không kiểm tra quyền** khi tạo/sửa/xóa dữ liệu
5. **Không đóng database session**

---

## 📚 Tài liệu tham khảo

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🧪 Test nhanh với Swagger UI

1. Chạy server: `python main.py`
2. Mở trình duyệt: `http://localhost:8000/docs`
3. Click vào endpoint muốn test
4. Nhấn "Try it out"
5. Điền dữ liệu và nhấn "Execute"

---

## 📝 Bảng tóm tắt các API

| Nhóm           | Endpoint                                   | Method | Yêu cầu Auth |
| -------------- | ------------------------------------------ | ------ | ------------ |
| Auth           | `/api/auth/register`                       | POST   | ❌           |
| Auth           | `/api/auth/login`                          | POST   | ❌           |
| Auth           | `/api/auth/me`                             | GET    | ✅           |
| Products       | `/api/products`                            | GET    | ❌           |
| Products       | `/api/products/{id}`                       | GET    | ❌           |
| Products       | `/api/products`                            | POST   | ✅ Admin     |
| Products       | `/api/products/{id}`                       | PUT    | ✅ Admin     |
| Products       | `/api/products/{id}`                       | DELETE | ✅ Admin     |
| Brands         | `/api/brands`                              | GET    | ❌           |
| Categories     | `/api/categories`                          | GET    | ❌           |
| Customers      | `/api/customers`                           | GET    | ✅           |
| Orders         | `/api/orders`                              | GET    | ✅           |
| Staffs         | `/api/staffs`                              | GET    | ✅ Admin     |
| **Statistics** | `/api/statistics/staffs/count`             | GET    | ✅           |
| **Statistics** | `/api/statistics/staffs/sales`             | GET    | ✅           |
| **Statistics** | `/api/statistics/store/overview`           | GET    | ✅           |
| **Statistics** | `/api/statistics/store/sales/by-month`     | GET    | ✅           |
| **Statistics** | `/api/statistics/products/top-selling`     | GET    | ✅           |
| **Statistics** | `/api/statistics/customers/top-buyers`     | GET    | ✅           |
| **Statistics** | `/api/statistics/customers/highest-orders` | GET    | ✅           |

---

> 💡 **Tip cuối**: Cách tốt nhất để học là **đọc code** và **chạy thử**. Mở file `test_apis.py` để xem ví dụ cách gọi API!

**Happy coding! 🚀**
