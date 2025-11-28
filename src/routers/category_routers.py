from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.category import Category
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from middleware.auth import get_current_user, require_admin
from models.staff import Staff

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Lấy danh sách categories"""
    return db.query(Category).offset(skip).limit(limit).all()

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết category theo ID"""
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    request: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Tạo category mới (Admin only)"""
    category = Category(**request.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    request: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Cập nhật category (Admin only)"""
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Xóa category (Admin only)"""
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return None
