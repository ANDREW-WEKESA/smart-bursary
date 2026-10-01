from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ApplicationStatusEnum(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    DOCUMENTS_PENDING = "documents_pending"
    VERIFIED = "verified"
    APPROVED = "approved"
    REJECTED = "rejected"
    APPEALED = "appealed"
    CANCELLED = "cancelled"


class ApplicationBase(BaseModel):
    bursary_id: int
    applicant_id: int
    reason_for_application: str = Field(..., min_length=50)
    household_size: int = Field(..., ge=1)
    total_household_income: float = Field(..., ge=0)
    other_financial_aid: Optional[float] = Field(None, ge=0)
    other_aid_sources: Optional[str] = Field(None, max_length=500)
    special_circumstances: Optional[str] = Field(None, max_length=1000)


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    reason_for_application: Optional[str] = Field(None, min_length=50)
    household_size: Optional[int] = Field(None, ge=1)
    total_household_income: Optional[float] = Field(None, ge=0)
    other_financial_aid: Optional[float] = Field(None, ge=0)
    other_aid_sources: Optional[str] = Field(None, max_length=500)
    special_circumstances: Optional[str] = Field(None, max_length=1000)


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatusEnum
    reviewer_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    id: int
    reference_number: str
    status: ApplicationStatusEnum
    application_score: Optional[float] = None
    priority_score: Optional[float] = None
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[int] = None
    reviewer_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationDetailResponse(ApplicationResponse):
    """Extended response with related data"""
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    bursary_name: Optional[str] = None
    bursary_amount: Optional[float] = None


class ApplicationDocumentBase(BaseModel):
    document_type: str = Field(..., max_length=50)
    document_name: str = Field(..., max_length=200)
    file_path: str = Field(..., max_length=500)
    file_size: int = Field(..., ge=0)
    mime_type: str = Field(..., max_length=100)


class ApplicationDocumentCreate(ApplicationDocumentBase):
    application_id: int


class ApplicationDocumentResponse(ApplicationDocumentBase):
    id: int
    application_id: int
    is_verified: bool
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    verification_notes: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True
