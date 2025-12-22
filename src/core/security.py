from datetime import datetime, timedelta  # datetime: để tính thời gian hết hạn của Token
from typing import Optional
from jose import JWTError, jwt            # jose: Thư viện xử lý JWT (JSON Web Token)
import bcrypt                             # bcrypt: Mã hóa mật khẩu an toàn, không thể giải mã ngược
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-minimum-32-characters-long-please-change-this")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


# Hàm 1: Mã hóa mật khẩu khi đăng ký
def hash_password(password: str) -> str:
    """Mã hóa password bằng bcrypt (thêm muối tự động)"""
    password_bytes = password.encode('utf-8')       # Chuyển chuỗi sang bytes
    salt = bcrypt.gensalt()                         # Tạo muối ngẫu nhiên
    hashed = bcrypt.hashpw(password_bytes, salt)    # Băm mật khẩu với muối
    return hashed.decode('utf-8')                   # Trả về chuỗi hashed

# Hàm 2: Kiểm tra mật khẩu khi đăng nhập
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh password gốc với password đã hash (an toàn)"""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)  # bcrypt tự xử lý so khớp

# Hàm 3: Tạo thẻ ra vào (JWT Access Token)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Tạo JWT access token từ dữ liệu (ví dụ: username, role)"""
    to_encode = data.copy()  # Dữ liệu đưa vào token

    # Tính thời gian hết hạn cho token
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})               # Thêm thời hạn vào payload
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # Ký token bằng SECRET_KEY
    return encoded_jwt

# Hàm 4: Giải mã và kiểm tra token
def decode_access_token(token: str) -> Optional[dict]:
    """Giải mã JWT token để lấy payload; trả None nếu hết hạn/không hợp lệ"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # Xác thực chữ ký + hạn dùng
        return payload
    except JWTError:
        return None  # Token giả hoặc đã hết hạn