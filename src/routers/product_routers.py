from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from core.database import get_db
from models.product import Product
from models.brand import Brand
from models.category import Category
from schemas.product import ProductCreate, ProductUpdate, ProductResponse
from middleware.auth import get_current_user, require_admin
from models.staff import Staff

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    brand_id: Optional[int] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Lấy danh sách sản phẩm (có filter và pagination)"""
    query = db.query(Product)
    
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết sản phẩm theo ID"""
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    request: ProductCreate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Tạo sản phẩm mới (Admin only)"""
    # Kiểm tra brand tồn tại
    brand = db.query(Brand).filter(Brand.brand_id == request.brand_id).first()
    if not brand:
        raise HTTPException(status_code=400, detail="Brand not found")
    
    # Kiểm tra category tồn tại
    category = db.query(Category).filter(Category.category_id == request.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    
    product = Product(**request.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    request: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Cập nhật sản phẩm (Admin only)"""
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Xóa sản phẩm (Admin only)"""
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None
