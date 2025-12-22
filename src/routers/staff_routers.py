from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.staff import Staff
from schemas.staff import StaffUpdate, StaffListResponse
from middleware.auth import get_current_user, require_admin
from services.staff_service import StaffService

router = APIRouter(prefix="/api/staffs", tags=["Staffs"])

@router.get("", response_model=List[StaffListResponse])
def get_staffs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Lấy danh sách staffs (Admin only)"""
    return StaffService.get_staffs(db, skip, limit)

@router.get("/{staff_id}", response_model=StaffListResponse)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """Lấy chi tiết staff theo ID (Admin only)"""
    return StaffService.get_staff_by_id(db, staff_id)

@router.put("/{staff_id}", response_model=StaffListResponse)
def update_staff(
    staff_id: int,
    request: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """
    Cập nhật thông tin staff (Admin only)
    Admin có quyền:
    - Cập nhật email của staff
    - Thay đổi role (ADMIN/STAFF)
    - Cập nhật tất cả thông tin khác (first_name, last_name, phone, active, is_active, manager_id)
    """
    return StaffService.update_staff(db, staff_id, request)

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: Staff = Depends(require_admin)
):
    """
    Xóa tài khoản staff (Admin only)
    Admin có thể xóa bất kỳ staff nào (trừ chính mình)
    """
    StaffService.delete_staff(db, staff_id, current_user.staff_id)
    return None
