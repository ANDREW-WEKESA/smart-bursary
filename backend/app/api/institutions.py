from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserRole
from app.models.institution import Institution, VerificationStatus, InstitutionType
from app.schemas.institution import (
    InstitutionCreate,
    InstitutionUpdate,
    InstitutionResponse,
    InstitutionList,
    InstitutionVerification
)

router = APIRouter(prefix="/institutions", tags=["Institutions"])


def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require administrator role."""
    if current_user.role not in [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required"
        )
    return current_user


@router.post("", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED)
def create_institution(
    institution_data: InstitutionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new institution (Admin only)."""
    # Check if institution already exists
    existing = db.query(Institution).filter(
        Institution.name == institution_data.name
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution with this name already exists"
        )
    
    # Create institution
    db_institution = Institution(**institution_data.model_dump())
    db.add(db_institution)
    db.commit()
    db.refresh(db_institution)
    
    return db_institution


@router.get("", response_model=InstitutionList)
def list_institutions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    institution_type: Optional[InstitutionType] = None,
    verification_status: Optional[VerificationStatus] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all institutions with filtering."""
    query = db.query(Institution)
    
    # Apply filters
    if institution_type:
        query = query.filter(Institution.institution_type == institution_type)
    
    if verification_status:
        query = query.filter(Institution.verification_status == verification_status)
    
    if search:
        query = query.filter(
            Institution.name.ilike(f"%{search}%") |
            Institution.code.ilike(f"%{search}%")
        )
    
    # Get total count
    total = query.count()
    
    # Get paginated results
    institutions = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "institutions": institutions
    }


@router.get("/verified", response_model=InstitutionList)
def list_verified_institutions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List only verified institutions (for applicant selection)."""
    query = db.query(Institution).filter(
        Institution.verification_status == VerificationStatus.VERIFIED,
        Institution.is_active == 1
    )
    
    total = query.count()
    institutions = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "institutions": institutions
    }


@router.get("/{institution_id}", response_model=InstitutionResponse)
def get_institution(
    institution_id: int,
    db: Session = Depends(get_db)
):
    """Get institution by ID."""
    institution = db.query(Institution).filter(
        Institution.id == institution_id
    ).first()
    
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    return institution


@router.put("/{institution_id}", response_model=InstitutionResponse)
def update_institution(
    institution_id: int,
    institution_data: InstitutionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update institution details (Admin only)."""
    institution = db.query(Institution).filter(
        Institution.id == institution_id
    ).first()
    
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    # Update fields
    update_data = institution_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(institution, field, value)
    
    db.commit()
    db.refresh(institution)
    
    return institution


@router.post("/{institution_id}/verify", response_model=InstitutionResponse)
def verify_institution(
    institution_id: int,
    verification_data: InstitutionVerification,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Verify or reject institution (Admin only)."""
    institution = db.query(Institution).filter(
        Institution.id == institution_id
    ).first()
    
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    # Update verification status
    institution.verification_status = verification_data.verification_status
    institution.verified_by = current_user.id
    institution.verified_at = datetime.utcnow()
    
    db.commit()
    db.refresh(institution)
    
    return institution


@router.delete("/{institution_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_institution(
    institution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete institution (Admin only) - soft delete by deactivating."""
    institution = db.query(Institution).filter(
        Institution.id == institution_id
    ).first()
    
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    # Soft delete - deactivate instead of removing
    institution.is_active = 0
    db.commit()
    
    return None
