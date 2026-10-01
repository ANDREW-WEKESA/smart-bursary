from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.schemas.applicant import ApplicantCreate, ApplicantUpdate, ApplicantResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/applicants", tags=["applicants"])


@router.post("/", response_model=ApplicantResponse, status_code=status.HTTP_201_CREATED)
def create_applicant(
    applicant: ApplicantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new applicant profile for the current user"""
    
    # Check if user already has an applicant profile
    existing = db.query(Applicant).filter(Applicant.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Applicant profile already exists for this user"
        )
    
    # Check if national_id or email already exists
    if db.query(Applicant).filter(Applicant.national_id == applicant.national_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="National ID already registered"
        )
    
    if db.query(Applicant).filter(Applicant.email == applicant.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_applicant = Applicant(**applicant.model_dump(), user_id=current_user.id)
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    
    return db_applicant


@router.get("/me", response_model=ApplicantResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current user's applicant profile"""
    
    applicant = db.query(Applicant).filter(Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found"
        )
    
    return applicant


@router.get("/{applicant_id}", response_model=ApplicantResponse)
def get_applicant(
    applicant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific applicant by ID (admin only or own profile)"""
    
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    # Allow access if user is viewing their own profile or is admin
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this profile"
        )
    
    return applicant


@router.get("/", response_model=List[ApplicantResponse])
def list_applicants(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all applicants (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    applicants = db.query(Applicant).offset(skip).limit(limit).all()
    return applicants


@router.put("/{applicant_id}", response_model=ApplicantResponse)
def update_applicant(
    applicant_id: int,
    applicant_update: ApplicantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an applicant profile"""
    
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    # Only allow user to update their own profile or admin
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this profile"
        )
    
    # Update only provided fields
    update_data = applicant_update.model_dump(exclude_unset=True)
    
    # Check for duplicate national_id or email if being updated
    if "national_id" in update_data:
        existing = db.query(Applicant).filter(
            Applicant.national_id == update_data["national_id"],
            Applicant.id != applicant_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="National ID already registered"
            )
    
    if "email" in update_data:
        existing = db.query(Applicant).filter(
            Applicant.email == update_data["email"],
            Applicant.id != applicant_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    for field, value in update_data.items():
        setattr(applicant, field, value)
    
    db.commit()
    db.refresh(applicant)
    
    return applicant


@router.delete("/{applicant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_applicant(
    applicant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an applicant profile (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    db.delete(applicant)
    db.commit()
    
    return None


@router.post("/{applicant_id}/verify", response_model=ApplicantResponse)
def verify_applicant(
    applicant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify an applicant profile (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    applicant.is_verified = True
    db.commit()
    db.refresh(applicant)
    
    return applicant
