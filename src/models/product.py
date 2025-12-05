from sqlalchemy import Column, Integer, String, SmallInteger, Numeric, ForeignKey
from core.database import Base

class Product(Base):
    """Model ORM ánh xạ bảng 'products'"""
    __tablename__ = "products"

    # Khóa chính tự tăng
    product_id = Column(Integer, primary_key=True, index=True)
    # Tên sản phẩm
    product_name = Column(String(255), nullable=False)
    # Khóa ngoại: thương hiệu
    brand_id = Column(Integer, ForeignKey("brands.brand_id"), nullable=False)
    # Khóa ngoại: danh mục
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    # Năm sản xuất (2 bytes)
    model_year = Column(SmallInteger, nullable=False)
    # Giá niêm yết (VNĐ): dùng Numeric để chính xác
    list_price = Column(Numeric(10, 2), nullable=False)
    # Số lượng tồn kho
    stock = Column(Integer, default=0)  # Số lượng hàng còn trong kho
