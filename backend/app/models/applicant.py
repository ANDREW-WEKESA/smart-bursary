from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class EducationLevel(str, enum.Enum):
    """Education levels."""
    CERTIFICATE = "certificate"
    DIPLOMA = "diploma"
    UNDERGRADUATE = "undergraduate"
    POSTGRADUATE = "postgraduate"


class StudyYear(str, enum.Enum):
    """Current year of study."""
    YEAR_1 = "year_1"
    YEAR_2 = "year_2"
    YEAR_3 = "year_3"
    YEAR_4 = "year_4"
    YEAR_5 = "year_5"
    YEAR_6 = "year_6"


class Applicant(Base):
    """Extended applicant profile information."""
    __tablename__ = "applicants"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Personal Information
    id_number = Column(String(50), unique=True, nullable=False, index=True)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(String(20), nullable=True)
    nationality = Column(String(100), nullable=True)
    county = Column(String(100), nullable=True)
    constituency = Column(String(100), nullable=True)
    sub_county = Column(String(100), nullable=True)
    ward = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    
    # Educational Information
    student_number = Column(String(50), unique=True, nullable=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    course = Column(String(255), nullable=True)
    education_level = Column(SQLEnum(EducationLevel), nullable=True)
    year_of_study = Column(SQLEnum(StudyYear), nullable=True)
    expected_graduation = Column(DateTime, nullable=True)
    
    # Financial Information
    household_income = Column(Numeric(12, 2), nullable=True)
    household_size = Column(Integer, nullable=True)
    other_funding_sources = Column(Text, nullable=True)
    
    # Emergency Contact
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)
    emergency_contact_relationship = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="applicant_profile")
    institution = relationship("Institution", backref="students")
    guardians = relationship("Guardian", back_populates="applicant", cascade="all, delete-orphan")
    academic_records = relationship("AcademicProgress", back_populates="applicant", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Applicant {self.id_number}>"
