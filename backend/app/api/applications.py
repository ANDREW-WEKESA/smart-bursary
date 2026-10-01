from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import secrets
from app.core.database import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.models.application import Application
from app.models.bursary import Bursary
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
    ApplicationDetailResponse,
    ApplicationStatusUpdate
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])


def generate_reference_number():
    """Generate unique application reference number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = secrets.token_hex(4).upper()
    return f"APP-{timestamp}-{random_part}"


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new bursary application (draft status)"""
    
    # Verify applicant exists and belongs to current user
    applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found"
        )
    
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create application for this applicant"
        )
    
    # Verify bursary exists and is open
    bursary = db.query(Bursary).filter(Bursary.id == application.bursary_id).first()
    if not bursary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bursary not found"
        )
    
    if bursary.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bursary is not open for applications (status: {bursary.status})"
        )
    
    # Check if application already exists for this bursary and applicant
    existing = db.query(Application).filter(
        Application.bursary_id == application.bursary_id,
        Application.applicant_id == application.applicant_id,
        Application.status.notin_(["rejected", "cancelled"])
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application already exists for this bursary"
        )
    
    # Create application
    db_application = Application(
        **application.model_dump(),
        reference_number=generate_reference_number(),
        status="draft"
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    return db_application


@router.post("/{application_id}/submit", response_model=ApplicationResponse)
def submit_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a draft application for review"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to submit this application"
        )
    
    # Check if already submitted
    if application.status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Application cannot be submitted (current status: {application.status})"
        )
    
    # Update status
    application.status = "submitted"
    application.submitted_at = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    
    return application


@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all applications for the current user"""
    
    # Get applicant profile
    applicant = db.query(Applicant).filter(Applicant.user_id == current_user.id).first()
    if not applicant:
        return []
    
    query = db.query(Application).filter(Application.applicant_id == applicant.id)
    
    if status_filter:
        query = query.filter(Application.status == status_filter)
    
    applications = query.offset(skip).limit(limit).all()
    return applications


@router.get("/", response_model=List[ApplicationResponse])
def list_applications(
    status_filter: Optional[str] = None,
    bursary_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all applications (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    query = db.query(Application)
    
    if status_filter:
        query = query.filter(Application.status == status_filter)
    
    if bursary_id:
        query = query.filter(Application.bursary_id == bursary_id)
    
    applications = query.offset(skip).limit(limit).all()
    return applications


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific application"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this application"
        )
    
    return application


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: int,
    application_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an application (only drafts can be updated by applicants)"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
    if applicant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this application"
        )
    
    # Only drafts can be updated by applicants
    if application.status != "draft" and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft applications can be updated"
        )
    
    # Update fields
    update_data = application_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    
    db.commit()
    db.refresh(application)
    
    return application


@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update application status (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update status
    application.status = status_update.status
    application.reviewed_at = datetime.utcnow()
    application.reviewed_by = current_user.id
    
    if status_update.reviewer_notes:
        application.reviewer_notes = status_update.reviewer_notes
    
    if status_update.rejection_reason:
        application.rejection_reason = status_update.rejection_reason
    
    # Update bursary slots if approved
    if status_update.status == "approved":
        bursary = db.query(Bursary).filter(Bursary.id == application.bursary_id).first()
        if bursary:
            bursary.slots_filled += 1
    
    db.commit()
    db.refresh(application)
    
    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel an application (applicant can cancel draft/submitted, admin can cancel any)"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
    is_owner = applicant.user_id == current_user.id
    
    if not is_owner and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this application"
        )
    
    # Applicants can only cancel draft or submitted applications
    if is_owner and not current_user.is_admin:
        if application.status not in ["draft", "submitted"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only draft or submitted applications can be cancelled"
            )
    
    application.status = "cancelled"
    db.commit()
    
    return None


@router.get("/bursary/{bursary_id}/statistics")
def get_bursary_application_statistics(
    bursary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get application statistics for a bursary (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    bursary = db.query(Bursary).filter(Bursary.id == bursary_id).first()
    if not bursary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bursary not found"
        )
    
    applications = db.query(Application).filter(Application.bursary_id == bursary_id).all()
    
    stats = {
        "total_applications": len(applications),
        "draft": sum(1 for app in applications if app.status == "draft"),
        "submitted": sum(1 for app in applications if app.status == "submitted"),
        "under_review": sum(1 for app in applications if app.status == "under_review"),
        "verified": sum(1 for app in applications if app.status == "verified"),
        "approved": sum(1 for app in applications if app.status == "approved"),
        "rejected": sum(1 for app in applications if app.status == "rejected"),
        "cancelled": sum(1 for app in applications if app.status == "cancelled"),
        "bursary_name": bursary.name,
        "total_slots": bursary.total_slots,
        "slots_filled": bursary.slots_filled,
        "slots_available": bursary.total_slots - bursary.slots_filled
    }
    
    return stats
