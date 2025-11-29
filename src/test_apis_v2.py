"""
Script test nhanh tất cả APIs (Version 2 - Write to file)
Chạy: python test_apis_v2.py
Yêu cầu: pip install requests
"""
import requests
import sys

BASE_URL = "http://127.0.0.1:8000"
TOKEN = None
OUTPUT_FILE = "test_results.txt"

def log(message):
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        f.write(message + "\n")
    print(message)

def print_result(name, response):
    status = "✅" if response.status_code < 400 else "❌"
    log(f"{status} {name}: {response.status_code}")
    if response.status_code >= 400:
        log(f"   Error: {response.text[:100]}")

def test_all():
    global TOKEN
    
    # Clear file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("")

    log("\n" + "="*50)
    log("🚀 BẮT ĐẦU TEST APIs")
    log("="*50)
    
    try:
        # ==================== AUTH ====================
        log("\n📦 AUTH APIs")
        
        # Register
        try:
            r = requests.post(f"{BASE_URL}/api/auth/register", json={
                "username": "testuser_v2",
                "email": "testuser_v2@test.com",
                "password": "Test@123456",
                "first_name": "Test",
                "last_name": "User",
                "phone": "0123456788",
                "role": "ADMIN"
            }, timeout=5)
            print_result("POST /api/auth/register", r)
        except Exception as e:
            log(f"Error registering: {e}")
        
        # Login
        try:
            r = requests.post(f"{BASE_URL}/api/auth/login", json={
                "username": "testuser_v2",
                "password": "Test@123456"
            }, timeout=5)
            print_result("POST /api/auth/login", r)
            if r.status_code == 200:
                TOKEN = r.json().get("access_token")
        except Exception as e:
            log(f"Error logging in: {e}")
        
        headers = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}
        
        # Me
        try:
            r = requests.get(f"{BASE_URL}/api/auth/me", headers=headers, timeout=5)
            print_result("GET /api/auth/me", r)
        except Exception as e:
            log(f"Error getting me: {e}")
        
        # ==================== BRANDS ====================
        log("\n📦 BRANDS APIs")
        
        r = requests.get(f"{BASE_URL}/api/brands", timeout=5)
        print_result("GET /api/brands", r)
        
        # ==================== CATEGORIES ====================
        log("\n📦 CATEGORIES APIs")
        
        r = requests.get(f"{BASE_URL}/api/categories", timeout=5)
        print_result("GET /api/categories", r)
        
        # ==================== PRODUCTS ====================
        log("\n📦 PRODUCTS APIs")
        
        r = requests.get(f"{BASE_URL}/api/products", timeout=5)
        print_result("GET /api/products", r)
        
        # ==================== CUSTOMERS ====================
        log("\n📦 CUSTOMERS APIs")
        
        r = requests.get(f"{BASE_URL}/api/customers", headers=headers, timeout=5)
        print_result("GET /api/customers", r)
        
        # ==================== ORDERS ====================
        log("\n📦 ORDERS APIs")
        
        r = requests.get(f"{BASE_URL}/api/orders", headers=headers, timeout=5)
        print_result("GET /api/orders", r)
        
        # ==================== STAFFS ====================
        log("\n📦 STAFFS APIs")
        
        r = requests.get(f"{BASE_URL}/api/staffs", headers=headers, timeout=5)
        print_result("GET /api/staffs", r)
        
        # ==================== STATISTICS ====================
        log("\n📊 STATISTICS APIs")
        
        r = requests.get(f"{BASE_URL}/api/statistics/store/overview", headers=headers, timeout=5)
        print_result("GET /api/statistics/store/overview", r)
        
        log("\n" + "="*50)
        log("✅ HOÀN THÀNH TEST!")
        log("="*50)

    except Exception as e:
        log(f"FATAL ERROR: {e}")

if __name__ == "__main__":
    test_all()
