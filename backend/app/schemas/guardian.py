from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class GuardianRelationshipEnum(str, Enum):
    FATHER = "father"
    MOTHER = "mother"
    GUARDIAN = "guardian"
    SIBLING = "sibling"
    OTHER = "other"


class GuardianBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    guardian_relationship: GuardianRelationshipEnum
    national_id: str = Field(..., min_length=5, max_length=20)
    phone_number: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    occupation: Optional[str] = Field(None, max_length=100)
    monthly_income: Optional[float] = Field(None, ge=0)
    employer: Optional[str] = Field(None, max_length=200)


class GuardianCreate(GuardianBase):
    applicant_id: int


class GuardianUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    guardian_relationship: Optional[GuardianRelationshipEnum] = None
    national_id: Optional[str] = Field(None, min_length=5, max_length=20)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    occupation: Optional[str] = Field(None, max_length=100)
    monthly_income: Optional[float] = Field(None, ge=0)
    employer: Optional[str] = Field(None, max_length=200)


class GuardianResponse(GuardianBase):
    id: int
    applicant_id: int

    class Config:
        from_attributes = True
