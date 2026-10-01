from pydantic import BaseModel, EmailStr, Field, HttpUrl
from datetime import datetime
from typing import Optional
from app.models.institution import InstitutionType, VerificationStatus


class InstitutionBase(BaseModel):
    """Base institution schema."""
    name: str = Field(..., min_length=2, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    institution_type: InstitutionType
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = None
    address: Optional[str] = None
    county: Optional[str] = Field(None, max_length=100)
    town: Optional[str] = Field(None, max_length=100)
    accreditation_number: Optional[str] = Field(None, max_length=100)
    accreditation_body: Optional[str] = Field(None, max_length=255)


class InstitutionCreate(InstitutionBase):
    """Schema for creating institution."""
    pass


class InstitutionUpdate(BaseModel):
    """Schema for updating institution."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    institution_type: Optional[InstitutionType] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = None
    address: Optional[str] = None
    county: Optional[str] = Field(None, max_length=100)
    town: Optional[str] = Field(None, max_length=100)
    accreditation_number: Optional[str] = Field(None, max_length=100)
    accreditation_body: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class InstitutionVerification(BaseModel):
    """Schema for verifying institution."""
    verification_status: VerificationStatus
    verification_notes: Optional[str] = None


class InstitutionResponse(InstitutionBase):
    """Schema for institution response."""
    id: int
    verification_status: VerificationStatus
    verified_at: Optional[datetime] = None
    verified_by: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class InstitutionList(BaseModel):
    """Schema for institution list response."""
    total: int
    institutions: list[InstitutionResponse]
