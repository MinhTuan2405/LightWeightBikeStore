from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from core.database import get_db
from models.order import Order
from models.order_item import OrderItem
from models.customer import Customer
from models.staff import Staff
from models.product import Product
from schemas.order import (
    OrderCreate, OrderUpdate, OrderResponse, OrderWithItemsResponse,
    OrderItemCreate, OrderItemUpdate, OrderItemResponse
)
from middleware.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/orders", tags=["Orders"])

# ==================== ORDERS ====================

@router.get("", response_model=List[OrderResponse])
def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    customer_id: Optional[int] = None,
    staff_id: Optional[int] = None,
    order_status: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Lấy danh sách orders"""
    query = db.query(Order)
    
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    if staff_id:
        query = query.filter(Order.staff_id == staff_id)
    if order_status:
        query = query.filter(Order.order_status == order_status)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{order_id}", response_model=OrderWithItemsResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Lấy chi tiết order theo ID (kèm items)"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    
    return OrderWithItemsResponse(
        order_id=order.order_id,
        customer_id=order.customer_id,
        order_status=order.order_status,
        order_date=order.order_date,
        required_date=order.required_date,
        shipped_date=order.shipped_date,
        staff_id=order.staff_id,
        items=items
    )

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    request: OrderCreate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Tạo order mới"""
    # Kiểm tra customer tồn tại (nếu có)
    if request.customer_id:
        customer = db.query(Customer).filter(Customer.customer_id == request.customer_id).first()
        if not customer:
            raise HTTPException(status_code=400, detail="Customer not found")
    
    # Kiểm tra staff tồn tại
    staff = db.query(Staff).filter(Staff.staff_id == request.staff_id).first()
    if not staff:
        raise HTTPException(status_code=400, detail="Staff not found")
    
    # Tạo order
    order_data = request.model_dump(exclude={"items"})
    order = Order(**order_data)
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Tạo order items (nếu có)
    if request.items:
        for idx, item_data in enumerate(request.items, start=1):
            # Kiểm tra product tồn tại
            product = db.query(Product).filter(Product.product_id == item_data.product_id).first()
            if not product:
                raise HTTPException(status_code=400, detail=f"Product {item_data.product_id} not found")
            
            order_item = OrderItem(
                order_id=order.order_id,
                item_id=idx,
                **item_data.model_dump()
            )
            db.add(order_item)
        db.commit()
    
    return order

@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    request: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Cập nhật order"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order, key, value)
    
    db.commit()
    db.refresh(order)
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Xóa order (Admin only)"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Xóa order items trước
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    db.delete(order)
    db.commit()
    return None

# ==================== ORDER ITEMS ====================

@router.get("/{order_id}/items", response_model=List[OrderItemResponse])
def get_order_items(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Lấy danh sách items của order"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

@router.post("/{order_id}/items", response_model=OrderItemResponse, status_code=status.HTTP_201_CREATED)
def add_order_item(
    order_id: int,
    request: OrderItemCreate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Thêm item vào order"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Kiểm tra product tồn tại
    product = db.query(Product).filter(Product.product_id == request.product_id).first()
    if not product:
        raise HTTPException(status_code=400, detail="Product not found")
    
    # Lấy item_id tiếp theo
    max_item = db.query(OrderItem).filter(OrderItem.order_id == order_id).order_by(OrderItem.item_id.desc()).first()
    next_item_id = (max_item.item_id + 1) if max_item else 1
    
    order_item = OrderItem(
        order_id=order_id,
        item_id=next_item_id,
        **request.model_dump()
    )
    db.add(order_item)
    db.commit()
    db.refresh(order_item)
    return order_item

@router.put("/{order_id}/items/{item_id}", response_model=OrderItemResponse)
def update_order_item(
    order_id: int,
    item_id: int,
    request: OrderItemUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Cập nhật item trong order"""
    order_item = db.query(OrderItem).filter(
        OrderItem.order_id == order_id,
        OrderItem.item_id == item_id
    ).first()
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order_item, key, value)
    
    db.commit()
    db.refresh(order_item)
    return order_item

@router.delete("/{order_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order_item(
    order_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(get_current_user)
):
    """Xóa item khỏi order"""
    order_item = db.query(OrderItem).filter(
        OrderItem.order_id == order_id,
        OrderItem.item_id == item_id
    ).first()
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    
    db.delete(order_item)
    db.commit()
    return None
