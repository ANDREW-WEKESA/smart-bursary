from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum


class DisbursementMethodEnum(str, Enum):
    BANK_TRANSFER = "bank_transfer"
    MOBILE_MONEY = "mobile_money"
    CHEQUE = "cheque"
    DIRECT_TO_INSTITUTION = "direct_to_institution"


class DisbursementStatusEnum(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REVERSED = "reversed"


class DisbursementBase(BaseModel):
    application_id: int
    amount: float = Field(..., gt=0)
    currency: str = Field(default="KES", max_length=3)
    disbursement_method: DisbursementMethodEnum
    recipient_name: str = Field(..., min_length=1, max_length=200)
    recipient_account: Optional[str] = Field(None, max_length=100)
    recipient_phone: Optional[str] = Field(None, max_length=15)
    recipient_bank: Optional[str] = Field(None, max_length=100)
    institution_id: Optional[int] = None
    scheduled_date: date
    description: Optional[str] = Field(None, max_length=500)


class DisbursementCreate(DisbursementBase):
    pass


class DisbursementUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    disbursement_method: Optional[DisbursementMethodEnum] = None
    recipient_name: Optional[str] = Field(None, min_length=1, max_length=200)
    recipient_account: Optional[str] = Field(None, max_length=100)
    recipient_phone: Optional[str] = Field(None, max_length=15)
    recipient_bank: Optional[str] = Field(None, max_length=100)
    scheduled_date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)


class DisbursementStatusUpdate(BaseModel):
    status: DisbursementStatusEnum
    notes: Optional[str] = None
    failure_reason: Optional[str] = None
    transaction_id: Optional[str] = None


class DisbursementResponse(DisbursementBase):
    id: int
    reference_number: str
    status: DisbursementStatusEnum
    transaction_id: Optional[str] = None
    processed_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    approval_notes: Optional[str] = None
    failure_reason: Optional[str] = None
    cancelled_by: Optional[int] = None
    cancelled_at: Optional[datetime] = None
    cancellation_reason: Optional[str] = None
    receipt_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DisbursementDetailResponse(DisbursementResponse):
    """Extended response with related data"""
    applicant_name: Optional[str] = None
    applicant_id_number: Optional[str] = None
    bursary_name: Optional[str] = None
    institution_name: Optional[str] = None
