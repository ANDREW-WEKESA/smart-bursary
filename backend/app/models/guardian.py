from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Guardian(Base):
    """Parent/Guardian information for applicants."""
    __tablename__ = "guardians"
    
    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.id"), nullable=False)
    
    # Guardian Information
    full_name = Column(String(255), nullable=False)
    id_number = Column(String(50), nullable=True)
    guardian_relationship = Column(String(100), nullable=False)  # Father, Mother, Guardian, etc.
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Occupation and Financial
    occupation = Column(String(255), nullable=True)
    employer = Column(String(255), nullable=True)
    monthly_income = Column(Numeric(12, 2), nullable=True)
    
    # Address
    address = Column(Text, nullable=True)
    county = Column(String(100), nullable=True)
    
    # Status
    is_primary = Column(Integer, default=0)  # Primary guardian/parent
    is_alive = Column(Integer, default=1)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    applicant = relationship("Applicant", back_populates="guardians")
    
    def __repr__(self):
        return f"<Guardian {self.full_name} - {self.guardian_relationship}>"
