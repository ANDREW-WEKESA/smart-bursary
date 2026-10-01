from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric, Enum as SQLEnum
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class BursaryStatus(str, enum.Enum):
    """Bursary program status."""
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    SUSPENDED = "suspended"


class Bursary(Base):
    """Bursary programs."""
    __tablename__ = "bursaries"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Financial Details
    total_budget = Column(Numeric(15, 2), nullable=True)
    amount_per_student = Column(Numeric(12, 2), nullable=True)
    min_amount = Column(Numeric(12, 2), nullable=True)
    max_amount = Column(Numeric(12, 2), nullable=True)
    
    # Eligibility
    eligibility_criteria = Column(Text, nullable=True)  # JSON or text
    required_documents = Column(Text, nullable=True)  # JSON list
    min_gpa = Column(Numeric(3, 2), nullable=True)
    target_education_levels = Column(String(255), nullable=True)  # Comma-separated
    target_institutions = Column(Text, nullable=True)  # JSON list or comma-separated
    
    # Dates
    application_start_date = Column(DateTime, nullable=True)
    application_deadline = Column(DateTime, nullable=False)
    disbursement_start_date = Column(DateTime, nullable=True)
    
    # Status
    status = Column(SQLEnum(BursaryStatus), default=BursaryStatus.DRAFT)
    
    # Statistics
    total_applications = Column(Integer, default=0)
    total_approved = Column(Integer, default=0)
    total_disbursed = Column(Numeric(15, 2), default=0)
    
    # Contact
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    
    # Created by
    created_by = Column(Integer, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Bursary {self.name}>"
