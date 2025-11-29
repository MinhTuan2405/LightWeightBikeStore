# API List - LightWeight Bike Store

## Database Supabase hiện tại:

| Table           | Columns                                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **brands**      | brand_id, brand_name                                                                                                                  |
| **categories**  | category_id, category_name                                                                                                            |
| **products**    | product_id, product_name, brand_id, category_id, model_year, list_price, stock                                                        |
| **customers**   | customer_id, first_name, last_name, phone, email, street, city, state, zip_code                                                       |
| **staffs**      | staff_id, first_name, last_name, email, phone, active, manager_id, username, hashed_password, role, is_active, created_at, updated_at |
| **orders**      | order_id, customer_id, order_status, order_date, required_date, shipped_date, staff_id                                                |
| **order_items** | order_id, item_id, product_id, quantity, list_price, discount                                                                         |

---

## Danh sách API cần tạo:

### 1. Authentication (✅ Đã có)

| Method | Endpoint             | Mô tả                   |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Đăng ký staff           |
| POST   | `/api/auth/login`    | Đăng nhập               |
| GET    | `/api/auth/me`       | Thông tin user hiện tại |

### 2. Products

| Method | Endpoint             | Mô tả                     |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/products`      | Lấy danh sách sản phẩm    |
| GET    | `/api/products/{id}` | Chi tiết sản phẩm         |
| POST   | `/api/products`      | Tạo sản phẩm mới (Admin)  |
| PUT    | `/api/products/{id}` | Cập nhật sản phẩm (Admin) |
| DELETE | `/api/products/{id}` | Xóa sản phẩm (Admin)      |

### 3. Brands

| Method | Endpoint           | Mô tả                  |
| ------ | ------------------ | ---------------------- |
| GET    | `/api/brands`      | Lấy danh sách brands   |
| GET    | `/api/brands/{id}` | Chi tiết brand         |
| POST   | `/api/brands`      | Tạo brand (Admin)      |
| PUT    | `/api/brands/{id}` | Cập nhật brand (Admin) |
| DELETE | `/api/brands/{id}` | Xóa brand (Admin)      |

### 4. Categories

| Method | Endpoint               | Mô tả                     |
| ------ | ---------------------- | ------------------------- |
| GET    | `/api/categories`      | Lấy danh sách categories  |
| GET    | `/api/categories/{id}` | Chi tiết category         |
| POST   | `/api/categories`      | Tạo category (Admin)      |
| PUT    | `/api/categories/{id}` | Cập nhật category (Admin) |
| DELETE | `/api/categories/{id}` | Xóa category (Admin)      |

### 5. Customers

| Method | Endpoint              | Mô tả                   |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/customers`      | Lấy danh sách customers |
| GET    | `/api/customers/{id}` | Chi tiết customer       |
| POST   | `/api/customers`      | Tạo customer            |
| PUT    | `/api/customers/{id}` | Cập nhật customer       |
| DELETE | `/api/customers/{id}` | Xóa customer (Admin)    |

### 6. Orders

| Method | Endpoint           | Mô tả                |
| ------ | ------------------ | -------------------- |
| GET    | `/api/orders`      | Lấy danh sách orders |
| GET    | `/api/orders/{id}` | Chi tiết order       |
| POST   | `/api/orders`      | Tạo order mới        |
| PUT    | `/api/orders/{id}` | Cập nhật order       |
| DELETE | `/api/orders/{id}` | Xóa order (Admin)    |

### 7. Order Items

| Method | Endpoint                                 | Mô tả               |
| ------ | ---------------------------------------- | ------------------- |
| GET    | `/api/orders/{order_id}/items`           | Lấy items của order |
| POST   | `/api/orders/{order_id}/items`           | Thêm item vào order |
| PUT    | `/api/orders/{order_id}/items/{item_id}` | Cập nhật item       |
| DELETE | `/api/orders/{order_id}/items/{item_id}` | Xóa item            |

### 8. Staffs (Admin only)

| Method | Endpoint           | Mô tả                |
| ------ | ------------------ | -------------------- |
| GET    | `/api/staffs`      | Lấy danh sách staffs |
| GET    | `/api/staffs/{id}` | Chi tiết staff       |
| PUT    | `/api/staffs/{id}` | Cập nhật staff       |
| DELETE | `/api/staffs/{id}` | Xóa staff            |

### 9. Statistics (Thống kê)

#### 9.1 Staff Statistics

| Method | Endpoint                                     | Mô tả                                |
| ------ | -------------------------------------------- | ------------------------------------ |
| GET    | `/api/statistics/staffs/count`               | Số lượng nhân viên (active/inactive) |
| GET    | `/api/statistics/staffs/sales`               | Doanh số tất cả nhân viên            |
| GET    | `/api/statistics/staffs/{id}/sales`          | Doanh số 1 nhân viên                 |
| GET    | `/api/statistics/staffs/{id}/sales/by-month` | Doanh số nhân viên theo tháng        |
| GET    | `/api/statistics/staffs/{id}/sales/by-day`   | Doanh số nhân viên theo ngày         |

#### 9.2 Store Statistics

| Method | Endpoint                                 | Mô tả               |
| ------ | ---------------------------------------- | ------------------- |
| GET    | `/api/statistics/store/overview`         | Tổng quan cửa hàng  |
| GET    | `/api/statistics/store/sales/by-day`     | Doanh số theo ngày  |
| GET    | `/api/statistics/store/sales/by-month`   | Doanh số theo tháng |
| GET    | `/api/statistics/store/sales/by-quarter` | Doanh số theo quý   |
| GET    | `/api/statistics/store/sales/by-year`    | Doanh số theo năm   |

#### 9.3 Product Statistics

| Method | Endpoint                               | Mô tả                 |
| ------ | -------------------------------------- | --------------------- |
| GET    | `/api/statistics/products/top-selling` | Top sản phẩm bán chạy |

#### 9.4 Customer Statistics

| Method | Endpoint                                   | Mô tả                         |
| ------ | ------------------------------------------ | ----------------------------- |
| GET    | `/api/statistics/customers/top-buyers`     | Top khách hàng mua nhiều nhất |
| GET    | `/api/statistics/customers/highest-orders` | Danh sách đơn hàng cao nhất   |

---

**Tổng cộng: 50 APIs**
