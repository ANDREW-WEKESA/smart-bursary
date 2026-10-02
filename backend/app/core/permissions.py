"""
Role-based access control and permissions
"""
from typing import List
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.models.user import User, UserRole


class PermissionChecker:
    """Check if user has required permissions"""
    
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: User = Depends(lambda: get_current_user_dependency())) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[role.value for role in self.allowed_roles]}"
            )
        return current_user


def get_current_user_dependency():
    """Dependency function to avoid circular import"""
    from app.api.auth import get_current_user
    return get_current_user


# Permission decorators for common role combinations
require_applicant = PermissionChecker([UserRole.APPLICANT, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN])
require_institution_officer = PermissionChecker([UserRole.INSTITUTION_OFFICER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN])
require_reviewer = PermissionChecker([UserRole.REVIEWER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN])
require_finance_officer = PermissionChecker([UserRole.FINANCE_OFFICER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN])
require_administrator = PermissionChecker([UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN])
require_system_admin = PermissionChecker([UserRole.SYSTEM_ADMIN])


def can_view_application(user: User, application_user_id: int) -> bool:
    """Check if user can view a specific application"""
    # Applicants can only view their own applications
    if user.role == UserRole.APPLICANT:
        return user.id == application_user_id
    
    # Reviewers, Finance Officers, and Admins can view all applications
    if user.role in [UserRole.REVIEWER, UserRole.FINANCE_OFFICER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]:
        return True
    
    # Institution officers can view applications from their institution
    # (This will be implemented when we link users to institutions)
    if user.role == UserRole.INSTITUTION_OFFICER:
        # TODO: Check if application is from user's institution
        return False
    
    return False


def can_edit_application(user: User, application_user_id: int, application_status: str) -> bool:
    """Check if user can edit a specific application"""
    # Only applicants can edit their own applications and only if status is DRAFT or RETURNED
    if user.role == UserRole.APPLICANT:
        if user.id != application_user_id:
            return False
        return application_status in ["DRAFT", "RETURNED"]
    
    # Admins can always edit
    if user.role in [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]:
        return True
    
    return False


def can_review_application(user: User) -> bool:
    """Check if user can review applications"""
    return user.role in [UserRole.REVIEWER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]


def can_process_disbursement(user: User) -> bool:
    """Check if user can process disbursements"""
    return user.role in [UserRole.FINANCE_OFFICER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]


def can_verify_student(user: User) -> bool:
    """Check if user can verify students"""
    return user.role in [UserRole.INSTITUTION_OFFICER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]


def can_manage_users(user: User) -> bool:
    """Check if user can manage other users"""
    return user.role in [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]


def can_manage_bursaries(user: User) -> bool:
    """Check if user can manage bursaries"""
    return user.role in [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]


def can_manage_institutions(user: User) -> bool:
    """Check if user can manage institutions"""
    return user.role in [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]


def can_view_user(current_user: User, target_user_id: int) -> bool:
    """Check if user can view another user's profile"""
    # Users can view their own profile
    if current_user.id == target_user_id:
        return True
    
    # Admins can view all profiles
    if current_user.role in [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]:
        return True
    
    # Reviewers can view applicant profiles
    if current_user.role == UserRole.REVIEWER:
        return True
    
    return False


def get_user_permissions(user: User) -> dict:
    """Get all permissions for a user based on their role"""
    base_permissions = {
        "can_view_own_profile": True,
        "can_edit_own_profile": True,
    }
    
    if user.role == UserRole.APPLICANT:
        return {
            **base_permissions,
            "can_apply_for_bursary": True,
            "can_view_own_applications": True,
            "can_edit_own_applications": True,
            "can_upload_documents": True,
            "can_view_own_disbursements": True,
            "can_track_academic_progress": True,
        }
    
    elif user.role == UserRole.INSTITUTION_OFFICER:
        return {
            **base_permissions,
            "can_verify_students": True,
            "can_submit_academic_reports": True,
            "can_view_institution_applications": True,
            "can_manage_institution_profile": True,
            "can_view_institution_disbursements": True,
        }
    
    elif user.role == UserRole.REVIEWER:
        return {
            **base_permissions,
            "can_view_all_applications": True,
            "can_review_applications": True,
            "can_add_review_comments": True,
            "can_view_applicant_profiles": True,
            "can_view_documents": True,
            "can_generate_review_reports": True,
        }
    
    elif user.role == UserRole.FINANCE_OFFICER:
        return {
            **base_permissions,
            "can_view_approved_applications": True,
            "can_create_disbursement_schedules": True,
            "can_process_disbursements": True,
            "can_view_payment_history": True,
            "can_generate_financial_reports": True,
            "can_track_fund_allocation": True,
        }
    
    elif user.role == UserRole.ADMINISTRATOR:
        return {
            **base_permissions,
            "can_manage_users": True,
            "can_manage_bursaries": True,
            "can_manage_institutions": True,
            "can_view_all_applications": True,
            "can_review_applications": True,
            "can_process_disbursements": True,
            "can_verify_students": True,
            "can_view_system_analytics": True,
            "can_configure_system": True,
            "can_view_audit_logs": True,
            "can_generate_all_reports": True,
        }
    
    elif user.role == UserRole.SYSTEM_ADMIN:
        return {
            **base_permissions,
            "can_manage_users": True,
            "can_manage_bursaries": True,
            "can_manage_institutions": True,
            "can_view_all_applications": True,
            "can_review_applications": True,
            "can_process_disbursements": True,
            "can_verify_students": True,
            "can_view_system_analytics": True,
            "can_configure_system": True,
            "can_view_audit_logs": True,
            "can_generate_all_reports": True,
            "can_manage_database": True,
            "can_manage_api_access": True,
            "can_manage_security_settings": True,
        }
    
    return base_permissions
