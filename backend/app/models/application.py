from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class ApplicationStatus(str, enum.Enum):
    """Application processing status."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    VERIFICATION = "verification"
    ADDITIONAL_INFO_REQUIRED = "additional_info_required"
    COMMITTEE_REVIEW = "committee_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    DISBURSED = "disbursed"
    CANCELLED = "cancelled"


class Application(Base):
    """Bursary applications."""
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.id"), nullable=False)
    bursary_id = Column(Integer, ForeignKey("bursaries.id"), nullable=False)
    
    # Reference Number
    application_number = Column(String(50), unique=True, nullable=False, index=True)
    
    # Application Details
    amount_requested = Column(Numeric(12, 2), nullable=True)
    reason_for_application = Column(Text, nullable=True)
    
    # Status
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.DRAFT, index=True)
    
    # Dates
    submission_date = Column(DateTime, nullable=True)
    review_start_date = Column(DateTime, nullable=True)
    decision_date = Column(DateTime, nullable=True)
    
    # AI Analysis
    priority_score = Column(Numeric(5, 2), nullable=True)  # 0-100
    financial_need_score = Column(Numeric(5, 2), nullable=True)
    duplicate_risk_flag = Column(Integer, default=0)
    ai_analysis_data = Column(Text, nullable=True)  # JSON data
    
    # Review
    assigned_reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewer_score = Column(Numeric(5, 2), nullable=True)
    reviewer_recommendation = Column(String(50), nullable=True)  # Approve, Reject, etc.
    reviewer_comments = Column(Text, nullable=True)
    
    # Decision
    decision_made_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    decision_reason = Column(Text, nullable=True)
    approved_amount = Column(Numeric(12, 2), nullable=True)
    
    # Additional Info Request
    additional_info_requested = Column(Text, nullable=True)
    additional_info_provided = Column(Text, nullable=True)
    additional_info_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    applicant = relationship("Applicant", backref="applications")
    bursary = relationship("Bursary", backref="applications")
    reviewer = relationship("User", foreign_keys=[assigned_reviewer_id], backref="assigned_applications")
    decision_maker = relationship("User", foreign_keys=[decision_made_by], backref="decided_applications")
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Application {self.application_number}>"
