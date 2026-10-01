from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.models.guardian import Guardian
from app.schemas.guardian import GuardianCreate, GuardianUpdate, GuardianResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/guardians", tags=["guardians"])


@router.post("/", response_model=GuardianResponse, status_code=status.HTTP_201_CREATED)
def create_guardian(
    guardian: GuardianCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new guardian for an applicant"""
    
    # Check if applicant exists
    applicant = db.query(Applicant).filter(Applicant.id == guardian.applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    # Only allow user to add guardian to their own profile or admin
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add guardian to this profile"
        )
    
    db_guardian = Guardian(**guardian.model_dump())
    db.add(db_guardian)
    db.commit()
    db.refresh(db_guardian)
    
    return db_guardian


@router.get("/applicant/{applicant_id}", response_model=List[GuardianResponse])
def get_applicant_guardians(
    applicant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all guardians for a specific applicant"""
    
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    # Only allow user to view their own guardians or admin
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view guardians for this profile"
        )
    
    guardians = db.query(Guardian).filter(Guardian.applicant_id == applicant_id).all()
    return guardians


@router.get("/{guardian_id}", response_model=GuardianResponse)
def get_guardian(
    guardian_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific guardian by ID"""
    
    guardian = db.query(Guardian).filter(Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardian not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == guardian.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this guardian"
        )
    
    return guardian


@router.put("/{guardian_id}", response_model=GuardianResponse)
def update_guardian(
    guardian_id: int,
    guardian_update: GuardianUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a guardian's information"""
    
    guardian = db.query(Guardian).filter(Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardian not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == guardian.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this guardian"
        )
    
    # Update only provided fields
    update_data = guardian_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(guardian, field, value)
    
    db.commit()
    db.refresh(guardian)
    
    return guardian


@router.delete("/{guardian_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guardian(
    guardian_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a guardian"""
    
    guardian = db.query(Guardian).filter(Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardian not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == guardian.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this guardian"
        )
    
    db.delete(guardian)
    db.commit()
    
    return None
