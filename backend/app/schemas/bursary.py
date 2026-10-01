from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class BursaryTypeEnum(str, Enum):
    MERIT = "merit"
    NEED_BASED = "need_based"
    SPORTS = "sports"
    DISABILITY = "disability"
    COUNTY = "county"
    NATIONAL = "national"


class BursaryStatusEnum(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    SUSPENDED = "suspended"


class BursaryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    bursary_type: BursaryTypeEnum
    amount: float = Field(..., gt=0)
    total_slots: int = Field(..., gt=0)
    application_deadline: date
    academic_year: str = Field(..., min_length=1, max_length=20)
    eligibility_criteria: str = Field(..., min_length=1)
    required_documents: str = Field(..., min_length=1)
    status: BursaryStatusEnum = BursaryStatusEnum.DRAFT


class BursaryCreate(BursaryBase):
    pass


class BursaryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    bursary_type: Optional[BursaryTypeEnum] = None
    amount: Optional[float] = Field(None, gt=0)
    total_slots: Optional[int] = Field(None, gt=0)
    application_deadline: Optional[date] = None
    academic_year: Optional[str] = Field(None, min_length=1, max_length=20)
    eligibility_criteria: Optional[str] = Field(None, min_length=1)
    required_documents: Optional[str] = Field(None, min_length=1)
    status: Optional[BursaryStatusEnum] = None


class BursaryResponse(BursaryBase):
    id: int
    slots_filled: int

    class Config:
        from_attributes = True
