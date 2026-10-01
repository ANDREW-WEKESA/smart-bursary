from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class AcademicYearEnum(str, Enum):
    YEAR_1 = "Year 1"
    YEAR_2 = "Year 2"
    YEAR_3 = "Year 3"
    YEAR_4 = "Year 4"
    YEAR_5 = "Year 5"
    YEAR_6 = "Year 6"


class SemesterEnum(str, Enum):
    SEMESTER_1 = "Semester 1"
    SEMESTER_2 = "Semester 2"
    SEMESTER_3 = "Semester 3"


class ProgressStatusEnum(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DEFERRED = "deferred"
    DISCONTINUED = "discontinued"


class AcademicProgressBase(BaseModel):
    institution_id: int
    course_name: str = Field(..., min_length=1, max_length=200)
    course_code: Optional[str] = Field(None, max_length=50)
    academic_year: AcademicYearEnum
    semester: SemesterEnum
    year_of_study: int = Field(..., ge=1, le=6)
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    cgpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    credits_earned: Optional[int] = Field(None, ge=0)
    total_credits: Optional[int] = Field(None, ge=0)
    attendance_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    status: ProgressStatusEnum = ProgressStatusEnum.IN_PROGRESS
    start_date: date
    expected_completion_date: date
    remarks: Optional[str] = Field(None, max_length=500)


class AcademicProgressCreate(AcademicProgressBase):
    applicant_id: int


class AcademicProgressUpdate(BaseModel):
    institution_id: Optional[int] = None
    course_name: Optional[str] = Field(None, min_length=1, max_length=200)
    course_code: Optional[str] = Field(None, max_length=50)
    academic_year: Optional[AcademicYearEnum] = None
    semester: Optional[SemesterEnum] = None
    year_of_study: Optional[int] = Field(None, ge=1, le=6)
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    cgpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    credits_earned: Optional[int] = Field(None, ge=0)
    total_credits: Optional[int] = Field(None, ge=0)
    attendance_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    status: Optional[ProgressStatusEnum] = None
    start_date: Optional[date] = None
    expected_completion_date: Optional[date] = None
    remarks: Optional[str] = Field(None, max_length=500)


class AcademicProgressResponse(AcademicProgressBase):
    id: int
    applicant_id: int

    class Config:
        from_attributes = True
