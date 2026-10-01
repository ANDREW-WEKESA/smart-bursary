from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.models.institution import Institution
from app.models.academic_progress import AcademicProgress
from app.schemas.academic_progress import (
    AcademicProgressCreate,
    AcademicProgressUpdate,
    AcademicProgressResponse
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/academic-progress", tags=["academic-progress"])


@router.post("/", response_model=AcademicProgressResponse, status_code=status.HTTP_201_CREATED)
def create_academic_progress(
    progress: AcademicProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new academic progress record"""
    
    # Check if applicant exists
    applicant = db.query(Applicant).filter(Applicant.id == progress.applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    # Only allow user to add progress to their own profile or admin
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add academic progress to this profile"
        )
    
    # Check if institution exists
    institution = db.query(Institution).filter(Institution.id == progress.institution_id).first()
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    db_progress = AcademicProgress(**progress.model_dump())
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    
    return db_progress


@router.get("/applicant/{applicant_id}", response_model=List[AcademicProgressResponse])
def get_applicant_progress(
    applicant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all academic progress records for a specific applicant"""
    
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found"
        )
    
    # Only allow user to view their own progress or admin
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view academic progress for this profile"
        )
    
    progress_records = db.query(AcademicProgress).filter(
        AcademicProgress.applicant_id == applicant_id
    ).all()
    return progress_records


@router.get("/{progress_id}", response_model=AcademicProgressResponse)
def get_academic_progress(
    progress_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific academic progress record"""
    
    progress = db.query(AcademicProgress).filter(AcademicProgress.id == progress_id).first()
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic progress record not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == progress.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this academic progress record"
        )
    
    return progress


@router.put("/{progress_id}", response_model=AcademicProgressResponse)
def update_academic_progress(
    progress_id: int,
    progress_update: AcademicProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an academic progress record"""
    
    progress = db.query(AcademicProgress).filter(AcademicProgress.id == progress_id).first()
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic progress record not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == progress.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this academic progress record"
        )
    
    # Update only provided fields
    update_data = progress_update.model_dump(exclude_unset=True)
    
    # Check if institution exists if being updated
    if "institution_id" in update_data:
        institution = db.query(Institution).filter(
            Institution.id == update_data["institution_id"]
        ).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
    
    for field, value in update_data.items():
        setattr(progress, field, value)
    
    db.commit()
    db.refresh(progress)
    
    return progress


@router.delete("/{progress_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_academic_progress(
    progress_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an academic progress record"""
    
    progress = db.query(AcademicProgress).filter(AcademicProgress.id == progress_id).first()
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic progress record not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == progress.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this academic progress record"
        )
    
    db.delete(progress)
    db.commit()
    
    return None
