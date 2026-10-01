from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class Semester(str, enum.Enum):
    """Academic semesters."""
    SEMESTER_1 = "semester_1"
    SEMESTER_2 = "semester_2"
    SEMESTER_3 = "semester_3"


class AcademicStatus(str, enum.Enum):
    """Academic standing status."""
    ACTIVE = "active"
    PROBATION = "probation"
    SUSPENDED = "suspended"
    GRADUATED = "graduated"
    WITHDRAWN = "withdrawn"
    DEFERRED = "deferred"


class AcademicProgress(Base):
    """Track student academic progress for bursary eligibility."""
    __tablename__ = "academic_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.id"), nullable=False)
    
    # Academic Period
    academic_year = Column(String(20), nullable=False)  # e.g., "2024/2025"
    semester = Column(SQLEnum(Semester), nullable=False)
    year_of_study = Column(Integer, nullable=False)
    
    # Performance Metrics
    gpa = Column(Numeric(3, 2), nullable=True)  # e.g., 3.75
    cgpa = Column(Numeric(3, 2), nullable=True)  # Cumulative GPA
    credits_earned = Column(Integer, nullable=True)
    total_credits_required = Column(Integer, nullable=True)
    
    # Status
    academic_status = Column(SQLEnum(AcademicStatus), default=AcademicStatus.ACTIVE)
    is_on_track = Column(Integer, default=1)  # On track for graduation
    
    # Supporting Documents
    transcript_document = Column(String(500), nullable=True)
    progress_report_document = Column(String(500), nullable=True)
    
    # Verification
    verified_by_institution = Column(Integer, default=0)
    verification_date = Column(DateTime, nullable=True)
    verification_notes = Column(Text, nullable=True)
    
    # Remarks
    comments = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    applicant = relationship("Applicant", back_populates="academic_records")
    
    def __repr__(self):
        return f"<AcademicProgress {self.academic_year} - {self.semester}>"
    
    @property
    def completion_percentage(self):
        """Calculate completion percentage."""
        if self.total_credits_required and self.total_credits_required > 0:
            return (self.credits_earned / self.total_credits_required) * 100
        return 0
