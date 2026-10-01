from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import secrets
from app.core.database import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.models.application import Application
from app.models.disbursement import Disbursement
from app.schemas.disbursement import (
    DisbursementCreate,
    DisbursementUpdate,
    DisbursementResponse,
    DisbursementStatusUpdate
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/disbursements", tags=["disbursements"])


def generate_disbursement_reference():
    """Generate unique disbursement reference number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = secrets.token_hex(4).upper()
    return f"DISB-{timestamp}-{random_part}"


@router.post("/", response_model=DisbursementResponse, status_code=status.HTTP_201_CREATED)
def create_disbursement(
    disbursement: DisbursementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new disbursement record (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Verify application exists and is approved
    application = db.query(Application).filter(
        Application.id == disbursement.application_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    if application.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Application must be approved before creating disbursement (current status: {application.status})"
        )
    
    # Check if disbursement already exists for this application
    existing = db.query(Disbursement).filter(
        Disbursement.application_id == disbursement.application_id,
        Disbursement.status.notin_(["cancelled", "reversed"])
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Active disbursement already exists for this application"
        )
    
    # Create disbursement
    db_disbursement = Disbursement(
        **disbursement.model_dump(),
        reference_number=generate_disbursement_reference(),
        status="pending"
    )
    
    db.add(db_disbursement)
    db.commit()
    db.refresh(db_disbursement)
    
    return db_disbursement


@router.get("/", response_model=List[DisbursementResponse])
def list_disbursements(
    status_filter: Optional[str] = None,
    method_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all disbursements (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    query = db.query(Disbursement)
    
    if status_filter:
        query = query.filter(Disbursement.status == status_filter)
    
    if method_filter:
        query = query.filter(Disbursement.disbursement_method == method_filter)
    
    disbursements = query.offset(skip).limit(limit).all()
    return disbursements


@router.get("/pending", response_model=List[DisbursementResponse])
def get_pending_disbursements(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all pending disbursements awaiting approval (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursements = db.query(Disbursement).filter(
        Disbursement.status == "pending"
    ).offset(skip).limit(limit).all()
    
    return disbursements


@router.get("/application/{application_id}", response_model=List[DisbursementResponse])
def get_application_disbursements(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all disbursements for a specific application"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    if not current_user.is_admin:
        applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
        if applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view disbursements for this application"
            )
    
    disbursements = db.query(Disbursement).filter(
        Disbursement.application_id == application_id
    ).all()
    
    return disbursements


@router.get("/{disbursement_id}", response_model=DisbursementResponse)
def get_disbursement(
    disbursement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific disbursement"""
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    # Check authorization
    if not current_user.is_admin:
        application = db.query(Application).filter(
            Application.id == disbursement.application_id
        ).first()
        applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
        
        if applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this disbursement"
            )
    
    return disbursement


@router.put("/{disbursement_id}", response_model=DisbursementResponse)
def update_disbursement(
    disbursement_id: int,
    disbursement_update: DisbursementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update disbursement details (admin only, only pending disbursements)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    # Only pending disbursements can be updated
    if disbursement.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only pending disbursements can be updated (current status: {disbursement.status})"
        )
    
    # Update fields
    update_data = disbursement_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(disbursement, field, value)
    
    db.commit()
    db.refresh(disbursement)
    
    return disbursement


@router.post("/{disbursement_id}/approve", response_model=DisbursementResponse)
def approve_disbursement(
    disbursement_id: int,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Approve a disbursement for processing (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    if disbursement.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only pending disbursements can be approved (current status: {disbursement.status})"
        )
    
    disbursement.status = "approved"
    disbursement.approved_by = current_user.id
    disbursement.approved_at = datetime.utcnow()
    if notes:
        disbursement.approval_notes = notes
    
    db.commit()
    db.refresh(disbursement)
    
    return disbursement


@router.post("/{disbursement_id}/process", response_model=DisbursementResponse)
def process_disbursement(
    disbursement_id: int,
    transaction_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark disbursement as processing (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    if disbursement.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only approved disbursements can be processed (current status: {disbursement.status})"
        )
    
    disbursement.status = "processing"
    disbursement.processed_date = datetime.utcnow()
    if transaction_id:
        disbursement.transaction_id = transaction_id
    
    db.commit()
    db.refresh(disbursement)
    
    return disbursement


@router.post("/{disbursement_id}/complete", response_model=DisbursementResponse)
def complete_disbursement(
    disbursement_id: int,
    transaction_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark disbursement as completed (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    if disbursement.status not in ["approved", "processing"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only approved or processing disbursements can be completed (current status: {disbursement.status})"
        )
    
    disbursement.status = "completed"
    disbursement.completed_date = datetime.utcnow()
    if transaction_id:
        disbursement.transaction_id = transaction_id
    
    db.commit()
    db.refresh(disbursement)
    
    return disbursement


@router.post("/{disbursement_id}/fail", response_model=DisbursementResponse)
def fail_disbursement(
    disbursement_id: int,
    failure_reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark disbursement as failed (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    if disbursement.status not in ["processing"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only processing disbursements can be marked as failed (current status: {disbursement.status})"
        )
    
    disbursement.status = "failed"
    disbursement.failure_reason = failure_reason
    
    db.commit()
    db.refresh(disbursement)
    
    return disbursement


@router.post("/{disbursement_id}/cancel", response_model=DisbursementResponse)
def cancel_disbursement(
    disbursement_id: int,
    cancellation_reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel a disbursement (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disbursement not found"
        )
    
    if disbursement.status in ["completed", "cancelled", "reversed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Disbursement cannot be cancelled (current status: {disbursement.status})"
        )
    
    disbursement.status = "cancelled"
    disbursement.cancelled_by = current_user.id
    disbursement.cancelled_at = datetime.utcnow()
    disbursement.cancellation_reason = cancellation_reason
    
    db.commit()
    db.refresh(disbursement)
    
    return disbursement


@router.get("/statistics/overview")
def get_disbursement_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get disbursement statistics overview (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    disbursements = db.query(Disbursement).all()
    
    total_disbursed = sum(
        d.amount for d in disbursements if d.status == "completed"
    )
    
    stats = {
        "total_disbursements": len(disbursements),
        "pending": sum(1 for d in disbursements if d.status == "pending"),
        "approved": sum(1 for d in disbursements if d.status == "approved"),
        "processing": sum(1 for d in disbursements if d.status == "processing"),
        "completed": sum(1 for d in disbursements if d.status == "completed"),
        "failed": sum(1 for d in disbursements if d.status == "failed"),
        "cancelled": sum(1 for d in disbursements if d.status == "cancelled"),
        "total_amount_disbursed": total_disbursed,
        "by_method": {
            "bank_transfer": sum(1 for d in disbursements if d.disbursement_method == "bank_transfer"),
            "mobile_money": sum(1 for d in disbursements if d.disbursement_method == "mobile_money"),
            "cheque": sum(1 for d in disbursements if d.disbursement_method == "cheque"),
            "direct_to_institution": sum(1 for d in disbursements if d.disbursement_method == "direct_to_institution")
        }
    }
    
    return stats
