
---

### **1. Schema: `production` (Sản phẩm)**

#### **`categories`**

* Quản lý các loại sản phẩm, ví dụ: xe đạp thể thao, xe đạp địa hình...
* Gồm:

  * `category_id`: khóa chính, tự tăng.
  * `category_name`: tên loại sản phẩm.

#### **`brands`**

* Lưu thông tin về các thương hiệu xe đạp như Giant, Trek, Specialized...
* Gồm:

  * `brand_id`: khóa chính, tự tăng.
  * `brand_name`: tên thương hiệu.

#### **`products`**

* Chứa thông tin chi tiết về sản phẩm.
* Gồm:

  * `product_id`: khóa chính.
  * `product_name`: tên sản phẩm.
  * `brand_id`: khóa ngoại đến `brands`.
  * `category_id`: khóa ngoại đến `categories`.
  * `model_year`: năm sản xuất.
  * `list_price`: giá niêm yết.

#### **`stocks`**

* Theo dõi tồn kho sản phẩm ở từng cửa hàng.
* Gồm:

  * `store_id`: khóa ngoại đến `sales.stores`.
  * `product_id`: khóa ngoại đến `products`.
  * `quantity`: số lượng còn lại.
* Khóa chính gồm `(store_id, product_id)`.

---

### **2. Schema: `sales` (Bán hàng)**

#### **`customers`**

* Lưu thông tin khách hàng.
* Gồm:

  * `customer_id`: khóa chính.
  * `first_name`, `last_name`: tên khách.
  * `phone`, `email`, `street`, `city`, `state`, `zip_code`: thông tin liên hệ.

#### **`stores`**

* Đại diện cho các chi nhánh cửa hàng.
* Gồm:

  * `store_id`: khóa chính.
  * `store_name`, `phone`, `email`, `street`, `city`, `state`, `zip_code`: thông tin cửa hàng.

#### **`staffs`**

* Lưu thông tin nhân viên.
* Gồm:

  * `staff_id`: khóa chính.
  * `first_name`, `last_name`, `email`, `phone`: thông tin cá nhân.
  * `active`: trạng thái làm việc (đang hoạt động hay không).
  * `store_id`: khóa ngoại đến `stores`.
  * `manager_id`: tự liên kết đến `staff_id` (quản lý của nhân viên đó).

#### **`orders`**

* Quản lý các đơn đặt hàng.
* Gồm:

  * `order_id`: khóa chính.
  * `customer_id`: khách hàng (khóa ngoại).
  * `order_status`: trạng thái đơn (1=Pending, 2=Processing,...).
  * `order_date`, `required_date`, `shipped_date`: các mốc thời gian liên quan.
  * `store_id`, `staff_id`: cửa hàng và nhân viên xử lý.

#### **`order_items`**

* Chi tiết từng mặt hàng trong đơn đặt hàng.
* Gồm:

  * `order_id`, `item_id`: khóa chính kết hợp.
  * `product_id`: sản phẩm.
  * `quantity`: số lượng.
  * `list_price`: giá tại thời điểm đặt hàng.
  * `discount`: chiết khấu áp dụng (mặc định là 0).

---

### **3. Quan hệ giữa các bảng (Relationships)**

* **Sản phẩm & Danh mục**: `products.category_id` → `categories.category_id`
* **Sản phẩm & Thương hiệu**: `products.brand_id` → `brands.brand_id`
* **Đơn hàng & Khách hàng / Cửa hàng / Nhân viên**: liên kết tới bảng tương ứng.
* **Nhân viên & Cửa hàng**: mỗi nhân viên thuộc về một cửa hàng.
* **Nhân viên & Quản lý**: `manager_id` là một `staff_id` khác.
* **Chi tiết đơn hàng & Sản phẩm / Đơn hàng**: thể hiện mỗi sản phẩm trong đơn hàng.
* **Tồn kho & Sản phẩm / Cửa hàng**: theo dõi số lượng sản phẩm còn lại tại mỗi cửa hàng.

---