from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum


class GenderEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class DisabilityStatusEnum(str, Enum):
    NONE = "none"
    PHYSICAL = "physical"
    VISUAL = "visual"
    HEARING = "hearing"
    OTHER = "other"


class ApplicantBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    middle_name: Optional[str] = Field(None, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    date_of_birth: date
    gender: GenderEnum
    national_id: str = Field(..., min_length=5, max_length=20)
    phone_number: str = Field(..., min_length=10, max_length=15)
    email: EmailStr
    county: str = Field(..., min_length=1, max_length=100)
    sub_county: str = Field(..., min_length=1, max_length=100)
    ward: str = Field(..., min_length=1, max_length=100)
    village: str = Field(..., min_length=1, max_length=100)
    postal_address: Optional[str] = Field(None, max_length=200)
    disability_status: DisabilityStatusEnum = DisabilityStatusEnum.NONE
    disability_details: Optional[str] = Field(None, max_length=500)


class ApplicantCreate(ApplicantBase):
    pass


class ApplicantUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    middle_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    national_id: Optional[str] = Field(None, min_length=5, max_length=20)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    county: Optional[str] = Field(None, min_length=1, max_length=100)
    sub_county: Optional[str] = Field(None, min_length=1, max_length=100)
    ward: Optional[str] = Field(None, min_length=1, max_length=100)
    village: Optional[str] = Field(None, min_length=1, max_length=100)
    postal_address: Optional[str] = Field(None, max_length=200)
    disability_status: Optional[DisabilityStatusEnum] = None
    disability_details: Optional[str] = Field(None, max_length=500)


class ApplicantResponse(ApplicantBase):
    id: int
    user_id: int
    is_verified: bool

    class Config:
        from_attributes = True
