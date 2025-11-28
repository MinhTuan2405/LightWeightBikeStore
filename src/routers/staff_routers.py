from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.staff import Staff
from schemas.staff import StaffUpdate, StaffListResponse
from middleware.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/staffs", tags=["Staffs"])

@router.get("", response_model=List[StaffListResponse])
def get_staffs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Lấy danh sách staffs (Admin only)"""
    return db.query(Staff).offset(skip).limit(limit).all()

@router.get("/{staff_id}", response_model=StaffListResponse)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Lấy chi tiết staff theo ID (Admin only)"""
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    return staff

@router.put("/{staff_id}", response_model=StaffListResponse)
def update_staff(
    staff_id: int,
    request: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Cập nhật staff (Admin only)"""
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(staff, key, value)
    
    db.commit()
    db.refresh(staff)
    return staff

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Xóa staff (Admin only)"""
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Không cho phép xóa chính mình
    if staff.staff_id == current_user.staff_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(staff)
    db.commit()
    return None
