from core.database import SessionLocal
from models.staff import Staff
from core.security import hash_password

def create_admin():
    db = SessionLocal()
    
    try:
        # Kiểm tra admin đã tồn tại
        existing_admin = db.query(Staff).filter(Staff.username == "admin").first()
        
        if existing_admin:
            print("❌ Admin user already exists!")
            print(f"   Username: {existing_admin.username}")
            print(f"   Email: {existing_admin.email}")
            return
        
        # Tạo admin mới
        admin = Staff(
            username="admin",
            email="admin@bikestore.com",
            hashed_password=hash_password("Admin@123456"),
            first_name="Super",
            last_name="Admin",
            phone="0123456789",
            role="ADMIN",
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        print("✅ Admin user created successfully!")
        print("=" * 40)
        print("   Username: admin")
        print("   Password: Admin@123456")
        print("   Role: ADMIN")
        print("=" * 40)
        print("⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
