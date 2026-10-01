from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class InstitutionType(str, enum.Enum):
    """Types of educational institutions."""
    UNIVERSITY = "university"
    COLLEGE = "college"
    POLYTECHNIC = "polytechnic"
    TECHNICAL = "technical"
    VOCATIONAL = "vocational"


class VerificationStatus(str, enum.Enum):
    """Institution verification status."""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class Institution(Base):
    """Educational institutions with verification."""
    __tablename__ = "institutions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String(255), nullable=False, unique=True, index=True)
    code = Column(String(50), unique=True, nullable=True, index=True)
    institution_type = Column(SQLEnum(InstitutionType), nullable=False)
    
    # Contact Information
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    website = Column(String(255), nullable=True)
    
    # Address
    address = Column(Text, nullable=True)
    county = Column(String(100), nullable=True)
    town = Column(String(100), nullable=True)
    
    # Verification
    verification_status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.PENDING)
    verification_document = Column(String(500), nullable=True)  # Path to verification doc
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(Integer, nullable=True)  # Admin user ID
    
    # Accreditation
    accreditation_number = Column(String(100), nullable=True)
    accreditation_body = Column(String(255), nullable=True)
    
    # Status
    is_active = Column(Integer, default=1)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Institution {self.name}>"
