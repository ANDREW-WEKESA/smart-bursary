from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.core.database import get_db
from app.models.user import User
from app.models.bursary import Bursary
from app.schemas.bursary import BursaryCreate, BursaryUpdate, BursaryResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/bursaries", tags=["bursaries"])


@router.post("/", response_model=BursaryResponse, status_code=status.HTTP_201_CREATED)
def create_bursary(
    bursary: BursaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new bursary (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    db_bursary = Bursary(**bursary.model_dump())
    db.add(db_bursary)
    db.commit()
    db.refresh(db_bursary)
    
    return db_bursary


@router.get("/", response_model=List[BursaryResponse])
def list_bursaries(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    bursary_type: str = None,
    db: Session = Depends(get_db)
):
    """List all bursaries with optional filters"""
    
    query = db.query(Bursary)
    
    # Apply filters
    if status_filter:
        query = query.filter(Bursary.status == status_filter)
    
    if bursary_type:
        query = query.filter(Bursary.bursary_type == bursary_type)
    
    bursaries = query.offset(skip).limit(limit).all()
    return bursaries


@router.get("/active", response_model=List[BursaryResponse])
def list_active_bursaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all active (open) bursaries with upcoming deadlines"""
    
    today = date.today()
    bursaries = db.query(Bursary).filter(
        Bursary.status == "open",
        Bursary.application_deadline >= today
    ).offset(skip).limit(limit).all()
    
    return bursaries


@router.get("/{bursary_id}", response_model=BursaryResponse)
def get_bursary(
    bursary_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific bursary by ID"""
    
    bursary = db.query(Bursary).filter(Bursary.id == bursary_id).first()
    if not bursary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bursary not found"
        )
    
    return bursary


@router.put("/{bursary_id}", response_model=BursaryResponse)
def update_bursary(
    bursary_id: int,
    bursary_update: BursaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a bursary (admin only)"""
    
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
    
    # Update only provided fields
    update_data = bursary_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(bursary, field, value)
    
    db.commit()
    db.refresh(bursary)
    
    return bursary


@router.delete("/{bursary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bursary(
    bursary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a bursary (admin only)"""
    
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
    
    db.delete(bursary)
    db.commit()
    
    return None


@router.post("/{bursary_id}/open", response_model=BursaryResponse)
def open_bursary(
    bursary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Open a bursary for applications (admin only)"""
    
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
    
    bursary.status = "open"
    db.commit()
    db.refresh(bursary)
    
    return bursary


@router.post("/{bursary_id}/close", response_model=BursaryResponse)
def close_bursary(
    bursary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Close a bursary for applications (admin only)"""
    
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
    
    bursary.status = "closed"
    db.commit()
    db.refresh(bursary)
    
    return bursary
