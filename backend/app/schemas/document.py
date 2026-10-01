from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class DocumentTypeEnum(str, Enum):
    NATIONAL_ID = "national_id"
    BIRTH_CERTIFICATE = "birth_certificate"
    ADMISSION_LETTER = "admission_letter"
    FEE_STRUCTURE = "fee_structure"
    TRANSCRIPT = "transcript"
    PROGRESS_REPORT = "progress_report"
    GUARDIAN_ID = "guardian_id"
    INCOME_STATEMENT = "income_statement"
    BANK_STATEMENT = "bank_statement"
    DISABILITY_CERTIFICATE = "disability_certificate"
    DEATH_CERTIFICATE = "death_certificate"
    PHOTO = "photo"
    OTHER = "other"


class DocumentBase(BaseModel):
    document_type: DocumentTypeEnum
    document_name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)


class DocumentCreate(DocumentBase):
    application_id: int
    file_path: str
    file_size: int = Field(..., ge=0)
    mime_type: str = Field(..., max_length=100)


class DocumentUpdate(BaseModel):
    document_name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    document_type: Optional[DocumentTypeEnum] = None


class DocumentResponse(DocumentBase):
    id: int
    application_id: int
    file_path: str
    file_size: int
    mime_type: str
    is_verified: bool
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    verification_notes: Optional[str] = None
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


class DocumentVerification(BaseModel):
    is_verified: bool
    verification_notes: Optional[str] = None
