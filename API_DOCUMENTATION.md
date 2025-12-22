# 📡 BIKESTORE SHOP - API DOCUMENTATION FOR FRONTEND

**Base URL:** `https://lightweightbikestore.onrender.com`  
**API Version:** 2.0.0  
**Last Updated:** 22/12/2025

---

## 📋 MỤC LỤC

1. [Authentication](#1-authentication)
2. [Staff Management](#2-staff-management)
3. [Products](#3-products)
4. [Brands](#4-brands)
5. [Categories](#5-categories)
6. [Customers](#6-customers)
7. [Orders](#7-orders)
8. [Statistics](#8-statistics)
9. [Error Handling](#9-error-handling)
10. [Authentication Flow](#10-authentication-flow)

---

## 🔐 AUTHENTICATION

### Cách sử dụng token:

Sau khi đăng nhập thành công, thêm header vào tất cả các request:

```
Authorization: Bearer <access_token>
```

---

## 1. AUTHENTICATION

### 1.1. Đăng ký Admin

**Endpoint:** `POST /api/auth/register`  
**Authorization:** ❌ Không yêu cầu (Public)  
**Mục đích:** Tạo tài khoản ADMIN mới (cho admin đầu tiên hoặc admin khác)

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@bikestore.com",
  "password": "Admin@123456",
  "first_name": "Super",
  "last_name": "Admin",
  "phone": "0987654321"
}
```

**Ràng buộc:**
- `username`: Bắt buộc, unique
- `email`: Bắt buộc, unique, format email hợp lệ
- `password`: Bắt buộc, tối thiểu 8 ký tự
- `first_name`, `last_name`: Bắt buộc
- `phone`: Optional

**Response:** `201 Created`
```json
{
  "staff_id": 1,
  "username": "admin",
  "email": "admin@bikestore.com",
  "first_name": "Super",
  "last_name": "Admin",
  "phone": "0987654321",
  "role": "ADMIN",
  "is_active": true,
  "created_at": "2025-12-22T10:00:00"
}
```

**Errors:**
- `400` - Username hoặc email đã tồn tại
- `422` - Validation error (password < 8 ký tự, email không hợp lệ)

---

### 1.2. Đăng nhập

**Endpoint:** `POST /api/auth/login`  
**Authorization:** ❌ Không yêu cầu (Public)  
**Mục đích:** Đăng nhập để lấy JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123456"
}
```

**Ràng buộc:**
- `username`: Bắt buộc
- `password`: Bắt buộc

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInN0YWZmX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3MDM1MDAwMDB9.xxxxx",
  "token_type": "bearer"
}
```

**Lưu token và sử dụng:**
```javascript
// Lưu vào localStorage hoặc cookie
localStorage.setItem('access_token', response.access_token);

// Sử dụng cho các request sau
headers: {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
}
```

**Errors:**
- `401` - Username hoặc password sai
- `400` - Tài khoản bị vô hiệu hóa (is_active=false)

**Token Expiry:** 30 phút (cấu hình trong .env)

---

### 1.3. Lấy thông tin user hiện tại

**Endpoint:** `GET /api/auth/me`  
**Authorization:** ✅ Required (Bearer Token)  
**Mục đích:** Lấy thông tin của user đang đăng nhập

**Request Headers:**
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
  "phone": "0987654321",
  "role": "ADMIN",
  "is_active": true,
  "created_at": "2025-12-01T00:00:00"
}
```

**Errors:**
- `401` - Token không hợp lệ hoặc hết hạn
- `400` - User bị vô hiệu hóa

**Use Case:** Hiển thị thông tin user trong navbar, profile page

---

### 1.4. Cập nhật thông tin cá nhân

**Endpoint:** `PUT /api/auth/profile`  
**Authorization:** ✅ Required (Bearer Token)  
**Mục đích:** Staff/Admin tự cập nhật thông tin của mình (KHÔNG bao gồm email)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (Tất cả fields đều optional)
```json
{
  "first_name": "Nguyen Van",
  "last_name": "An",
  "phone": "0912345678",
  "password": "NewPassword456"
}
```

**Ràng buộc:**
- Tất cả fields optional
- `password`: Nếu có, phải >= 8 ký tự
- ❌ KHÔNG có field `email` (chỉ admin mới đổi được qua `/api/staffs/{id}`)

**Response:** `200 OK`
```json
{
  "staff_id": 1,
  "username": "admin",
  "email": "admin@bikestore.com",
  "first_name": "Nguyen Van",
  "last_name": "An",
  "phone": "0912345678",
  "role": "ADMIN",
  "is_active": true,
  "created_at": "2025-12-01T00:00:00"
}
```

**Errors:**
- `401` - Chưa đăng nhập
- `422` - Password < 8 ký tự

**Lưu ý:** 
- Staff KHÔNG thể đổi email (security reason)
- Nếu muốn đổi email, phải yêu cầu admin

---

## 2. STAFF MANAGEMENT

### 2.1. Tạo Staff mới

**Endpoint:** `POST /api/staffs`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin tạo tài khoản STAFF mới, staff sẽ có manager_id = admin_id

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "username": "staff001",
  "email": "staff001@bikestore.com",
  "password": "StaffPass123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0987654321"
}
```

**Ràng buộc:**
- `username`: Bắt buộc, unique
- `email`: Bắt buộc, unique, format email hợp lệ
- `password`: Bắt buộc, >= 8 ký tự
- `first_name`, `last_name`: Bắt buộc
- `phone`: Optional
- Staff sẽ tự động có `role="STAFF"` và `manager_id=<admin_id>`

**Response:** `201 Created`
```json
{
  "staff_id": 2,
  "username": "staff001",
  "email": "staff001@bikestore.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0987654321",
  "role": "STAFF",
  "manager_id": 1,
  "is_active": true,
  "created_at": "2025-12-22T10:30:00"
}
```

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN
- `400` - Username/email đã tồn tại
- `422` - Validation error

---

### 2.2. Lấy danh sách Staff

**Endpoint:** `GET /api/staffs`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin xem danh sách staff do CHÍNH HỌ quản lý

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `skip`: Số lượng bỏ qua (default: 0)
- `limit`: Số lượng trả về (default: 100, max: 1000)

**Example:**
```
GET /api/staffs?skip=0&limit=20
```

**Response:** `200 OK`
```json
[
  {
    "staff_id": 2,
    "username": "staff001",
    "email": "staff001@bikestore.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0987654321",
    "role": "STAFF",
    "manager_id": 1,
    "is_active": true,
    "created_at": "2025-12-22T10:30:00"
  },
  {
    "staff_id": 3,
    "username": "staff002",
    "email": "staff002@bikestore.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "0912345678",
    "role": "STAFF",
    "manager_id": 1,
    "is_active": true,
    "created_at": "2025-12-22T11:00:00"
  }
]
```

**Lưu ý:**
- Chỉ trả về staff có `manager_id = admin_id`
- Admin A KHÔNG thấy staff của Admin B

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN

---

### 2.3. Xem chi tiết Staff

**Endpoint:** `GET /api/staffs/{staff_id}`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin xem chi tiết 1 staff (phải do họ quản lý)

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `staff_id`: ID của staff cần xem

**Example:**
```
GET /api/staffs/2
```

**Response:** `200 OK`
```json
{
  "staff_id": 2,
  "username": "staff001",
  "email": "staff001@bikestore.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0987654321",
  "role": "STAFF",
  "manager_id": 1,
  "is_active": true,
  "created_at": "2025-12-22T10:30:00",
  "updated_at": "2025-12-22T10:30:00"
}
```

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN hoặc staff không do admin này quản lý
- `404` - Staff không tồn tại

---

### 2.4. Cập nhật thông tin Staff

**Endpoint:** `PUT /api/staffs/{staff_id}`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin cập nhật thông tin staff (bao gồm email, role)

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (Tất cả fields optional)
```json
{
  "email": "newemail@bikestore.com",
  "first_name": "John Updated",
  "last_name": "Doe",
  "phone": "0999999999",
  "role": "ADMIN",
  "is_active": false
}
```

**Ràng buộc:**
- Admin chỉ cập nhật được staff có `manager_id = admin_id`
- `email`: Nếu có, phải unique và format hợp lệ
- `role`: "ADMIN" hoặc "STAFF"
- `is_active`: true/false (vô hiệu hóa tài khoản)

**Response:** `200 OK`
```json
{
  "staff_id": 2,
  "username": "staff001",
  "email": "newemail@bikestore.com",
  "first_name": "John Updated",
  "last_name": "Doe",
  "phone": "0999999999",
  "role": "ADMIN",
  "manager_id": null,
  "is_active": false,
  "created_at": "2025-12-22T10:30:00",
  "updated_at": "2025-12-22T15:00:00"
}
```

**Use Cases:**
- Đổi email cho staff
- Promote staff lên admin
- Vô hiệu hóa tài khoản staff

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN hoặc staff không do admin này quản lý
- `404` - Staff không tồn tại
- `400` - Email đã tồn tại

---

### 2.5. Xóa Staff

**Endpoint:** `DELETE /api/staffs/{staff_id}`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin xóa tài khoản staff (phải do họ quản lý)

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `staff_id`: ID của staff cần xóa

**Example:**
```
DELETE /api/staffs/2
```

**Response:** `204 No Content`

**Ràng buộc:**
- Admin chỉ xóa được staff có `manager_id = admin_id`
- Không được xóa chính mình

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN hoặc staff không do admin này quản lý
- `404` - Staff không tồn tại
- `400` - Cố xóa chính mình

---

## 3. PRODUCTS

### 3.1. Lấy danh sách sản phẩm

**Endpoint:** `GET /api/products`  
**Authorization:** ❌ Không yêu cầu (Public)  
**Mục đích:** Lấy danh sách sản phẩm (có phân trang và lọc)

**Query Parameters:**
- `skip`: Bỏ qua n sản phẩm (default: 0)
- `limit`: Số lượng trả về (default: 100, max: 1000)
- `brand_id`: Lọc theo thương hiệu (optional)
- `category_id`: Lọc theo danh mục (optional)

**Examples:**
```
GET /api/products
GET /api/products?skip=0&limit=20
GET /api/products?brand_id=1
GET /api/products?category_id=2&limit=50
GET /api/products?brand_id=1&category_id=2
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
    "category_name": "Touring Bikes",
    "model_year": 2023,
    "list_price": 1899.99
  },
  {
    "product_id": 2,
    "product_name": "Giant Talon 3 - Mountain Bike",
    "brand_id": 2,
    "brand_name": "Giant",
    "category_id": 1,
    "category_name": "Mountain Bikes",
    "model_year": 2024,
    "list_price": 750.00
  }
]
```

**Use Case:** 
- Trang danh sách sản phẩm
- Filter theo brand/category
- Pagination

---

### 3.2. Xem chi tiết sản phẩm

**Endpoint:** `GET /api/products/{product_id}`  
**Authorization:** ❌ Không yêu cầu (Public)  
**Mục đích:** Xem thông tin chi tiết 1 sản phẩm

**Path Parameters:**
- `product_id`: ID của sản phẩm

**Example:**
```
GET /api/products/1
```

**Response:** `200 OK`
```json
{
  "product_id": 1,
  "product_name": "Trek 520 - Touring Bike",
  "brand_id": 1,
  "brand_name": "Trek",
  "category_id": 2,
  "category_name": "Touring Bikes",
  "model_year": 2023,
  "list_price": 1899.99
}
```

**Errors:**
- `404` - Sản phẩm không tồn tại

---

### 3.3. Tạo sản phẩm mới

**Endpoint:** `POST /api/products`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin tạo sản phẩm mới

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

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

**Ràng buộc:**
- `product_name`: Bắt buộc
- `brand_id`: Bắt buộc, phải tồn tại trong bảng brands
- `category_id`: Bắt buộc, phải tồn tại trong bảng categories
- `model_year`: Optional
- `list_price`: Bắt buộc, > 0

**Response:** `201 Created`
```json
{
  "product_id": 3,
  "product_name": "Giant Talon 3 - Mountain Bike",
  "brand_id": 2,
  "brand_name": "Giant",
  "category_id": 1,
  "category_name": "Mountain Bikes",
  "model_year": 2024,
  "list_price": 750.00
}
```

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN
- `400` - brand_id hoặc category_id không tồn tại
- `422` - Validation error (list_price <= 0)

---

### 3.4. Cập nhật sản phẩm

**Endpoint:** `PUT /api/products/{product_id}`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin cập nhật thông tin sản phẩm

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (Tất cả fields optional)
```json
{
  "product_name": "Giant Talon 3 - Updated",
  "list_price": 799.99,
  "model_year": 2025
}
```

**Response:** `200 OK`
```json
{
  "product_id": 3,
  "product_name": "Giant Talon 3 - Updated",
  "brand_id": 2,
  "brand_name": "Giant",
  "category_id": 1,
  "category_name": "Mountain Bikes",
  "model_year": 2025,
  "list_price": 799.99
}
```

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN
- `404` - Sản phẩm không tồn tại

---

### 3.5. Xóa sản phẩm

**Endpoint:** `DELETE /api/products/{product_id}`  
**Authorization:** ✅ Required (ADMIN only)  
**Mục đích:** Admin xóa sản phẩm

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `204 No Content`

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN
- `404` - Sản phẩm không tồn tại
- `400` - Sản phẩm đã có trong order (không thể xóa)

---

## 4. BRANDS

### 4.1. Lấy danh sách thương hiệu

**Endpoint:** `GET /api/brands`  
**Authorization:** ❌ Không yêu cầu (Public)

**Query Parameters:**
- `skip`: default 0
- `limit`: default 100, max 1000

**Example:**
```
GET /api/brands?limit=50
```

**Response:** `200 OK`
```json
[
  {
    "brand_id": 1,
    "brand_name": "Trek"
  },
  {
    "brand_id": 2,
    "brand_name": "Giant"
  },
  {
    "brand_id": 3,
    "brand_name": "Specialized"
  }
]
```

---

### 4.2. Xem chi tiết thương hiệu

**Endpoint:** `GET /api/brands/{brand_id}`  
**Authorization:** ❌ Không yêu cầu (Public)

**Response:** `200 OK`
```json
{
  "brand_id": 1,
  "brand_name": "Trek"
}
```

**Errors:**
- `404` - Brand không tồn tại

---

### 4.3. Tạo thương hiệu

**Endpoint:** `POST /api/brands`  
**Authorization:** ✅ Required (ADMIN only)

**Request Body:**
```json
{
  "brand_name": "Cannondale"
}
```

**Response:** `201 Created`
```json
{
  "brand_id": 4,
  "brand_name": "Cannondale"
}
```

**Errors:**
- `401` - Chưa đăng nhập
- `403` - Không phải ADMIN

---

### 4.4. Cập nhật thương hiệu

**Endpoint:** `PUT /api/brands/{brand_id}`  
**Authorization:** ✅ Required (ADMIN only)

**Request Body:**
```json
{
  "brand_name": "Cannondale Updated"
}
```

**Response:** `200 OK`

---

### 4.5. Xóa thương hiệu

**Endpoint:** `DELETE /api/brands/{brand_id}`  
**Authorization:** ✅ Required (ADMIN only)

**Response:** `204 No Content`

**Errors:**
- `400` - Brand đang được sử dụng bởi products (không thể xóa)

---

## 5. CATEGORIES

API tương tự Brands:

- `GET /api/categories` - Lấy danh sách (Public)
- `GET /api/categories/{id}` - Chi tiết (Public)
- `POST /api/categories` - Tạo mới (ADMIN)
- `PUT /api/categories/{id}` - Cập nhật (ADMIN)
- `DELETE /api/categories/{id}` - Xóa (ADMIN)

**Request/Response format tương tự Brands**

---

## 6. CUSTOMERS

### 6.1. Lấy danh sách khách hàng

**Endpoint:** `GET /api/customers`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `skip`, `limit`: Phân trang
- `city`: Lọc theo thành phố (optional)
- `state`: Lọc theo tỉnh/bang (optional)

**Example:**
```
GET /api/customers?city=Ho Chi Minh&limit=20
```

**Response:** `200 OK`
```json
[
  {
    "customer_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0987654321",
    "street": "123 Main St",
    "city": "Ho Chi Minh",
    "state": "HCM",
    "zip_code": "70000"
  }
]
```

---

### 6.2. Xem chi tiết khách hàng

**Endpoint:** `GET /api/customers/{customer_id}`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
{
  "customer_id": 1,
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

### 6.3. Tạo khách hàng mới

**Endpoint:** `POST /api/customers`  
**Authorization:** ✅ Required (Authenticated)

**Request Body:**
```json
{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice@example.com",
  "phone": "0912345678",
  "street": "456 Oak Ave",
  "city": "Ha Noi",
  "state": "HN",
  "zip_code": "10000"
}
```

**Ràng buộc:**
- `first_name`, `last_name`: Bắt buộc
- `email`: Optional, nếu có phải unique
- `phone`: Optional
- Address fields: Optional

**Response:** `201 Created`

---

### 6.4. Cập nhật khách hàng

**Endpoint:** `PUT /api/customers/{customer_id}`  
**Authorization:** ✅ Required (Authenticated)

**Request Body:** (Fields optional)
```json
{
  "phone": "0999999999",
  "city": "Da Nang"
}
```

**Response:** `200 OK`

---

### 6.5. Xóa khách hàng

**Endpoint:** `DELETE /api/customers/{customer_id}`  
**Authorization:** ✅ Required (ADMIN only)

**Response:** `204 No Content`

---

## 7. ORDERS

### 7.1. Lấy danh sách đơn hàng

**Endpoint:** `GET /api/orders`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `skip`, `limit`: Phân trang
- `customer_id`: Lọc theo khách hàng (optional)
- `staff_id`: Lọc theo nhân viên (optional)
- `order_status`: Lọc theo trạng thái 1-4 (optional)

**Order Status:**
- `1` - Pending (Chờ xử lý)
- `2` - Processing (Đang xử lý)
- `3` - Completed (Hoàn thành)
- `4` - Cancelled (Đã hủy)

**Example:**
```
GET /api/orders?order_status=2&limit=20
GET /api/orders?customer_id=1
```

**Response:** `200 OK`
```json
[
  {
    "order_id": 1,
    "customer_id": 10,
    "order_status": 2,
    "order_date": "2025-12-20",
    "required_date": "2025-12-25",
    "shipped_date": null,
    "store_id": 1,
    "staff_id": 2
  }
]
```

---

### 7.2. Xem chi tiết đơn hàng

**Endpoint:** `GET /api/orders/{order_id}`  
**Authorization:** ✅ Required (Authenticated)  
**Mục đích:** Xem chi tiết đơn hàng kèm danh sách sản phẩm

**Response:** `200 OK`
```json
{
  "order_id": 1,
  "customer_id": 10,
  "customer_name": "John Doe",
  "order_status": 2,
  "order_date": "2025-12-20",
  "required_date": "2025-12-25",
  "shipped_date": null,
  "store_id": 1,
  "staff_id": 2,
  "staff_name": "Jane Smith",
  "items": [
    {
      "item_id": 1,
      "product_id": 3,
      "product_name": "Trek 520 - Touring Bike",
      "quantity": 2,
      "list_price": 1899.99,
      "discount": 0.05,
      "total": 3609.98
    },
    {
      "item_id": 2,
      "product_id": 5,
      "product_name": "Giant Talon 3",
      "quantity": 1,
      "list_price": 750.00,
      "discount": 0,
      "total": 750.00
    }
  ],
  "order_total": 4359.98
}
```

**Use Case:** Trang chi tiết đơn hàng, invoice

---

### 7.3. Tạo đơn hàng mới

**Endpoint:** `POST /api/orders`  
**Authorization:** ✅ Required (Authenticated)

**Request Body:**
```json
{
  "customer_id": 10,
  "order_status": 1,
  "order_date": "2025-12-22",
  "required_date": "2025-12-25",
  "store_id": 1,
  "staff_id": 2,
  "items": [
    {
      "product_id": 3,
      "quantity": 2,
      "list_price": 1899.99,
      "discount": 0.05
    },
    {
      "product_id": 5,
      "quantity": 1,
      "list_price": 750.00,
      "discount": 0
    }
  ]
}
```

**Ràng buộc:**
- `customer_id`: Bắt buộc, phải tồn tại
- `order_status`: Bắt buộc (1-4)
- `order_date`: Bắt buộc
- `staff_id`: Bắt buộc
- `items`: Bắt buộc, ít nhất 1 item
  - `product_id`: Phải tồn tại
  - `quantity`: > 0
  - `list_price`: > 0
  - `discount`: 0-1 (0% - 100%)

**Response:** `201 Created`
```json
{
  "order_id": 2,
  "customer_id": 10,
  "order_status": 1,
  "order_date": "2025-12-22",
  "required_date": "2025-12-25",
  "shipped_date": null,
  "store_id": 1,
  "staff_id": 2
}
```

**Use Case:** Tạo đơn hàng mới khi khách mua

---

### 7.4. Cập nhật đơn hàng

**Endpoint:** `PUT /api/orders/{order_id}`  
**Authorization:** ✅ Required (Authenticated)  
**Mục đích:** Cập nhật trạng thái đơn hàng

**Request Body:** (Fields optional)
```json
{
  "order_status": 3,
  "shipped_date": "2025-12-23"
}
```

**Use Case:** 
- Đổi trạng thái: Pending → Processing → Completed
- Cập nhật shipped_date khi giao hàng

**Response:** `200 OK`

---

### 7.5. Xóa đơn hàng

**Endpoint:** `DELETE /api/orders/{order_id}`  
**Authorization:** ✅ Required (ADMIN only)

**Response:** `204 No Content`

**Lưu ý:** Xóa order sẽ xóa luôn tất cả order_items

---

### 7.6. Lấy items của đơn hàng

**Endpoint:** `GET /api/orders/{order_id}/items`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
[
  {
    "order_id": 1,
    "item_id": 1,
    "product_id": 3,
    "product_name": "Trek 520",
    "quantity": 2,
    "list_price": 1899.99,
    "discount": 0.05
  }
]
```

---

### 7.7. Thêm item vào đơn hàng

**Endpoint:** `POST /api/orders/{order_id}/items`  
**Authorization:** ✅ Required (Authenticated)

**Request Body:**
```json
{
  "product_id": 7,
  "quantity": 1,
  "list_price": 999.99,
  "discount": 0.1
}
```

**Response:** `201 Created`

---

### 7.8. Cập nhật item trong đơn hàng

**Endpoint:** `PUT /api/orders/{order_id}/items/{item_id}`  
**Authorization:** ✅ Required (Authenticated)

**Request Body:**
```json
{
  "quantity": 3,
  "discount": 0.15
}
```

**Response:** `200 OK`

---

### 7.9. Xóa item khỏi đơn hàng

**Endpoint:** `DELETE /api/orders/{order_id}/items/{item_id}`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `204 No Content`

---

## 8. STATISTICS

**Tất cả endpoints thống kê yêu cầu authentication (STAFF hoặc ADMIN)**

### 8.1. Tổng quan cửa hàng

**Endpoint:** `GET /api/statistics/store/overview`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
{
  "total_revenue": 1250000.50,
  "total_orders": 458,
  "total_bikes_sold": 892,
  "total_customers": 256
}
```

**Use Case:** Dashboard tổng quan

---

### 8.2. Doanh số theo ngày

**Endpoint:** `GET /api/statistics/store/sales/by-day`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `start_date`: Ngày bắt đầu (required, format: YYYY-MM-DD)
- `end_date`: Ngày kết thúc (required, format: YYYY-MM-DD)

**Example:**
```
GET /api/statistics/store/sales/by-day?start_date=2025-12-01&end_date=2025-12-31
```

**Response:** `200 OK`
```json
[
  {
    "period": "2025-12-01",
    "order_count": 15,
    "total_bikes": 28,
    "total_revenue": 45000.00
  },
  {
    "period": "2025-12-02",
    "order_count": 12,
    "total_bikes": 23,
    "total_revenue": 38500.00
  }
]
```

**Use Case:** Biểu đồ doanh số theo ngày

---

### 8.3. Doanh số theo tháng

**Endpoint:** `GET /api/statistics/store/sales/by-month`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `year`: Năm (optional, default: năm hiện tại)

**Example:**
```
GET /api/statistics/store/sales/by-month?year=2025
```

**Response:** `200 OK`
```json
[
  {
    "period": "2025-01",
    "order_count": 45,
    "total_bikes": 89,
    "total_revenue": 125000.00
  },
  {
    "period": "2025-02",
    "order_count": 52,
    "total_bikes": 102,
    "total_revenue": 148500.00
  }
]
```

---

### 8.4. Doanh số theo quý

**Endpoint:** `GET /api/statistics/store/sales/by-quarter`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `year`: Năm (optional)

**Response:** `200 OK`
```json
[
  {
    "period": "Q1 2025",
    "order_count": 145,
    "total_bikes": 289,
    "total_revenue": 425000.00
  }
]
```

---

### 8.5. Doanh số theo năm

**Endpoint:** `GET /api/statistics/store/sales/by-year`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
[
  {
    "period": "2023",
    "order_count": 520,
    "total_bikes": 1050,
    "total_revenue": 1850000.00
  },
  {
    "period": "2024",
    "order_count": 645,
    "total_bikes": 1289,
    "total_revenue": 2250000.00
  }
]
```

---

### 8.6. Số lượng nhân viên

**Endpoint:** `GET /api/statistics/staffs/count`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
{
  "total_staff": 25,
  "active_staff": 23,
  "inactive_staff": 2
}
```

---

### 8.7. Doanh số tất cả nhân viên

**Endpoint:** `GET /api/statistics/staffs/sales`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
[
  {
    "staff_id": 5,
    "staff_name": "John Doe",
    "order_count": 45,
    "total_bikes_sold": 89,
    "total_revenue": 125000.00
  },
  {
    "staff_id": 8,
    "staff_name": "Jane Smith",
    "order_count": 52,
    "total_bikes_sold": 102,
    "total_revenue": 148500.00
  }
]
```

**Use Case:** Bảng xếp hạng nhân viên

---

### 8.8. Doanh số 1 nhân viên

**Endpoint:** `GET /api/statistics/staffs/{staff_id}/sales`  
**Authorization:** ✅ Required (Authenticated)

**Response:** `200 OK`
```json
{
  "staff_id": 5,
  "staff_name": "John Doe",
  "order_count": 45,
  "total_bikes_sold": 89,
  "total_revenue": 125000.00
}
```

---

### 8.9. Doanh số nhân viên theo tháng

**Endpoint:** `GET /api/statistics/staffs/{staff_id}/sales/by-month`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `year`: Năm (optional)

**Response:** `200 OK`
```json
[
  {
    "period": "2025-01",
    "order_count": 8,
    "total_bikes": 15,
    "total_revenue": 22500.00
  }
]
```

---

### 8.10. Top sản phẩm bán chạy

**Endpoint:** `GET /api/statistics/products/top-selling`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `limit`: Số lượng (default: 10, max: 100)

**Example:**
```
GET /api/statistics/products/top-selling?limit=5
```

**Response:** `200 OK`
```json
{
  "products": [
    {
      "product_id": 3,
      "product_name": "Trek 520 - Touring Bike",
      "brand_name": "Trek",
      "category_name": "Touring Bikes",
      "total_quantity_sold": 125,
      "total_revenue": 237499.75
    },
    {
      "product_id": 7,
      "product_name": "Giant Talon 3",
      "brand_name": "Giant",
      "category_name": "Mountain Bikes",
      "total_quantity_sold": 98,
      "total_revenue": 73500.00
    }
  ]
}
```

**Use Case:** 
- Trang thống kê sản phẩm
- Biểu đồ top seller

---

### 8.11. Top khách hàng VIP

**Endpoint:** `GET /api/statistics/customers/top-buyers`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `limit`: Số lượng (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "customers": [
    {
      "customer_id": 10,
      "customer_name": "John Doe",
      "total_orders": 15,
      "total_spent": 45000.00
    },
    {
      "customer_id": 25,
      "customer_name": "Alice Johnson",
      "total_orders": 12,
      "total_spent": 38500.00
    }
  ]
}
```

**Use Case:** Loyalty program, khách hàng thân thiết

---

### 8.12. Đơn hàng giá trị cao nhất

**Endpoint:** `GET /api/statistics/customers/highest-orders`  
**Authorization:** ✅ Required (Authenticated)

**Query Parameters:**
- `limit`: Số lượng (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "orders": [
    {
      "order_id": 125,
      "customer_id": 45,
      "customer_name": "Bob Wilson",
      "order_date": "2025-12-15",
      "order_value": 15800.00
    },
    {
      "order_id": 98,
      "customer_id": 32,
      "customer_name": "Sarah Brown",
      "order_date": "2025-12-10",
      "order_value": 12500.00
    }
  ]
}
```

---

## 9. ERROR HANDLING

### Error Response Format

Tất cả errors đều có format chuẩn:

```json
{
  "detail": "Error message here"
}
```

### HTTP Status Codes

| Code | Meaning | Khi nào xảy ra |
|------|---------|----------------|
| `200` | OK | Request thành công |
| `201` | Created | Tạo resource thành công |
| `204` | No Content | Xóa thành công |
| `400` | Bad Request | Dữ liệu không hợp lệ, business logic error |
| `401` | Unauthorized | Chưa đăng nhập hoặc token hết hạn |
| `403` | Forbidden | Không có quyền truy cập |
| `404` | Not Found | Resource không tồn tại |
| `422` | Unprocessable Entity | Validation error (Pydantic) |
| `500` | Internal Server Error | Lỗi server |

### Error Examples

**401 Unauthorized:**
```json
{
  "detail": "Could not validate credentials"
}
```
**Nguyên nhân:** Token hết hạn, token không hợp lệ, thiếu Authorization header  
**Xử lý:** Redirect về trang login

---

**403 Forbidden:**
```json
{
  "detail": "Admin privileges required"
}
```
**Nguyên nhân:** User không có quyền (ví dụ: Staff cố truy cập endpoint ADMIN)  
**Xử lý:** Hiển thị thông báo "Bạn không có quyền truy cập"

---

**403 Forbidden (Staff Management):**
```json
{
  "detail": "You can only manage your own staff members"
}
```
**Nguyên nhân:** Admin cố quản lý staff không do họ tạo  
**Xử lý:** Hiển thị thông báo lỗi

---

**404 Not Found:**
```json
{
  "detail": "Staff not found"
}
```
**Nguyên nhân:** Resource không tồn tại  
**Xử lý:** Hiển thị trang 404 hoặc thông báo

---

**422 Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "Password must be at least 8 characters",
      "type": "value_error"
    }
  ]
}
```
**Nguyên nhân:** Dữ liệu input không đúng format  
**Xử lý:** Hiển thị error message bên dưới input field

---

**400 Bad Request:**
```json
{
  "detail": "Username or email already registered"
}
```
**Nguyên nhân:** Business logic error  
**Xử lý:** Hiển thị thông báo cho user

---

## 10. AUTHENTICATION FLOW

### 10.1. Flow đăng nhập (Frontend Implementation)

```javascript
// 1. User submit login form
async function login(username, password) {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }

    const data = await response.json();
    
    // 2. Lưu token vào localStorage
    localStorage.setItem('access_token', data.access_token);
    
    // 3. Lấy thông tin user
    await getCurrentUser();
    
    // 4. Redirect đến dashboard
    window.location.href = '/dashboard';
    
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

// Lấy thông tin user hiện tại
async function getCurrentUser() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const user = await response.json();
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}
```

---

### 10.2. Axios Interceptor (Recommended)

```javascript
import axios from 'axios';

// Tạo axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Tự động thêm token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Xử lý lỗi 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token hết hạn → logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Sử dụng:
// import api from './api';
// const products = await api.get('/api/products');
// const newProduct = await api.post('/api/products', { ... });
```

---

### 10.3. Protected Route (React Example)

```javascript
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Yêu cầu ADMIN nhưng user không phải ADMIN
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/403" />; // Forbidden page
  }
  
  return children;
}

// Sử dụng:
// <Route path="/admin/products" element={
//   <ProtectedRoute requireAdmin={true}>
//     <ProductManagement />
//   </ProtectedRoute>
// } />
```

---

### 10.4. Check Token Expiry

```javascript
// Kiểm tra token có hết hạn không
function isTokenExpired() {
  const token = localStorage.getItem('access_token');
  if (!token) return true;
  
  try {
    // Decode JWT (chỉ decode, không verify)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
  } catch {
    return true;
  }
}

// Check khi app load
if (isTokenExpired()) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## 11. FRONTEND TIPS

### 11.1. Pagination Component

```javascript
function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.ceil(total / limit);
  
  return (
    <div>
      <button 
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      
      <span>Page {page} of {totalPages}</span>
      
      <button 
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

// Sử dụng:
// const [page, setPage] = useState(1);
// const limit = 20;
// const skip = (page - 1) * limit;
// 
// fetch(`/api/products?skip=${skip}&limit=${limit}`)
```

---

### 11.2. Filter Products

```javascript
function ProductFilter() {
  const [filters, setFilters] = useState({
    brand_id: '',
    category_id: '',
    skip: 0,
    limit: 20
  });
  
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function fetchProducts() {
      // Build query string
      const params = new URLSearchParams();
      if (filters.brand_id) params.append('brand_id', filters.brand_id);
      if (filters.category_id) params.append('category_id', filters.category_id);
      params.append('skip', filters.skip);
      params.append('limit', filters.limit);
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data);
    }
    
    fetchProducts();
  }, [filters]);
  
  return (
    <div>
      <select onChange={e => setFilters({...filters, brand_id: e.target.value})}>
        <option value="">All Brands</option>
        {/* Brands options */}
      </select>
      
      <select onChange={e => setFilters({...filters, category_id: e.target.value})}>
        <option value="">All Categories</option>
        {/* Categories options */}
      </select>
      
      {products.map(product => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
```

---

### 11.3. Create Order

```javascript
async function createOrder(orderData) {
  /*
  orderData = {
    customer_id: 1,
    order_status: 1,
    order_date: "2025-12-22",
    required_date: "2025-12-25",
    store_id: 1,
    staff_id: 2,
    items: [
      {
        product_id: 3,
        quantity: 2,
        list_price: 1899.99,
        discount: 0.05
      }
    ]
  }
  */
  
  try {
    const response = await api.post('/api/orders', orderData);
    
    if (response.status === 201) {
      alert('Order created successfully!');
      // Redirect to order detail
      window.location.href = `/orders/${response.data.order_id}`;
    }
  } catch (error) {
    alert('Error: ' + error.response?.data?.detail);
  }
}
```

---

### 11.4. Display Error Messages

```javascript
function FormWithValidation() {
  const [errors, setErrors] = useState({});
  
  async function handleSubmit(data) {
    try {
      await api.post('/api/auth/register', data);
    } catch (error) {
      if (error.response?.status === 422) {
        // Validation errors
        const validationErrors = {};
        error.response.data.detail.forEach(err => {
          const field = err.loc[err.loc.length - 1];
          validationErrors[field] = err.msg;
        });
        setErrors(validationErrors);
      } else {
        // Other errors
        alert(error.response?.data?.detail || 'An error occurred');
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      {errors.username && <span className="error">{errors.username}</span>}
      
      <input name="password" type="password" />
      {errors.password && <span className="error">{errors.password}</span>}
      
      <button type="submit">Register</button>
    </form>
  );
}
```

---

### 11.5. Statistics Dashboard

```javascript
function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  
  useEffect(() => {
    async function fetchStats() {
      // Parallel requests
      const [overviewRes, productsRes] = await Promise.all([
        api.get('/api/statistics/store/overview'),
        api.get('/api/statistics/products/top-selling?limit=5')
      ]);
      
      setOverview(overviewRes.data);
      setTopProducts(productsRes.data.products);
    }
    
    fetchStats();
  }, []);
  
  if (!overview) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${overview.total_revenue.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{overview.total_orders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Bikes Sold</h3>
          <p>{overview.total_bikes_sold}</p>
        </div>
        
        <div className="stat-card">
          <h3>Customers</h3>
          <p>{overview.total_customers}</p>
        </div>
      </div>
      
      <div className="top-products">
        <h2>Top Selling Products</h2>
        {topProducts.map(product => (
          <div key={product.product_id}>
            <span>{product.product_name}</span>
            <span>{product.total_quantity_sold} sold</span>
            <span>${product.total_revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 12. TESTING APIs

### 12.1. Postman Collection

Import vào Postman để test nhanh:

```json
{
  "info": {
    "name": "BikeStore API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

### 12.2. Environment Variables

Tạo environment trong Postman:
- `base_url`: `http://localhost:8000`
- `token`: `<paste_token_after_login>`

---

## 📞 SUPPORT

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

---

**© 2025 BikeStore Shop API Documentation**
