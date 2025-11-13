# API Endpoints Documentation - BikestoreShop

Tài liệu mô tả chi tiết tất cả các API endpoints cho hệ thống quản lý cửa hàng xe đạp BikestoreShop.

**Base URL:** `http://localhost:8000`

**API Version:** v1

---

## Mục lục

1. [Products (Sản phẩm)](#1-products-sản-phẩm)
2. [Brands (Thương hiệu)](#2-brands-thương-hiệu)
3. [Categories (Danh mục)](#3-categories-danh-mục)
4. [Customers (Khách hàng)](#4-customers-khách-hàng)
5. [Orders (Đơn hàng)](#5-orders-đơn-hàng)
6. [Order Items (Chi tiết đơn hàng)](#6-order-items-chi-tiết-đơn-hàng)
7. [Stores (Cửa hàng)](#7-stores-cửa-hàng)
8. [Staffs (Nhân viên)](#8-staffs-nhân-viên)
9. [Stocks (Tồn kho)](#9-stocks-tồn-kho)
10. [Statistics & Reports (Thống kê & Báo cáo)](#10-statistics--reports-thống-kê--báo-cáo)

---

## 1. Products (Sản phẩm)

### 1.1. Lấy danh sách sản phẩm

**Endpoint:** `GET /api/v1/products`

**Chức năng:** Lấy danh sách tất cả sản phẩm với phân trang và tìm kiếm.

**Query Parameters:**
```
- skip: int (default: 0) - Số bản ghi bỏ qua
- limit: int (default: 100) - Số bản ghi tối đa trả về
- search: string (optional) - Tìm kiếm theo tên sản phẩm
- category_id: int (optional) - Lọc theo danh mục
- brand_id: int (optional) - Lọc theo thương hiệu
- min_price: float (optional) - Giá tối thiểu
- max_price: float (optional) - Giá tối đa
- model_year: int (optional) - Năm sản xuất
```

**Response 200:**
```json
{
  "total": 313,
  "skip": 0,
  "limit": 100,
  "data": [
    {
      "product_id": 1,
      "product_name": "Trek 820 - 2016",
      "brand_id": 9,
      "category_id": 6,
      "model_year": 2016,
      "list_price": 379.99
    }
  ]
}
```

---

### 1.2. Lấy thông tin chi tiết sản phẩm

**Endpoint:** `GET /api/v1/products/{product_id}`

**Chức năng:** Lấy thông tin chi tiết của một sản phẩm cụ thể.

**Path Parameters:**
```
- product_id: int (required) - ID của sản phẩm
```

**Response 200:**
```json
{
  "product_id": 1,
  "product_name": "Trek 820 - 2016",
  "brand_id": 9,
  "brand_name": "Trek",
  "category_id": 6,
  "category_name": "Mountain Bikes",
  "model_year": 2016,
  "list_price": 379.99,
  "total_stock": 27
}
```

**Response 404:**
```json
{
  "detail": "Product not found"
}
```

---

### 1.3. Tạo sản phẩm mới

**Endpoint:** `POST /api/v1/products`

**Chức năng:** Tạo một sản phẩm mới trong hệ thống.

**Request Body:**
```json
{
  "product_name": "Giant Talon 1 - 2023",
  "brand_id": 1,
  "category_id": 6,
  "model_year": 2023,
  "list_price": 499.99
}
```

**Response 201:**
```json
{
  "product_id": 314,
  "product_name": "Giant Talon 1 - 2023",
  "brand_id": 1,
  "category_id": 6,
  "model_year": 2023,
  "list_price": 499.99
}
```

**Response 400:**
```json
{
  "detail": "Invalid input data"
}
```

---

### 1.4. Cập nhật sản phẩm

**Endpoint:** `PUT /api/v1/products/{product_id}`

**Chức năng:** Cập nhật thông tin sản phẩm.

**Path Parameters:**
```
- product_id: int (required) - ID của sản phẩm
```

**Request Body:**
```json
{
  "product_name": "Giant Talon 1 - 2023 (Updated)",
  "brand_id": 1,
  "category_id": 6,
  "model_year": 2023,
  "list_price": 549.99
}
```

**Response 200:**
```json
{
  "product_id": 314,
  "product_name": "Giant Talon 1 - 2023 (Updated)",
  "brand_id": 1,
  "category_id": 6,
  "model_year": 2023,
  "list_price": 549.99
}
```

---

### 1.5. Xóa sản phẩm

**Endpoint:** `DELETE /api/v1/products/{product_id}`

**Chức năng:** Xóa sản phẩm khỏi hệ thống.

**Path Parameters:**
```
- product_id: int (required) - ID của sản phẩm
```

**Response 204:** No Content

**Response 404:**
```json
{
  "detail": "Product not found"
}
```

---

## 2. Brands (Thương hiệu)

### 2.1. Lấy danh sách thương hiệu

**Endpoint:** `GET /api/v1/brands`

**Chức năng:** Lấy danh sách tất cả thương hiệu.

**Query Parameters:**
```
- skip: int (default: 0)
- limit: int (default: 100)
- search: string (optional) - Tìm kiếm theo tên thương hiệu
```

**Response 200:**
```json
{
  "total": 9,
  "data": [
    {
      "brand_id": 1,
      "brand_name": "Giant"
    },
    {
      "brand_id": 2,
      "brand_name": "Trek"
    }
  ]
}
```

---

### 2.2. Lấy thông tin thương hiệu

**Endpoint:** `GET /api/v1/brands/{brand_id}`

**Chức năng:** Lấy thông tin chi tiết của một thương hiệu.

**Path Parameters:**
```
- brand_id: int (required)
```

**Response 200:**
```json
{
  "brand_id": 1,
  "brand_name": "Giant",
  "total_products": 45
}
```

---

### 2.3. Tạo thương hiệu mới

**Endpoint:** `POST /api/v1/brands`

**Chức năng:** Tạo thương hiệu mới.

**Request Body:**
```json
{
  "brand_name": "Cannondale"
}
```

**Response 201:**
```json
{
  "brand_id": 10,
  "brand_name": "Cannondale"
}
```

---

### 2.4. Cập nhật thương hiệu

**Endpoint:** `PUT /api/v1/brands/{brand_id}`

**Chức năng:** Cập nhật thông tin thương hiệu.

**Request Body:**
```json
{
  "brand_name": "Cannondale USA"
}
```

**Response 200:**
```json
{
  "brand_id": 10,
  "brand_name": "Cannondale USA"
}
```

---

### 2.5. Xóa thương hiệu

**Endpoint:** `DELETE /api/v1/brands/{brand_id}`

**Chức năng:** Xóa thương hiệu (chỉ khi không có sản phẩm nào liên kết).

**Response 204:** No Content

**Response 409:**
```json
{
  "detail": "Cannot delete brand with existing products"
}
```

---

## 3. Categories (Danh mục)

### 3.1. Lấy danh sách danh mục

**Endpoint:** `GET /api/v1/categories`

**Chức năng:** Lấy danh sách tất cả danh mục sản phẩm.

**Query Parameters:**
```
- skip: int (default: 0)
- limit: int (default: 100)
```

**Response 200:**
```json
{
  "total": 7,
  "data": [
    {
      "category_id": 1,
      "category_name": "Children Bicycles"
    },
    {
      "category_id": 2,
      "category_name": "Comfort Bicycles"
    }
  ]
}
```

---

### 3.2. Lấy thông tin danh mục

**Endpoint:** `GET /api/v1/categories/{category_id}`

**Chức năng:** Lấy thông tin chi tiết danh mục.

**Response 200:**
```json
{
  "category_id": 6,
  "category_name": "Mountain Bikes",
  "total_products": 65
}
```

---

### 3.3. Tạo danh mục mới

**Endpoint:** `POST /api/v1/categories`

**Request Body:**
```json
{
  "category_name": "Electric Bikes"
}
```

**Response 201:**
```json
{
  "category_id": 8,
  "category_name": "Electric Bikes"
}
```

---

### 3.4. Cập nhật danh mục

**Endpoint:** `PUT /api/v1/categories/{category_id}`

**Request Body:**
```json
{
  "category_name": "E-Bikes"
}
```

**Response 200:**
```json
{
  "category_id": 8,
  "category_name": "E-Bikes"
}
```

---

### 3.5. Xóa danh mục

**Endpoint:** `DELETE /api/v1/categories/{category_id}`

**Response 204:** No Content

---

## 4. Customers (Khách hàng)

### 4.1. Lấy danh sách khách hàng

**Endpoint:** `GET /api/v1/customers`

**Chức năng:** Lấy danh sách khách hàng với tìm kiếm và phân trang.

**Query Parameters:**
```
- skip: int (default: 0)
- limit: int (default: 100)
- search: string (optional) - Tìm theo tên, email, phone
- city: string (optional) - Lọc theo thành phố
- state: string (optional) - Lọc theo bang/tỉnh
```

**Response 200:**
```json
{
  "total": 1445,
  "skip": 0,
  "limit": 100,
  "data": [
    {
      "customer_id": 1,
      "first_name": "Debra",
      "last_name": "Burks",
      "phone": "(916) 381-6003",
      "email": "debra.burks@yahoo.com",
      "street": "9273 Thorne Ave.",
      "city": "Orchard Park",
      "state": "NY",
      "zip_code": "14127"
    }
  ]
}
```

---

### 4.2. Lấy thông tin khách hàng

**Endpoint:** `GET /api/v1/customers/{customer_id}`

**Chức năng:** Lấy thông tin chi tiết khách hàng bao gồm lịch sử đơn hàng.

**Response 200:**
```json
{
  "customer_id": 1,
  "first_name": "Debra",
  "last_name": "Burks",
  "phone": "(916) 381-6003",
  "email": "debra.burks@yahoo.com",
  "street": "9273 Thorne Ave.",
  "city": "Orchard Park",
  "state": "NY",
  "zip_code": "14127",
  "total_orders": 3,
  "total_spent": 2547.88
}
```

---

### 4.3. Tạo khách hàng mới

**Endpoint:** `POST /api/v1/customers`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "(555) 123-4567",
  "email": "john.doe@example.com",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001"
}
```

**Response 201:**
```json
{
  "customer_id": 1446,
  "first_name": "John",
  "last_name": "Doe",
  "phone": "(555) 123-4567",
  "email": "john.doe@example.com",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001"
}
```

---

### 4.4. Cập nhật thông tin khách hàng

**Endpoint:** `PUT /api/v1/customers/{customer_id}`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "(555) 999-8888",
  "email": "john.doe@example.com",
  "street": "456 Park Ave",
  "city": "New York",
  "state": "NY",
  "zip_code": "10002"
}
```

**Response 200:**
```json
{
  "customer_id": 1446,
  "first_name": "John",
  "last_name": "Doe",
  "phone": "(555) 999-8888",
  "email": "john.doe@example.com",
  "street": "456 Park Ave",
  "city": "New York",
  "state": "NY",
  "zip_code": "10002"
}
```

---

### 4.5. Xóa khách hàng

**Endpoint:** `DELETE /api/v1/customers/{customer_id}`

**Chức năng:** Xóa khách hàng (soft delete hoặc hard delete tùy business logic).

**Response 204:** No Content

---

## 5. Orders (Đơn hàng)

### 5.1. Lấy danh sách đơn hàng

**Endpoint:** `GET /api/v1/orders`

**Chức năng:** Lấy danh sách đơn hàng với bộ lọc.

**Query Parameters:**
```
- skip: int (default: 0)
- limit: int (default: 100)
- customer_id: int (optional) - Lọc theo khách hàng
- store_id: int (optional) - Lọc theo cửa hàng
- staff_id: int (optional) - Lọc theo nhân viên
- order_status: int (optional) - Lọc theo trạng thái (1=Pending, 2=Processing, 3=Rejected, 4=Completed)
- from_date: date (optional) - Từ ngày (YYYY-MM-DD)
- to_date: date (optional) - Đến ngày (YYYY-MM-DD)
```

**Response 200:**
```json
{
  "total": 1615,
  "skip": 0,
  "limit": 100,
  "data": [
    {
      "order_id": 1,
      "customer_id": 259,
      "order_status": 4,
      "order_date": "2016-01-01",
      "required_date": "2016-01-03",
      "shipped_date": "2016-01-03",
      "store_id": 1,
      "staff_id": 2,
      "total_amount": 1579.98
    }
  ]
}
```

---

### 5.2. Lấy chi tiết đơn hàng

**Endpoint:** `GET /api/v1/orders/{order_id}`

**Chức năng:** Lấy thông tin chi tiết đơn hàng bao gồm các sản phẩm.

**Response 200:**
```json
{
  "order_id": 1,
  "customer_id": 259,
  "customer_name": "Debra Burks",
  "order_status": 4,
  "order_status_text": "Completed",
  "order_date": "2016-01-01",
  "required_date": "2016-01-03",
  "shipped_date": "2016-01-03",
  "store_id": 1,
  "store_name": "Santa Cruz Bikes",
  "staff_id": 2,
  "staff_name": "Mireya Copeland",
  "items": [
    {
      "item_id": 1,
      "product_id": 20,
      "product_name": "Surly Wednesday Frameset - 2016",
      "quantity": 1,
      "list_price": 999.99,
      "discount": 0.07
    }
  ],
  "subtotal": 999.99,
  "total_discount": 69.99,
  "total_amount": 930.00
}
```

---

### 5.3. Tạo đơn hàng mới

**Endpoint:** `POST /api/v1/orders`

**Chức năng:** Tạo đơn hàng mới với các sản phẩm.

**Request Body:**
```json
{
  "customer_id": 1,
  "order_status": 1,
  "order_date": "2023-11-13",
  "required_date": "2023-11-16",
  "store_id": 1,
  "staff_id": 2,
  "items": [
    {
      "product_id": 5,
      "quantity": 2,
      "list_price": 299.99,
      "discount": 0.1
    },
    {
      "product_id": 10,
      "quantity": 1,
      "list_price": 499.99,
      "discount": 0
    }
  ]
}
```

**Response 201:**
```json
{
  "order_id": 1616,
  "customer_id": 1,
  "order_status": 1,
  "order_date": "2023-11-13",
  "required_date": "2023-11-16",
  "shipped_date": null,
  "store_id": 1,
  "staff_id": 2,
  "total_amount": 1039.97,
  "items": [
    {
      "item_id": 1,
      "product_id": 5,
      "quantity": 2,
      "list_price": 299.99,
      "discount": 0.1
    },
    {
      "item_id": 2,
      "product_id": 10,
      "quantity": 1,
      "list_price": 499.99,
      "discount": 0
    }
  ]
}
```

---

### 5.4. Cập nhật trạng thái đơn hàng

**Endpoint:** `PATCH /api/v1/orders/{order_id}/status`

**Chức năng:** Cập nhật trạng thái đơn hàng.

**Request Body:**
```json
{
  "order_status": 2,
  "shipped_date": "2023-11-14"
}
```

**Response 200:**
```json
{
  "order_id": 1616,
  "order_status": 2,
  "order_status_text": "Processing",
  "shipped_date": "2023-11-14"
}
```

---

### 5.5. Hủy đơn hàng

**Endpoint:** `DELETE /api/v1/orders/{order_id}`

**Chức năng:** Hủy đơn hàng (chỉ cho phép nếu chưa shipped).

**Response 204:** No Content

**Response 400:**
```json
{
  "detail": "Cannot cancel shipped order"
}
```

---

## 6. Order Items (Chi tiết đơn hàng)

### 6.1. Lấy danh sách items của đơn hàng

**Endpoint:** `GET /api/v1/orders/{order_id}/items`

**Chức năng:** Lấy danh sách tất cả sản phẩm trong đơn hàng.

**Response 200:**
```json
{
  "order_id": 1,
  "items": [
    {
      "item_id": 1,
      "product_id": 20,
      "product_name": "Surly Wednesday Frameset - 2016",
      "quantity": 1,
      "list_price": 999.99,
      "discount": 0.07,
      "final_price": 929.99
    }
  ]
}
```

---

### 6.2. Thêm sản phẩm vào đơn hàng

**Endpoint:** `POST /api/v1/orders/{order_id}/items`

**Chức năng:** Thêm sản phẩm mới vào đơn hàng đang xử lý.

**Request Body:**
```json
{
  "product_id": 15,
  "quantity": 2,
  "list_price": 799.99,
  "discount": 0.05
}
```

**Response 201:**
```json
{
  "order_id": 1,
  "item_id": 4,
  "product_id": 15,
  "quantity": 2,
  "list_price": 799.99,
  "discount": 0.05
}
```

---

### 6.3. Cập nhật item trong đơn hàng

**Endpoint:** `PUT /api/v1/orders/{order_id}/items/{item_id}`

**Request Body:**
```json
{
  "quantity": 3,
  "discount": 0.1
}
```

**Response 200:**
```json
{
  "order_id": 1,
  "item_id": 4,
  "product_id": 15,
  "quantity": 3,
  "list_price": 799.99,
  "discount": 0.1
}
```

---

### 6.4. Xóa item khỏi đơn hàng

**Endpoint:** `DELETE /api/v1/orders/{order_id}/items/{item_id}`

**Response 204:** No Content

---

## 7. Stores (Cửa hàng)

### 7.1. Lấy danh sách cửa hàng

**Endpoint:** `GET /api/v1/stores`

**Chức năng:** Lấy danh sách tất cả cửa hàng.

**Response 200:**
```json
{
  "total": 3,
  "data": [
    {
      "store_id": 1,
      "store_name": "Santa Cruz Bikes",
      "phone": "(831) 476-4321",
      "email": "santacruz@bikes.shop",
      "street": "3700 Portola Drive",
      "city": "Santa Cruz",
      "state": "CA",
      "zip_code": "95062"
    }
  ]
}
```

---

### 7.2. Lấy thông tin cửa hàng

**Endpoint:** `GET /api/v1/stores/{store_id}`

**Response 200:**
```json
{
  "store_id": 1,
  "store_name": "Santa Cruz Bikes",
  "phone": "(831) 476-4321",
  "email": "santacruz@bikes.shop",
  "street": "3700 Portola Drive",
  "city": "Santa Cruz",
  "state": "CA",
  "zip_code": "95062",
  "total_staff": 4,
  "total_orders": 618,
  "total_products_in_stock": 310
}
```

---

### 7.3. Tạo cửa hàng mới

**Endpoint:** `POST /api/v1/stores`

**Request Body:**
```json
{
  "store_name": "San Francisco Bikes",
  "phone": "(415) 555-1234",
  "email": "sanfrancisco@bikes.shop",
  "street": "100 Market St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102"
}
```

**Response 201:**
```json
{
  "store_id": 4,
  "store_name": "San Francisco Bikes",
  "phone": "(415) 555-1234",
  "email": "sanfrancisco@bikes.shop",
  "street": "100 Market St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102"
}
```

---

### 7.4. Cập nhật cửa hàng

**Endpoint:** `PUT /api/v1/stores/{store_id}`

**Request Body:** (same as create)

**Response 200:** (same structure)

---

### 7.5. Xóa cửa hàng

**Endpoint:** `DELETE /api/v1/stores/{store_id}`

**Response 204:** No Content

---

## 8. Staffs (Nhân viên)

### 8.1. Lấy danh sách nhân viên

**Endpoint:** `GET /api/v1/staffs`

**Chức năng:** Lấy danh sách nhân viên.

**Query Parameters:**
```
- skip: int (default: 0)
- limit: int (default: 100)
- store_id: int (optional) - Lọc theo cửa hàng
- active: boolean (optional) - Lọc theo trạng thái hoạt động
- manager_id: int (optional) - Lọc theo quản lý
```

**Response 200:**
```json
{
  "total": 10,
  "data": [
    {
      "staff_id": 1,
      "first_name": "Fabiola",
      "last_name": "Jackson",
      "email": "fabiola.jackson@bikes.shop",
      "phone": "(831) 555-5554",
      "active": true,
      "store_id": 1,
      "manager_id": null
    }
  ]
}
```

---

### 8.2. Lấy thông tin nhân viên

**Endpoint:** `GET /api/v1/staffs/{staff_id}`

**Response 200:**
```json
{
  "staff_id": 2,
  "first_name": "Mireya",
  "last_name": "Copeland",
  "email": "mireya.copeland@bikes.shop",
  "phone": "(831) 555-5555",
  "active": true,
  "store_id": 1,
  "store_name": "Santa Cruz Bikes",
  "manager_id": 1,
  "manager_name": "Fabiola Jackson",
  "total_orders_handled": 165
}
```

---

### 8.3. Tạo nhân viên mới

**Endpoint:** `POST /api/v1/staffs`

**Request Body:**
```json
{
  "first_name": "Alice",
  "last_name": "Smith",
  "email": "alice.smith@bikes.shop",
  "phone": "(555) 123-4567",
  "active": true,
  "store_id": 1,
  "manager_id": 1
}
```

**Response 201:**
```json
{
  "staff_id": 11,
  "first_name": "Alice",
  "last_name": "Smith",
  "email": "alice.smith@bikes.shop",
  "phone": "(555) 123-4567",
  "active": true,
  "store_id": 1,
  "manager_id": 1
}
```

---

### 8.4. Cập nhật nhân viên

**Endpoint:** `PUT /api/v1/staffs/{staff_id}`

**Request Body:** (same as create)

**Response 200:** (same structure)

---

### 8.5. Vô hiệu hóa nhân viên

**Endpoint:** `PATCH /api/v1/staffs/{staff_id}/deactivate`

**Chức năng:** Đặt trạng thái active = false.

**Response 200:**
```json
{
  "staff_id": 11,
  "active": false
}
```

---

### 8.6. Xóa nhân viên

**Endpoint:** `DELETE /api/v1/staffs/{staff_id}`

**Response 204:** No Content

---

## 9. Stocks (Tồn kho)

### 9.1. Lấy danh sách tồn kho

**Endpoint:** `GET /api/v1/stocks`

**Chức năng:** Lấy thông tin tồn kho của tất cả sản phẩm ở các cửa hàng.

**Query Parameters:**
```
- skip: int (default: 0)
- limit: int (default: 100)
- store_id: int (optional) - Lọc theo cửa hàng
- product_id: int (optional) - Lọc theo sản phẩm
- low_stock: boolean (optional) - Chỉ hiện sản phẩm sắp hết (quantity < 5)
```

**Response 200:**
```json
{
  "total": 939,
  "data": [
    {
      "store_id": 1,
      "store_name": "Santa Cruz Bikes",
      "product_id": 1,
      "product_name": "Trek 820 - 2016",
      "quantity": 27
    }
  ]
}
```

---

### 9.2. Lấy tồn kho theo cửa hàng

**Endpoint:** `GET /api/v1/stores/{store_id}/stocks`

**Chức năng:** Lấy tồn kho của một cửa hàng cụ thể.

**Response 200:**
```json
{
  "store_id": 1,
  "store_name": "Santa Cruz Bikes",
  "total_products": 313,
  "stocks": [
    {
      "product_id": 1,
      "product_name": "Trek 820 - 2016",
      "quantity": 27
    }
  ]
}
```

---

### 9.3. Lấy tồn kho theo sản phẩm

**Endpoint:** `GET /api/v1/products/{product_id}/stocks`

**Chức năng:** Xem sản phẩm có sẵn ở cửa hàng nào.

**Response 200:**
```json
{
  "product_id": 1,
  "product_name": "Trek 820 - 2016",
  "total_quantity": 27,
  "stores": [
    {
      "store_id": 1,
      "store_name": "Santa Cruz Bikes",
      "quantity": 27
    },
    {
      "store_id": 2,
      "store_name": "Baldwin Bikes",
      "quantity": 0
    }
  ]
}
```

---

### 9.4. Cập nhật tồn kho

**Endpoint:** `PUT /api/v1/stocks`

**Chức năng:** Cập nhật số lượng tồn kho.

**Request Body:**
```json
{
  "store_id": 1,
  "product_id": 1,
  "quantity": 30
}
```

**Response 200:**
```json
{
  "store_id": 1,
  "product_id": 1,
  "quantity": 30
}
```

---

### 9.5. Điều chỉnh tồn kho (nhập/xuất)

**Endpoint:** `PATCH /api/v1/stocks/adjust`

**Chức năng:** Tăng hoặc giảm tồn kho.

**Request Body:**
```json
{
  "store_id": 1,
  "product_id": 1,
  "adjustment": -5,
  "reason": "Sold"
}
```

**Response 200:**
```json
{
  "store_id": 1,
  "product_id": 1,
  "old_quantity": 30,
  "adjustment": -5,
  "new_quantity": 25
}
```

---

## 10. Statistics & Reports (Thống kê & Báo cáo)

### 10.1. Thống kê tổng quan

**Endpoint:** `GET /api/v1/statistics/overview`

**Chức năng:** Lấy thống kê tổng quan hệ thống.

**Query Parameters:**
```
- from_date: date (optional)
- to_date: date (optional)
```

**Response 200:**
```json
{
  "total_customers": 1445,
  "total_products": 313,
  "total_orders": 1615,
  "total_revenue": 7156137.24,
  "total_stores": 3,
  "total_staff": 10,
  "pending_orders": 12,
  "low_stock_products": 45
}
```

---

### 10.2. Doanh thu theo thời gian

**Endpoint:** `GET /api/v1/statistics/revenue`

**Chức năng:** Thống kê doanh thu theo ngày/tháng/năm.

**Query Parameters:**
```
- from_date: date (required)
- to_date: date (required)
- group_by: string (day|month|year) - default: day
- store_id: int (optional)
```

**Response 200:**
```json
{
  "from_date": "2016-01-01",
  "to_date": "2016-12-31",
  "group_by": "month",
  "data": [
    {
      "period": "2016-01",
      "total_orders": 145,
      "total_revenue": 234567.89
    },
    {
      "period": "2016-02",
      "total_orders": 132,
      "total_revenue": 198234.56
    }
  ]
}
```

---

### 10.3. Top sản phẩm bán chạy

**Endpoint:** `GET /api/v1/statistics/top-products`

**Chức năng:** Lấy danh sách sản phẩm bán chạy nhất.

**Query Parameters:**
```
- limit: int (default: 10)
- from_date: date (optional)
- to_date: date (optional)
- store_id: int (optional)
```

**Response 200:**
```json
{
  "limit": 10,
  "data": [
    {
      "product_id": 20,
      "product_name": "Surly Wednesday Frameset - 2016",
      "total_quantity_sold": 145,
      "total_revenue": 144998.55
    }
  ]
}
```

---

### 10.4. Top khách hàng

**Endpoint:** `GET /api/v1/statistics/top-customers`

**Chức năng:** Lấy danh sách khách hàng mua nhiều nhất.

**Query Parameters:**
```
- limit: int (default: 10)
- from_date: date (optional)
- to_date: date (optional)
```

**Response 200:**
```json
{
  "limit": 10,
  "data": [
    {
      "customer_id": 259,
      "customer_name": "Debra Burks",
      "total_orders": 8,
      "total_spent": 15678.90
    }
  ]
}
```

---

### 10.5. Hiệu suất nhân viên

**Endpoint:** `GET /api/v1/statistics/staff-performance`

**Chức năng:** Thống kê hiệu suất bán hàng của nhân viên.

**Query Parameters:**
```
- from_date: date (optional)
- to_date: date (optional)
- store_id: int (optional)
```

**Response 200:**
```json
{
  "data": [
    {
      "staff_id": 2,
      "staff_name": "Mireya Copeland",
      "store_name": "Santa Cruz Bikes",
      "total_orders": 165,
      "total_revenue": 876543.21
    }
  ]
}
```

---

### 10.6. Báo cáo tồn kho thấp

**Endpoint:** `GET /api/v1/statistics/low-stock-alert`

**Chức năng:** Danh sách sản phẩm sắp hết hàng (quantity < threshold).

**Query Parameters:**
```
- threshold: int (default: 5)
- store_id: int (optional)
```

**Response 200:**
```json
{
  "threshold": 5,
  "total_items": 45,
  "data": [
    {
      "store_id": 1,
      "store_name": "Santa Cruz Bikes",
      "product_id": 149,
      "product_name": "Trek Fuel EX 8 29 - 2016",
      "quantity": 1
    }
  ]
}
```

---

## Codes & Error Responses

### HTTP Status Codes

- `200 OK` - Request thành công
- `201 Created` - Tạo mới thành công
- `204 No Content` - Xóa thành công
- `400 Bad Request` - Dữ liệu không hợp lệ
- `401 Unauthorized` - Chưa xác thực
- `403 Forbidden` - Không có quyền truy cập
- `404 Not Found` - Không tìm thấy resource
- `409 Conflict` - Xung đột dữ liệu (ví dụ: email đã tồn tại)
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Lỗi server

### Error Response Format

```json
{
  "detail": "Error message description",
  "error_code": "ERROR_CODE",
  "timestamp": "2023-11-13T10:30:00Z"
}
```

---

## Authentication & Authorization (Mở rộng)

Hiện tại API chưa implement authentication. Trong tương lai có thể thêm:

- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Thông tin user hiện tại

Header cần thiết cho authenticated requests:
```
Authorization: Bearer <access_token>
```

---

## Rate Limiting

- Default: 100 requests/minute/IP
- Burst: 20 requests/second

---

## Versioning

API sử dụng URL versioning: `/api/v1/...`

Khi có breaking changes, sẽ tăng version lên `/api/v2/...`

---

## Notes

1. **Phân trang:** Tất cả các endpoint trả về danh sách đều hỗ trợ `skip` và `limit`
2. **Tìm kiếm:** Sử dụng query parameter `search` cho text search
3. **Lọc:** Các endpoint list hỗ trợ filter theo các trường liên quan
4. **Sắp xếp:** Có thể thêm `sort_by` và `order` (asc/desc) trong query params
5. **Date format:** Sử dụng ISO 8601 format: `YYYY-MM-DD` hoặc `YYYY-MM-DDTHH:MM:SSZ`
6. **Decimal:** Price và discount sử dụng float/decimal với 2 chữ số thập phân

---

## Liên hệ & Hỗ trợ

- **API Documentation (Swagger):** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **GitHub:** [Repository Link]
- **Email:** support@bikestoreshop.com

---

**Last Updated:** 2023-11-13
**Version:** 1.0.0
