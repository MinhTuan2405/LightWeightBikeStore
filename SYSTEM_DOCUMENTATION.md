# 📚 BIKESTORE SHOP - TÀI LIỆU HỆ THỐNG CHI TIẾT

**Phiên bản:** 2.0.0  
**Ngày cập nhật:** 22/12/2025  
**Tech Stack:** FastAPI + PostgreSQL + SQLAlchemy + JWT Authentication

---

## 📋 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc & Công nghệ](#2-kiến-trúc--công-nghệ)
3. [Cơ sở dữ liệu](#3-cơ-sở-dữ-liệu)
4. [Hệ thống xác thực & phân quyền](#4-hệ-thống-xác-thực--phân-quyền)
5. [API Endpoints chi tiết](#5-api-endpoints-chi-tiết)
6. [Logic nghiệp vụ](#6-logic-nghiệp-vụ)
7. [Hướng dẫn triển khai](#7-hướng-dẫn-triển-khai)
8. [Use Cases & Scenarios](#8-use-cases--scenarios)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Giới thiệu

**BikeStore Shop** là hệ thống quản lý cửa hàng xe đạp toàn diện, cung cấp các chức năng:

- ✅ **Quản lý sản phẩm**: Danh mục, thương hiệu, kho hàng
- ✅ **Quản lý đơn hàng**: Tạo đơn, xử lý, theo dõi trạng thái
- ✅ **Quản lý khách hàng**: Thông tin, lịch sử mua hàng
- ✅ **Quản lý nhân viên**: Phân quyền ADMIN/STAFF với quan hệ quản lý
- ✅ **Thống kê & báo cáo**: Doanh số, top sản phẩm, khách hàng VIP
- ✅ **Xác thực & bảo mật**: JWT Token với phân quyền chi tiết

### 1.2. Đối tượng người dùng

| Vai trò | Mô tả | Quyền hạn |
|---------|-------|-----------|
| **ADMIN** | Quản trị viên cửa hàng | Full quyền: quản lý sản phẩm, nhân viên, xem báo cáo |
| **STAFF** | Nhân viên bán hàng | Xử lý đơn hàng, quản lý khách hàng, xem thống kê |

---

## 2. KIẾN TRÚC & CÔNG NGHỆ

### 2.1. Kiến trúc phân tầng (Layered Architecture)

```
┌────────────────────────────────────────┐
│  CLIENT (Frontend/Mobile/Postman)     │
└────────────────────────────────────────┘
                  ↓ HTTP/HTTPS
┌────────────────────────────────────────┐
│  API LAYER (FastAPI Routers)          │  ← Nhận request, validate
├────────────────────────────────────────┤
│  MIDDLEWARE (Auth, CORS, Logging)     │  ← Xác thực, phân quyền
├────────────────────────────────────────┤
│  SERVICE LAYER (Business Logic)       │  ← Xử lý nghiệp vụ
├────────────────────────────────────────┤
│  SCHEMA LAYER (Pydantic Validation)   │  ← Validate input/output
├────────────────────────────────────────┤
│  MODEL LAYER (SQLAlchemy ORM)         │  ← Ánh xạ với database
├────────────────────────────────────────┤
│  CORE (Database, Security, Config)    │  ← Cấu hình hạ tầng
└────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                 │
└────────────────────────────────────────┘
```

### 2.2. Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | FastAPI | 0.115.5 |
| **Database** | PostgreSQL | - |
| **ORM** | SQLAlchemy | 2.0.36 |
| **Migration** | Alembic | 1.14.0 |
| **Authentication** | JWT (python-jose) | 3.3.0 |
| **Password Hashing** | bcrypt | 5.0.0 |
| **Server** | Uvicorn | 0.32.1 |
| **Validation** | Pydantic | 2.10.3 |
| **Language** | Python | 3.10+ |

### 2.3. Cấu trúc thư mục

```
src/
├── main.py                 # Entry point, khởi tạo FastAPI app
├── create_admin.py         # Script tạo admin đầu tiên
├── requirements.txt        # Dependencies
├── alembic/               # Database migrations
│   └── versions/
├── core/                  # Cấu hình cốt lõi
│   ├── database.py        # Kết nối DB, Session
│   └── security.py        # JWT, hash password
├── middleware/            # Middleware xử lý request
│   └── auth.py           # Xác thực & phân quyền
├── models/               # SQLAlchemy Models
│   ├── staff.py
│   ├── product.py
│   ├── customer.py
│   ├── order.py
│   └── ...
├── schemas/              # Pydantic Schemas (validation)
│   ├── auth.py
│   ├── product.py
│   └── ...
├── services/             # Business Logic
│   ├── auth_service.py
│   ├── product_service.py
│   └── ...
└── routers/              # API Endpoints
    ├── auth_routers.py
    ├── product_routers.py
    └── ...
```

---

## 3. CƠ SỞ DỮ LIỆU

### 3.1. Database Schema Overview

```
┌─────────────────┐
│    STAFFS       │ ← Nhân viên (ADMIN/STAFF)
│  - staff_id PK  │
│  - username     │
│  - email        │
│  - role         │
│  - manager_id FK│───┐
└─────────────────┘   │ Self-reference
         │            │
         │            └─────┐
         │                  │
         ↓                  ↓
┌─────────────────┐   ┌─────────────────┐
│     ORDERS      │   │   CUSTOMERS     │
│  - order_id PK  │   │  - customer_id  │
│  - customer_id  │←──│  - first_name   │
│  - staff_id     │   │  - email        │
│  - order_status │   │  - phone        │
└─────────────────┘   └─────────────────┘
         │
         ↓
┌─────────────────┐
│   ORDER_ITEMS   │
│  - order_id FK  │
│  - item_id PK   │
│  - product_id FK│───→ ┌─────────────────┐
│  - quantity     │     │    PRODUCTS     │
│  - list_price   │     │  - product_id   │
│  - discount     │     │  - product_name │
└─────────────────┘     │  - brand_id FK  │───→ BRANDS
                        │  - category_id  │───→ CATEGORIES
                        │  - list_price   │
                        └─────────────────┘
                                 │
                                 ↓
                        ┌─────────────────┐
                        │     STOCKS      │
                        │  - store_id FK  │
                        │  - product_id FK│
                        │  - quantity     │
                        └─────────────────┘
```

### 3.2. Chi tiết các bảng

#### **staffs** - Nhân viên & Admin
```sql
CREATE TABLE staffs (
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    active BOOLEAN DEFAULT TRUE,
    manager_id INTEGER REFERENCES staffs(staff_id),
    
    -- Authentication fields
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'STAFF',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Quan hệ quản lý:**
- `manager_id = NULL`: ADMIN (không bị quản lý)
- `manager_id = X`: STAFF (quản lý bởi admin có ID = X)

#### **products** - Sản phẩm
```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    brand_id INTEGER REFERENCES brands(brand_id),
    category_id INTEGER REFERENCES categories(category_id),
    model_year INTEGER,
    list_price DECIMAL(10, 2) NOT NULL
);
```

#### **orders** - Đơn hàng
```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    order_status INTEGER NOT NULL, -- 1=Pending, 2=Processing, 3=Completed, 4=Cancelled
    order_date DATE NOT NULL,
    required_date DATE,
    shipped_date DATE,
    store_id INTEGER,
    staff_id INTEGER REFERENCES staffs(staff_id)
);
```

**Trạng thái đơn hàng:**
- `1`: Pending (Chờ xử lý)
- `2`: Processing (Đang xử lý)
- `3`: Completed (Hoàn thành)
- `4`: Cancelled (Đã hủy)

#### **order_items** - Chi tiết đơn hàng
```sql
CREATE TABLE order_items (
    order_id INTEGER REFERENCES orders(order_id),
    item_id INTEGER,
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    list_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(4, 2) DEFAULT 0,
    PRIMARY KEY (order_id, item_id)
);
```

### 3.3. Indexes quan trọng

```sql
-- Performance indexes
CREATE INDEX idx_staffs_username ON staffs(username);
CREATE INDEX idx_staffs_email ON staffs(email);
CREATE INDEX idx_staffs_manager ON staffs(manager_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_staff ON orders(staff_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
```

---

## 4. HỆ THỐNG XÁC THỰC & PHÂN QUYỀN

### 4.1. Cơ chế JWT Authentication

#### **Flow đăng nhập:**

```
1. Client gửi username + password
   ↓
2. Server kiểm tra credentials
   - Query database tìm user
   - Verify password với bcrypt
   - Kiểm tra is_active = true
   ↓
3. Tạo JWT Token với payload:
   {
     "sub": "username",
     "staff_id": 123,
     "role": "ADMIN",
     "exp": 1735000000
   }
   ↓
4. Trả về: {
     "access_token": "eyJhbGc...",
     "token_type": "bearer"
   }
   ↓
5. Client lưu token và gửi kèm mỗi request:
   Authorization: Bearer <token>
```

#### **Flow xác thực request:**

```
1. Request đến endpoint có bảo vệ
   ↓
2. Middleware get_current_user():
   - Lấy token từ header Authorization
   - Giải mã JWT → lấy username
   - Query database → lấy Staff object
   - Kiểm tra is_active
   ↓
3. Middleware require_admin() (nếu cần):
   - Kiểm tra staff.role == "ADMIN"
   - Raise 403 nếu không phải admin
   ↓
4. Cho phép truy cập endpoint
```

### 4.2. Phân quyền chi tiết

#### **Cấp độ 1: get_current_user()**
**Yêu cầu:** Đăng nhập (có token hợp lệ)  
**Áp dụng cho:** CẢ ADMIN VÀ STAFF

```python
@router.get("/api/orders")
def get_orders(current_user: Staff = Depends(get_current_user)):
    # Cả admin và staff đều được xem orders
    pass
```

#### **Cấp độ 2: require_admin()**
**Yêu cầu:** Phải là ADMIN  
**Áp dụng cho:** CHỈ ADMIN

```python
@router.post("/api/products")
def create_product(current_user: Staff = Depends(require_admin)):
    # Chỉ admin mới tạo được sản phẩm
    pass
```

### 4.3. Bảng phân quyền đầy đủ

| Module | Endpoint | Method | Public | STAFF | ADMIN |
|--------|----------|--------|--------|-------|-------|
| **Authentication** |
| Đăng ký tài khoản | `/api/auth/register` | POST | ❌ | ❌ | ✅ |
| Đăng nhập | `/api/auth/login` | POST | ✅ | ✅ | ✅ |
| Xem thông tin bản thân | `/api/auth/me` | GET | ❌ | ✅ | ✅ |
| Cập nhật profile | `/api/auth/profile` | PUT | ❌ | ✅ | ✅ |
| **Products** |
| Xem danh sách sản phẩm | `/api/products` | GET | ✅ | ✅ | ✅ |
| Xem chi tiết sản phẩm | `/api/products/{id}` | GET | ✅ | ✅ | ✅ |
| Tạo sản phẩm | `/api/products` | POST | ❌ | ❌ | ✅ |
| Cập nhật sản phẩm | `/api/products/{id}` | PUT | ❌ | ❌ | ✅ |
| Xóa sản phẩm | `/api/products/{id}` | DELETE | ❌ | ❌ | ✅ |
| **Brands & Categories** |
| Xem brands/categories | `/api/brands` | GET | ✅ | ✅ | ✅ |
| Tạo/sửa/xóa | `/api/brands` | POST/PUT/DELETE | ❌ | ❌ | ✅ |
| **Customers** |
| Xem khách hàng | `/api/customers` | GET | ❌ | ✅ | ✅ |
| Tạo/cập nhật khách hàng | `/api/customers` | POST/PUT | ❌ | ✅ | ✅ |
| Xóa khách hàng | `/api/customers/{id}` | DELETE | ❌ | ❌ | ✅ |
| **Orders** |
| Xem/tạo/sửa đơn hàng | `/api/orders` | GET/POST/PUT | ❌ | ✅ | ✅ |
| Xóa đơn hàng | `/api/orders/{id}` | DELETE | ❌ | ❌ | ✅ |
| **Staffs** |
| Xem danh sách nhân viên | `/api/staffs` | GET | ❌ | ❌ | ✅ |
| Sửa/xóa nhân viên | `/api/staffs/{id}` | PUT/DELETE | ❌ | ❌ | ✅ |
| **Statistics** |
| Tất cả endpoint thống kê | `/api/statistics/*` | GET | ❌ | ✅ | ✅ |

### 4.4. Quan hệ quản lý (Manager-Staff)

```python
# Khi Admin tạo Staff
if request.role == "STAFF":
    new_staff.manager_id = current_user.staff_id  # Admin đang đăng nhập

# Khi Admin tạo Admin khác
if request.role == "ADMIN":
    new_staff.manager_id = None  # Admin không bị quản lý
```

**Ví dụ:**
```
Admin A (ID=1, manager_id=NULL)
  ├─ Staff B (ID=2, manager_id=1)
  ├─ Staff C (ID=3, manager_id=1)
  └─ Staff D (ID=4, manager_id=1)

Admin E (ID=5, manager_id=NULL)
  ├─ Staff F (ID=6, manager_id=5)
  └─ Staff G (ID=7, manager_id=5)
```

---

## 5. API ENDPOINTS CHI TIẾT

### 5.1. AUTHENTICATION APIs

#### **POST /api/auth/register** 🔴 ADMIN ONLY
Tạo tài khoản mới (mặc định ADMIN, có thể chỉ định STAFF)

**Request Body:**
```json
{
  "username": "newadmin",
  "email": "admin@bikestore.com",
  "password": "SecurePass123",
  "first_name": "Nguyen",
  "last_name": "Van A",
  "phone": "0987654321",
  "role": "ADMIN"  // Optional, mặc định "ADMIN"
}
```

**Response:** `201 Created`
```json
{
  "staff_id": 1,
  "username": "newadmin",
  "email": "admin@bikestore.com",
  "first_name": "Nguyen",
  "last_name": "Van A",
  "phone": "0987654321",
  "role": "ADMIN",
  "is_active": true,
  "created_at": "2025-12-22T10:00:00"
}
```

**Logic nghiệp vụ:**
- Kiểm tra username/email đã tồn tại → `400 Bad Request`
- Hash password bằng bcrypt
- Nếu `role="STAFF"` → Gán `manager_id = admin_id` (admin tạo ra họ)
- Nếu `role="ADMIN"` → `manager_id = NULL`

---

#### **POST /api/auth/login** 🟢 PUBLIC
Đăng nhập lấy JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123456"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401 Unauthorized`: Sai username/password
- `400 Bad Request`: Tài khoản bị vô hiệu hóa (is_active=false)

---

#### **GET /api/auth/me** 🔵 AUTHENTICATED
Xem thông tin tài khoản hiện tại

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "staff_id": 1,
  "username": "admin",
  "email": "admin@bikestore.com",
  "first_name": "Super",
  "last_name": "Admin",
  "role": "ADMIN",
  "is_active": true,
  "created_at": "2025-12-01T00:00:00"
}
```

---

#### **PUT /api/auth/profile** 🔵 AUTHENTICATED
Cập nhật thông tin cá nhân (KHÔNG bao gồm email)

**Request Body:** (Tất cả optional)
```json
{
  "first_name": "Nguyen Van",
  "last_name": "An",
  "phone": "0912345678",
  "password": "NewPassword456"  // Nếu muốn đổi password
}
```

**Response:** `200 OK` - Trả về thông tin staff đã cập nhật

**Lưu ý:**
- ❌ Staff KHÔNG thể đổi email (chỉ admin mới đổi được qua `/api/staffs/{id}`)
- ✅ Staff có thể đổi password của mình
- Password mới sẽ được hash trước khi lưu

---

### 5.2. PRODUCTS APIs

#### **GET /api/products** 🟢 PUBLIC
Lấy danh sách sản phẩm (có phân trang & lọc)

**Query Parameters:**
- `skip`: Số lượng bỏ qua (default: 0)
- `limit`: Số lượng trả về (default: 100, max: 1000)
- `brand_id`: Lọc theo thương hiệu
- `category_id`: Lọc theo danh mục

**Example:**
```
GET /api/products?skip=0&limit=20&brand_id=1
```

**Response:** `200 OK`
```json
[
  {
    "product_id": 1,
    "product_name": "Trek 520 - Touring Bike",
    "brand_id": 1,
    "brand_name": "Trek",
    "category_id": 2,
    "category_name": "Mountain Bikes",
    "model_year": 2023,
    "list_price": 1899.99
  }
]
```

---

#### **POST /api/products** 🔴 ADMIN ONLY
Tạo sản phẩm mới

**Request Body:**
```json
{
  "product_name": "Giant Talon 3 - Mountain Bike",
  "brand_id": 2,
  "category_id": 1,
  "model_year": 2024,
  "list_price": 750.00
}
```

**Response:** `201 Created`

**Validation:**
- `product_name`: Required, không rỗng
- `list_price`: Required, > 0
- `brand_id`: Phải tồn tại trong bảng brands
- `category_id`: Phải tồn tại trong bảng categories

---

#### **PUT /api/products/{id}** 🔴 ADMIN ONLY
Cập nhật sản phẩm (partial update)

**Request Body:** (Tất cả optional)
```json
{
  "product_name": "Giant Talon 3 - Updated",
  "list_price": 799.99
}
```

---

#### **DELETE /api/products/{id}** 🔴 ADMIN ONLY
Xóa sản phẩm

**Response:** `204 No Content`

**Lưu ý:** Không thể xóa nếu sản phẩm đã có trong order_items

---

### 5.3. ORDERS APIs

#### **GET /api/orders** 🔵 AUTHENTICATED
Lấy danh sách đơn hàng

**Query Parameters:**
- `customer_id`: Lọc theo khách hàng
- `staff_id`: Lọc theo nhân viên
- `order_status`: Lọc theo trạng thái (1-4)
- `skip`, `limit`: Phân trang

**Response:**
```json
[
  {
    "order_id": 1,
    "customer_id": 10,
    "order_status": 2,
    "order_date": "2025-12-20",
    "required_date": "2025-12-25",
    "shipped_date": null,
    "staff_id": 5
  }
]
```

---

#### **GET /api/orders/{id}** 🔵 AUTHENTICATED
Xem chi tiết đơn hàng (kèm danh sách items)

**Response:**
```json
{
  "order_id": 1,
  "customer_id": 10,
  "customer_name": "John Doe",
  "order_status": 2,
  "order_date": "2025-12-20",
  "staff_id": 5,
  "staff_name": "Admin User",
  "items": [
    {
      "item_id": 1,
      "product_id": 3,
      "product_name": "Trek 520",
      "quantity": 2,
      "list_price": 1899.99,
      "discount": 0.05,
      "total": 3609.98
    }
  ],
  "order_total": 3609.98
}
```

---

#### **POST /api/orders** 🔵 AUTHENTICATED
Tạo đơn hàng mới

**Request Body:**
```json
{
  "customer_id": 10,
  "order_status": 1,
  "order_date": "2025-12-22",
  "required_date": "2025-12-25",
  "store_id": 1,
  "staff_id": 5,
  "items": [
    {
      "product_id": 3,
      "quantity": 2,
      "list_price": 1899.99,
      "discount": 0.05
    }
  ]
}
```

**Logic:**
1. Validate customer_id, staff_id tồn tại
2. Tạo order với order_status
3. Tạo order_items cho từng sản phẩm
4. Cập nhật tồn kho (stocks)
5. Trả về order đã tạo

---

#### **PUT /api/orders/{id}** 🔵 AUTHENTICATED
Cập nhật đơn hàng (thường dùng để đổi trạng thái)

**Request Body:**
```json
{
  "order_status": 3,  // Đổi sang Completed
  "shipped_date": "2025-12-23"
}
```

---

#### **DELETE /api/orders/{id}** 🔴 ADMIN ONLY
Xóa đơn hàng (xóa cả order_items liên quan)

---

### 5.4. CUSTOMERS APIs

#### **GET /api/customers** 🔵 AUTHENTICATED
Lấy danh sách khách hàng

**Query Parameters:**
- `city`: Lọc theo thành phố
- `state`: Lọc theo tỉnh/bang
- `skip`, `limit`: Phân trang

---

#### **POST /api/customers** 🔵 AUTHENTICATED
Tạo khách hàng mới

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "0987654321",
  "street": "123 Main St",
  "city": "Ho Chi Minh",
  "state": "HCM",
  "zip_code": "70000"
}
```

---

#### **PUT /api/customers/{id}** 🔵 AUTHENTICATED
Cập nhật thông tin khách hàng

---

#### **DELETE /api/customers/{id}** 🔴 ADMIN ONLY
Xóa khách hàng

---

### 5.5. STAFFS APIs

#### **GET /api/staffs** 🔴 ADMIN ONLY
Xem danh sách nhân viên

**Response:**
```json
[
  {
    "staff_id": 1,
    "username": "admin",
    "first_name": "Super",
    "last_name": "Admin",
    "email": "admin@bikestore.com",
    "role": "ADMIN",
    "manager_id": null,
    "is_active": true
  },
  {
    "staff_id": 2,
    "username": "staff001",
    "first_name": "John",
    "last_name": "Staff",
    "email": "staff001@bikestore.com",
    "role": "STAFF",
    "manager_id": 1,  // Quản lý bởi admin ID=1
    "is_active": true
  }
]
```

---

#### **PUT /api/staffs/{id}** 🔴 ADMIN ONLY
Cập nhật thông tin nhân viên (bao gồm email, role)

**Request Body:**
```json
{
  "email": "newemail@bikestore.com",
  "role": "ADMIN",
  "is_active": false
}
```

**Lưu ý:** 
- Admin có thể đổi email của staff (staff tự đổi không được)
- Admin có thể promote staff lên admin

---

#### **DELETE /api/staffs/{id}** 🔴 ADMIN ONLY
Xóa nhân viên (không được xóa chính mình)

---

### 5.6. STATISTICS APIs

Tất cả endpoint thống kê yêu cầu authentication (STAFF hoặc ADMIN)

#### **GET /api/statistics/store/overview** 🔵 AUTHENTICATED
Tổng quan cửa hàng

**Response:**
```json
{
  "total_revenue": 1250000.50,
  "total_orders": 458,
  "total_bikes_sold": 892,
  "total_customers": 256
}
```

---

#### **GET /api/statistics/store/sales/by-month** 🔵 AUTHENTICATED
Doanh số theo tháng

**Query:** `year=2025` (optional)

**Response:**
```json
[
  {
    "period": "2025-01",
    "order_count": 45,
    "total_bikes": 89,
    "total_revenue": 125000.00
  }
]
```

---

#### **GET /api/statistics/staffs/sales** 🔵 AUTHENTICATED
Doanh số tất cả nhân viên

**Response:**
```json
[
  {
    "staff_id": 5,
    "staff_name": "John Doe",
    "order_count": 45,
    "total_bikes_sold": 89,
    "total_revenue": 125000.00
  }
]
```

---

#### **GET /api/statistics/products/top-selling** 🔵 AUTHENTICATED
Top sản phẩm bán chạy

**Query:** `limit=10`

**Response:**
```json
{
  "products": [
    {
      "product_id": 3,
      "product_name": "Trek 520",
      "brand_name": "Trek",
      "category_name": "Touring",
      "total_quantity_sold": 125,
      "total_revenue": 237499.75
    }
  ]
}
```

---

#### **GET /api/statistics/customers/top-buyers** 🔵 AUTHENTICATED
Top khách hàng mua nhiều nhất

**Response:**
```json
{
  "customers": [
    {
      "customer_id": 10,
      "customer_name": "John Doe",
      "total_orders": 15,
      "total_spent": 45000.00
    }
  ]
}
```

---

### 5.7. BRANDS & CATEGORIES APIs

#### **GET /api/brands** 🟢 PUBLIC
Lấy danh sách thương hiệu

#### **POST /api/brands** 🔴 ADMIN ONLY
Tạo thương hiệu mới

**Request Body:**
```json
{
  "brand_name": "Giant"
}
```

#### **PUT /api/brands/{id}** 🔴 ADMIN ONLY
Cập nhật thương hiệu

#### **DELETE /api/brands/{id}** 🔴 ADMIN ONLY
Xóa thương hiệu

*(Tương tự cho Categories)*

---

## 6. LOGIC NGHIỆP VỤ

### 6.1. Quy trình tạo tài khoản

```mermaid
graph TD
    A[Admin đăng nhập] --> B{Tạo tài khoản nào?}
    B -->|Admin mới| C[POST /api/auth/register với role=ADMIN]
    B -->|Staff| D[POST /api/auth/register với role=STAFF]
    C --> E[manager_id = NULL]
    D --> F[manager_id = admin_id hiện tại]
    E --> G[Hash password bằng bcrypt]
    F --> G
    G --> H[Lưu vào database]
    H --> I[Trả về thông tin user mới]
```

**Business Rules:**
1. Chỉ ADMIN mới được tạo tài khoản mới
2. Mặc định tạo ADMIN (nếu không chỉ định role)
3. Staff được tạo sẽ có manager_id = admin tạo ra họ
4. Password phải >= 8 ký tự
5. Username và email phải unique
6. Email phải đúng format

---

### 6.2. Quy trình xử lý đơn hàng

```
1. PENDING (Chờ xử lý)
   ↓
   Staff xác nhận đơn hàng
   ↓
2. PROCESSING (Đang xử lý)
   ↓
   Chuẩn bị hàng, đóng gói
   ↓
3. COMPLETED (Hoàn thành)
   - Cập nhật shipped_date
   - Giảm tồn kho (stocks)
   
4. CANCELLED (Đã hủy)
   - Hoàn lại tồn kho
```

**Business Rules:**
1. Tạo đơn: Kiểm tra tồn kho đủ không
2. Completed: Phải có shipped_date
3. Cancelled: Chỉ admin mới hủy được
4. Xóa đơn: Chỉ admin, phải hoàn tồn kho

---

### 6.3. Quy trình cập nhật sản phẩm

**Business Rules:**
1. Chỉ ADMIN mới tạo/sửa/xóa sản phẩm
2. list_price phải > 0
3. brand_id và category_id phải tồn tại
4. Không xóa sản phẩm đã có trong order_items
5. Xem sản phẩm: Public (không cần đăng nhập)

---

### 6.4. Logic phân quyền Staff

#### **Staff tự cập nhật profile:**
```python
PUT /api/auth/profile
{
  "first_name": "New Name",
  "password": "NewPass123"
}
# ✅ Được phép
# ❌ Không thể đổi email
```

#### **Admin cập nhật Staff:**
```python
PUT /api/staffs/{staff_id}
{
  "email": "newemail@bikestore.com",
  "role": "ADMIN"
}
# ✅ Được phép đổi mọi thứ kể cả email
```

---

### 6.5. Tính toán thống kê

#### **Doanh số nhân viên:**
```sql
SELECT 
    s.staff_id,
    COUNT(o.order_id) as order_count,
    SUM(oi.quantity) as total_bikes_sold,
    SUM(oi.quantity * oi.list_price * (1 - oi.discount)) as total_revenue
FROM staffs s
LEFT JOIN orders o ON s.staff_id = o.staff_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 3  -- Chỉ tính đơn Completed
GROUP BY s.staff_id
```

#### **Top sản phẩm bán chạy:**
```sql
SELECT 
    p.product_id,
    p.product_name,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.quantity * oi.list_price * (1 - oi.discount)) as total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status = 3
GROUP BY p.product_id
ORDER BY total_quantity_sold DESC
LIMIT 10
```

---

## 7. HƯỚNG DẪN TRIỂN KHAI

### 7.1. Cài đặt môi trường phát triển

```powershell
# 1. Clone repository
git clone <repo-url>
cd BikestoreShop

# 2. Tạo virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3. Cài dependencies
pip install -r src/requirements.txt

# 4. Tạo file .env
# DATABASE_URL=postgresql://user:pass@localhost:5432/bikestore
# SECRET_KEY=your-secret-key-here
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 7.2. Thiết lập database

```powershell
# 1. Tạo database PostgreSQL
createdb bikestore

# 2. Chạy migration
cd src
alembic upgrade head

# 3. Load dữ liệu mẫu (nếu có)
psql -U postgres -d bikestore -f ../database/loading_data_to_database.sql

# 4. Tạo admin đầu tiên
python create_admin.py
# Username: admin
# Password: Admin@123456
```

### 7.3. Chạy server

```powershell
# Development mode (auto-reload)
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 7.4. Truy cập API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 8. USE CASES & SCENARIOS

### 8.1. Scenario 1: Admin khởi tạo hệ thống

```
1. Chạy create_admin.py tạo admin đầu tiên
   → admin / Admin@123456

2. Admin đăng nhập:
   POST /api/auth/login
   {"username": "admin", "password": "Admin@123456"}
   → Nhận token

3. Admin tạo thương hiệu:
   POST /api/brands
   {"brand_name": "Trek"}

4. Admin tạo danh mục:
   POST /api/categories
   {"category_name": "Mountain Bikes"}

5. Admin tạo sản phẩm:
   POST /api/products
   {
     "product_name": "Trek 520",
     "brand_id": 1,
     "category_id": 1,
     "model_year": 2024,
     "list_price": 1899.99
   }

6. Admin tạo nhân viên:
   POST /api/auth/register
   {
     "username": "staff001",
     "email": "staff001@bikestore.com",
     "password": "Staff@123",
     "first_name": "John",
     "last_name": "Doe",
     "role": "STAFF"
   }
   → Staff này có manager_id = admin_id
```

---

### 8.2. Scenario 2: Staff xử lý đơn hàng

```
1. Staff đăng nhập:
   POST /api/auth/login
   {"username": "staff001", "password": "Staff@123"}

2. Tạo khách hàng mới:
   POST /api/customers
   {
     "first_name": "Alice",
     "last_name": "Johnson",
     "email": "alice@example.com",
     "phone": "0912345678"
   }

3. Tạo đơn hàng:
   POST /api/orders
   {
     "customer_id": 1,
     "order_status": 1,
     "staff_id": 2,
     "items": [
       {
         "product_id": 1,
         "quantity": 2,
         "list_price": 1899.99,
         "discount": 0.05
       }
     ]
   }

4. Cập nhật trạng thái đơn:
   PUT /api/orders/1
   {"order_status": 2}  // Processing

5. Hoàn thành đơn:
   PUT /api/orders/1
   {
     "order_status": 3,
     "shipped_date": "2025-12-23"
   }
```

---

### 8.3. Scenario 3: Staff cập nhật thông tin cá nhân

```
1. Staff xem thông tin bản thân:
   GET /api/auth/me

2. Staff đổi password:
   PUT /api/auth/profile
   {
     "password": "NewSecurePass456",
     "phone": "0987654321"
   }

3. Staff thử đổi email (SẼ BỊ TỪ CHỐI):
   PUT /api/auth/profile
   {"email": "newemail@example.com"}
   # ❌ Email không nằm trong schema StaffProfileUpdate
```

---

### 8.4. Scenario 4: Admin quản lý nhân viên

```
1. Xem danh sách staff:
   GET /api/staffs

2. Xem staff có manager_id = 1 (do admin ID=1 tạo):
   GET /api/staffs?manager_id=1

3. Admin đổi email cho staff:
   PUT /api/staffs/2
   {"email": "newemail@bikestore.com"}

4. Admin promote staff lên admin:
   PUT /api/staffs/2
   {"role": "ADMIN", "manager_id": null}

5. Admin vô hiệu hóa staff:
   PUT /api/staffs/2
   {"is_active": false}

6. Admin xóa staff:
   DELETE /api/staffs/2
```

---

### 8.5. Scenario 5: Xem thống kê

```
1. Xem tổng quan cửa hàng:
   GET /api/statistics/store/overview

2. Doanh số theo tháng năm 2025:
   GET /api/statistics/store/sales/by-month?year=2025

3. Top 5 sản phẩm bán chạy:
   GET /api/statistics/products/top-selling?limit=5

4. Top 10 khách hàng VIP:
   GET /api/statistics/customers/top-buyers?limit=10

5. Doanh số nhân viên ID=2:
   GET /api/statistics/staffs/2/sales

6. Doanh số nhân viên theo tháng:
   GET /api/statistics/staffs/2/sales/by-month?year=2025
```

---

## 9. TROUBLESHOOTING

### 9.1. Lỗi kết nối database

```
Error: psycopg2.OperationalError: could not connect to server
```

**Giải pháp:**
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra DATABASE_URL trong .env
3. Kiểm tra firewall/network

---

### 9.2. Lỗi 401 Unauthorized

```
{"detail": "Could not validate credentials"}
```

**Nguyên nhân:**
- Token hết hạn (sau 30 phút)
- Token không hợp lệ
- Thiếu header Authorization

**Giải pháp:**
1. Đăng nhập lại lấy token mới
2. Kiểm tra header: `Authorization: Bearer <token>`

---

### 9.3. Lỗi 403 Forbidden

```
{"detail": "Admin privileges required"}
```

**Nguyên nhân:**
- Staff cố truy cập endpoint chỉ dành cho ADMIN

**Giải pháp:**
- Đăng nhập bằng tài khoản ADMIN

---

### 9.4. Migration lỗi

```
Error: Target database is not up to date
```

**Giải pháp:**
```powershell
alembic upgrade head
```

---

## 10. API TESTING với CURL

### 10.1. Đăng nhập
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123456"}'
```

### 10.2. Lấy danh sách sản phẩm
```bash
curl -X GET http://localhost:8000/api/products
```

### 10.3. Tạo sản phẩm (cần token)
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Giant Talon 3",
    "brand_id": 1,
    "category_id": 1,
    "model_year": 2024,
    "list_price": 750.00
  }'
```

---

## 11. BẢO MẬT & BEST PRACTICES

### 11.1. Bảo mật

✅ **Đã implement:**
- JWT với expiration time
- Password hashing với bcrypt
- SSL connection đến database
- CORS middleware
- Role-based access control
- Input validation với Pydantic

⚠️ **Cần cải thiện:**
- Rate limiting (chống brute-force)
- Token blacklist (logout)
- Refresh token mechanism
- API key cho external services
- Audit logging

### 11.2. Best Practices

1. **Luôn đổi password admin mặc định**
2. **Sử dụng HTTPS trong production**
3. **Backup database định kỳ**
4. **Monitor logs và performance**
5. **Giữ SECRET_KEY bí mật tuyệt đối**
6. **Không commit file .env vào git**

---

## 12. CHANGELOG

### Version 2.0.0 (22/12/2025)
- ✅ Thay đổi logic đăng ký: Mặc định tạo ADMIN
- ✅ Thêm quan hệ manager-staff
- ✅ Bảo vệ endpoint register chỉ cho ADMIN
- ✅ Thêm endpoint /api/auth/profile cho staff tự cập nhật
- ✅ Staff không được đổi email (chỉ admin)
- ✅ Cải thiện documentation

---

## 13. CONTACT & SUPPORT

- **Documentation**: `/docs` và `/redoc`
- **Health Check**: `/health`
- **Repository**: [GitHub URL]

---

**© 2025 BikeStore Shop - All Rights Reserved**
