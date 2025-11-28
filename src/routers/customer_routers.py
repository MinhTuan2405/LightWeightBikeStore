from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from core.database import get_db
from models.customer import Customer
from schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from middleware.auth import get_current_user, require_admin
from models.staff import Staff

router = APIRouter(prefix="/api/customers", tags=["Customers"])

@router.get("", response_model=List[CustomerResponse])
def get_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    city: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Lấy danh sách customers (Yêu cầu đăng nhập)"""
    query = db.query(Customer)
    
    if city:
        query = query.filter(Customer.city == city)
    if state:
        query = query.filter(Customer.state == state)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Lấy chi tiết customer theo ID"""
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    request: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Tạo customer mới"""
    # Kiểm tra email đã tồn tại
    existing = db.query(Customer).filter(Customer.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    customer = Customer(**request.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    request: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Cập nhật customer"""
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(customer, key, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Xóa customer (Admin only)"""
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    return None
