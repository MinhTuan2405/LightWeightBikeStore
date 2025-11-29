from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.staff import Staff
from schemas.staff import StaffUpdate
from typing import List

class StaffService:
    @staticmethod
    def get_staffs(db: Session, skip: int = 0, limit: int = 100) -> List[Staff]:
        return db.query(Staff).offset(skip).limit(limit).all()

    @staticmethod
    def get_staff_by_id(db: Session, staff_id: int) -> Staff:
        staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found")
        return staff

    @staticmethod
    def update_staff(db: Session, staff_id: int, request: StaffUpdate) -> Staff:
        staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found")
        
        update_data = request.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(staff, key, value)
        
        db.commit()
        db.refresh(staff)
        return staff

    @staticmethod
    def delete_staff(db: Session, staff_id: int, current_user_id: int) -> None:
        staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found")
        
        # Không cho phép xóa chính mình
        if staff.staff_id == current_user_id:
            raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
        db.delete(staff)
        db.commit()
