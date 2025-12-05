from sqlalchemy import create_engine                 # Tạo kết nối Database (SQLAlchemy Engine)
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Đọc cấu hình từ file .env (tránh hard-code chuỗi kết nối)
load_dotenv()

# DATABASE_URL: Chuỗi kết nối CSDL (PostgreSQL/SQLite/SQL Server...)
DATABASE_URL = os.getenv("DATABASE_URL")

# Tạo Engine với các tham số an toàn/ổn định kết nối
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "require",       # Bật SSL nếu DB hỗ trợ (an toàn hơn)
        "connect_timeout": 10,       # Timeout nếu không kết nối được
    },
    pool_pre_ping=True,               # Kiểm tra kết nối trước khi dùng (tránh dùng connection chết)
    pool_recycle=3600,                # Tái chế connection sau 1 giờ (tránh timeout server)
    pool_size=5,                      # Số connection giữ sẵn trong pool
    max_overflow=10                   # Cho phép vượt quá pool_size khi cao điểm
)

# SessionLocal: Mỗi request dùng 1 session riêng, đóng sau khi xong
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: Cha của tất cả model ORM (class Product, Customer...) sẽ kế thừa từ Base
Base = declarative_base()

def get_db():
    """Dependency FastAPI: cấp một session DB cho mỗi request"""
    db = SessionLocal()
    try:
        yield db  # Trả session cho router/service dùng
    finally:
        db.close()  # Đảm bảo đóng session, tránh rò rỉ kết nối
        