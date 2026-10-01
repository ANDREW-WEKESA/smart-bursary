from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class DisbursementMethod(str, enum.Enum):
    """Payment disbursement methods."""
    BANK_TRANSFER = "bank_transfer"
    MOBILE_MONEY = "mobile_money"
    CHEQUE = "cheque"
    DIRECT_TO_INSTITUTION = "direct_to_institution"


class DisbursementStatus(str, enum.Enum):
    """Status of payment disbursement."""
    PENDING = "pending"
    APPROVED = "approved"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REVERSED = "reversed"


class Disbursement(Base):
    """Track bursary payment disbursements."""
    __tablename__ = "disbursements"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    
    # Payment Details
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="KES")
    disbursement_method = Column(SQLEnum(DisbursementMethod), nullable=False)
    
    # Recipient Information
    recipient_name = Column(String(255), nullable=False)
    recipient_account = Column(String(100), nullable=True)  # Bank account or mobile number
    recipient_bank = Column(String(255), nullable=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)  # If paid to institution
    
    # Status Tracking
    status = Column(SQLEnum(DisbursementStatus), default=DisbursementStatus.PENDING)
    
    # Transaction Reference
    reference_number = Column(String(100), unique=True, nullable=True, index=True)
    transaction_id = Column(String(255), nullable=True)  # External payment system ID
    
    # Schedule
    scheduled_date = Column(DateTime, nullable=True)
    processed_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    
    # Approval
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    approval_notes = Column(Text, nullable=True)
    
    # Failure/Cancellation
    failure_reason = Column(Text, nullable=True)
    cancelled_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    
    # Receipts and Documentation
    receipt_document = Column(String(500), nullable=True)
    payment_proof = Column(String(500), nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    application = relationship("Application", backref="disbursements")
    institution = relationship("Institution", backref="disbursements")
    approver = relationship("User", foreign_keys=[approved_by], backref="approved_disbursements")
    canceller = relationship("User", foreign_keys=[cancelled_by], backref="cancelled_disbursements")
    
    def __repr__(self):
        return f"<Disbursement {self.reference_number} - {self.amount}>"
