from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import shutil
import secrets
from pathlib import Path
from app.core.database import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.models.application import Application
from app.models.document import Document
from app.schemas.document import (
    DocumentResponse,
    DocumentVerification,
    DocumentUpdate
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/documents", tags=["documents"])

# Configure upload directory
UPLOAD_DIR = Path("uploads/documents")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed file types and sizes
ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif',
    'xls', 'xlsx', 'txt', 'zip', 'rar'
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename to prevent conflicts"""
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    random_name = secrets.token_hex(16)
    return f"{random_name}.{ext}" if ext else random_name


def validate_file(file: UploadFile) -> tuple[bool, str]:
    """Validate file type and size"""
    # Check file extension
    if '.' not in file.filename:
        return False, "File must have an extension"
    
    ext = file.filename.rsplit('.', 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"File type .{ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
    
    # Check file size (read in chunks to avoid memory issues)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        return False, f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.1f}MB"
    
    return True, ""


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    application_id: int = Form(...),
    document_type: str = Form(...),
    document_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a document for an application"""
    
    # Validate file
    is_valid, error_message = validate_file(file)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )
    
    # Verify application exists
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
            detail="Not authorized to upload documents for this application"
        )
    
    # Generate unique filename and save file
    unique_filename = generate_unique_filename(file.filename)
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    finally:
        file.file.close()
    
    # Get file size
    file_size = file_path.stat().st_size
    
    # Create document record
    db_document = Document(
        application_id=application_id,
        document_type=document_type,
        document_name=document_name or file.filename,
        description=description,
        file_path=str(file_path),
        file_size=file_size,
        mime_type=file.content_type or "application/octet-stream"
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document


@router.get("/application/{application_id}", response_model=List[DocumentResponse])
def get_application_documents(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all documents for an application"""
    
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
                detail="Not authorized to view documents for this application"
            )
    
    documents = db.query(Document).filter(Document.application_id == application_id).all()
    return documents


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get document details"""
    
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check authorization
    application = db.query(Application).filter(Application.id == document.application_id).first()
    if not current_user.is_admin:
        applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
        if applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this document"
            )
    
    return document


@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download a document file"""
    
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check authorization
    application = db.query(Application).filter(Application.id == document.application_id).first()
    if not current_user.is_admin:
        applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
        if applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to download this document"
            )
    
    # Check if file exists
    file_path = Path(document.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )
    
    return FileResponse(
        path=file_path,
        filename=document.document_name,
        media_type=document.mime_type
    )


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_update: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update document details (not the file itself)"""
    
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check authorization
    application = db.query(Application).filter(Application.id == document.application_id).first()
    if not current_user.is_admin:
        applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
        if applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this document"
            )
    
    # Update fields
    update_data = document_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)
    
    db.commit()
    db.refresh(document)
    
    return document


@router.post("/{document_id}/verify", response_model=DocumentResponse)
def verify_document(
    document_id: int,
    verification: DocumentVerification,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify a document (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    document.is_verified = verification.is_verified
    document.verified_by = current_user.id
    document.verified_at = datetime.utcnow()
    if verification.verification_notes:
        document.verification_notes = verification.verification_notes
    
    db.commit()
    db.refresh(document)
    
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document"""
    
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check authorization
    application = db.query(Application).filter(Application.id == document.application_id).first()
    if not current_user.is_admin:
        applicant = db.query(Applicant).filter(Applicant.id == application.applicant_id).first()
        if applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this document"
            )
    
    # Delete file from filesystem
    try:
        file_path = Path(document.file_path)
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        print(f"Warning: Could not delete file {document.file_path}: {e}")
    
    # Delete database record
    db.delete(document)
    db.commit()
    
    return None


@router.get("/statistics/overview")
def get_document_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get document statistics (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    documents = db.query(Document).all()
    
    # Calculate total size in MB
    total_size_bytes = sum(d.file_size for d in documents)
    total_size_mb = total_size_bytes / (1024 * 1024)
    
    # Count by type
    by_type = {}
    for doc in documents:
        by_type[doc.document_type] = by_type.get(doc.document_type, 0) + 1
    
    stats = {
        "total_documents": len(documents),
        "verified": sum(1 for d in documents if d.is_verified),
        "unverified": sum(1 for d in documents if not d.is_verified),
        "total_size_mb": round(total_size_mb, 2),
        "by_type": by_type,
        "allowed_extensions": list(ALLOWED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024)
    }
    
    return stats
