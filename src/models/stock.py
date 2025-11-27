from sqlalchemy import Column, Integer, ForeignKey
from core.database import Base

class Stock(Base):
    __tablename__ = "stocks"

    product_id = Column(Integer, ForeignKey("products.product_id"), primary_key=True)
    quantity = Column(Integer)
