from sqlalchemy import Column, Integer, String
from core.database import Base

class Store(Base):
    __tablename__ = "stores"

    store_id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String(255), nullable=False)
    phone = Column(String(25))
    email = Column(String(255))
    street = Column(String(255))
    city = Column(String(255))
    state = Column(String(10))
    zip_code = Column(String(5))
