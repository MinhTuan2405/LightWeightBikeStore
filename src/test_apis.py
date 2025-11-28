"""
Script test nhanh tất cả APIs
Chạy: python test_apis.py
Yêu cầu: pip install requests
"""
import requests

BASE_URL = "http://127.0.0.1:8000"
TOKEN = None

def print_result(name, response):
    status = "✅" if response.status_code < 400 else "❌"
    print(f"{status} {name}: {response.status_code}")
    if response.status_code >= 400:
        print(f"   Error: {response.text[:100]}")

def test_all():
    global TOKEN
    
    print("\n" + "="*50)
    print("🚀 BẮT ĐẦU TEST APIs")
    print("="*50)
    
    # ==================== AUTH ====================
    print("\n📦 AUTH APIs")
    
    # Register
    r = requests.post(f"{BASE_URL}/api/auth/register", json={
        "username": "testuser123",
        "email": "testuser123@test.com",
        "password": "Test@123456",
        "first_name": "Test",
        "last_name": "User",
        "phone": "0123456789",
        "role": "ADMIN"
    })
    print_result("POST /api/auth/register", r)
    
    # Login
    r = requests.post(f"{BASE_URL}/api/auth/login", json={
        "username": "testuser123",
        "password": "Test@123456"
    })
    print_result("POST /api/auth/login", r)
    if r.status_code == 200:
        TOKEN = r.json().get("access_token")
    
    headers = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}
    
    # Me
    r = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    print_result("GET /api/auth/me", r)
    
    # ==================== BRANDS ====================
    print("\n📦 BRANDS APIs")
    
    r = requests.get(f"{BASE_URL}/api/brands")
    print_result("GET /api/brands", r)
    
    r = requests.get(f"{BASE_URL}/api/brands/1")
    print_result("GET /api/brands/1", r)
    
    r = requests.post(f"{BASE_URL}/api/brands", json={"brand_name": "Test Brand"}, headers=headers)
    print_result("POST /api/brands", r)
    brand_id = r.json().get("brand_id") if r.status_code == 201 else None
    
    if brand_id:
        r = requests.put(f"{BASE_URL}/api/brands/{brand_id}", json={"brand_name": "Updated Brand"}, headers=headers)
        print_result(f"PUT /api/brands/{brand_id}", r)
        
        r = requests.delete(f"{BASE_URL}/api/brands/{brand_id}", headers=headers)
        print_result(f"DELETE /api/brands/{brand_id}", r)
    
    # ==================== CATEGORIES ====================
    print("\n📦 CATEGORIES APIs")
    
    r = requests.get(f"{BASE_URL}/api/categories")
    print_result("GET /api/categories", r)
    
    r = requests.get(f"{BASE_URL}/api/categories/1")
    print_result("GET /api/categories/1", r)
    
    r = requests.post(f"{BASE_URL}/api/categories", json={"category_name": "Test Category"}, headers=headers)
    print_result("POST /api/categories", r)
    cat_id = r.json().get("category_id") if r.status_code == 201 else None
    
    if cat_id:
        r = requests.put(f"{BASE_URL}/api/categories/{cat_id}", json={"category_name": "Updated Category"}, headers=headers)
        print_result(f"PUT /api/categories/{cat_id}", r)
        
        r = requests.delete(f"{BASE_URL}/api/categories/{cat_id}", headers=headers)
        print_result(f"DELETE /api/categories/{cat_id}", r)
    
    # ==================== PRODUCTS ====================
    print("\n📦 PRODUCTS APIs")
    
    r = requests.get(f"{BASE_URL}/api/products")
    print_result("GET /api/products", r)
    
    r = requests.get(f"{BASE_URL}/api/products/1")
    print_result("GET /api/products/1", r)
    
    r = requests.post(f"{BASE_URL}/api/products", json={
        "product_name": "Test Bike",
        "brand_id": 1,
        "category_id": 1,
        "model_year": 2024,
        "list_price": 999.99,
        "stock": 10
    }, headers=headers)
    print_result("POST /api/products", r)
    prod_id = r.json().get("product_id") if r.status_code == 201 else None
    
    if prod_id:
        r = requests.put(f"{BASE_URL}/api/products/{prod_id}", json={"product_name": "Updated Bike"}, headers=headers)
        print_result(f"PUT /api/products/{prod_id}", r)
        
        r = requests.delete(f"{BASE_URL}/api/products/{prod_id}", headers=headers)
        print_result(f"DELETE /api/products/{prod_id}", r)
    
    # ==================== CUSTOMERS ====================
    print("\n📦 CUSTOMERS APIs")
    
    r = requests.get(f"{BASE_URL}/api/customers", headers=headers)
    print_result("GET /api/customers", r)
    
    r = requests.get(f"{BASE_URL}/api/customers/1", headers=headers)
    print_result("GET /api/customers/1", r)
    
    r = requests.post(f"{BASE_URL}/api/customers", json={
        "first_name": "Test",
        "last_name": "Customer",
        "email": "testcustomer123@test.com",
        "phone": "0987654321"
    }, headers=headers)
    print_result("POST /api/customers", r)
    cust_id = r.json().get("customer_id") if r.status_code == 201 else None
    
    if cust_id:
        r = requests.put(f"{BASE_URL}/api/customers/{cust_id}", json={"first_name": "Updated"}, headers=headers)
        print_result(f"PUT /api/customers/{cust_id}", r)
        
        r = requests.delete(f"{BASE_URL}/api/customers/{cust_id}", headers=headers)
        print_result(f"DELETE /api/customers/{cust_id}", r)
    
    # ==================== ORDERS ====================
    print("\n📦 ORDERS APIs")
    
    r = requests.get(f"{BASE_URL}/api/orders", headers=headers)
    print_result("GET /api/orders", r)
    
    r = requests.get(f"{BASE_URL}/api/orders/1", headers=headers)
    print_result("GET /api/orders/1", r)
    
    r = requests.post(f"{BASE_URL}/api/orders", json={
        "customer_id": 1,
        "order_status": 1,
        "order_date": "2024-01-01",
        "required_date": "2024-01-10",
        "staff_id": 1
    }, headers=headers)
    print_result("POST /api/orders", r)
    order_id = r.json().get("order_id") if r.status_code == 201 else None
    
    if order_id:
        r = requests.put(f"{BASE_URL}/api/orders/{order_id}", json={"order_status": 2}, headers=headers)
        print_result(f"PUT /api/orders/{order_id}", r)
        
        # Order Items
        print("\n📦 ORDER ITEMS APIs")
        
        r = requests.get(f"{BASE_URL}/api/orders/{order_id}/items", headers=headers)
        print_result(f"GET /api/orders/{order_id}/items", r)
        
        r = requests.post(f"{BASE_URL}/api/orders/{order_id}/items", json={
            "product_id": 1,
            "quantity": 2,
            "list_price": 499.99,
            "discount": 0
        }, headers=headers)
        print_result(f"POST /api/orders/{order_id}/items", r)
        item_id = r.json().get("item_id") if r.status_code == 201 else None
        
        if item_id:
            r = requests.put(f"{BASE_URL}/api/orders/{order_id}/items/{item_id}", json={"quantity": 5}, headers=headers)
            print_result(f"PUT /api/orders/{order_id}/items/{item_id}", r)
            
            r = requests.delete(f"{BASE_URL}/api/orders/{order_id}/items/{item_id}", headers=headers)
            print_result(f"DELETE /api/orders/{order_id}/items/{item_id}", r)
        
        r = requests.delete(f"{BASE_URL}/api/orders/{order_id}", headers=headers)
        print_result(f"DELETE /api/orders/{order_id}", r)
    
    # ==================== STAFFS ====================
    print("\n📦 STAFFS APIs")
    
    r = requests.get(f"{BASE_URL}/api/staffs", headers=headers)
    print_result("GET /api/staffs", r)
    
    r = requests.get(f"{BASE_URL}/api/staffs/1", headers=headers)
    print_result("GET /api/staffs/1", r)
    
    # Cleanup - xóa test user
    print("\n🧹 CLEANUP")
    r = requests.post(f"{BASE_URL}/api/auth/login", json={
        "username": "testuser123",
        "password": "Test@123456"
    })
    if r.status_code == 200:
        # Lấy staff_id của testuser
        headers2 = {"Authorization": f"Bearer {r.json().get('access_token')}"}
        me = requests.get(f"{BASE_URL}/api/auth/me", headers=headers2)
        if me.status_code == 200:
            test_staff_id = me.json().get("staff_id")
            # Không thể tự xóa mình, bỏ qua
            print(f"⚠️  Test user (staff_id={test_staff_id}) cần xóa thủ công")
    
    print("\n" + "="*50)
    print("✅ HOÀN THÀNH TEST!")
    print("="*50)

if __name__ == "__main__":
    test_all()
