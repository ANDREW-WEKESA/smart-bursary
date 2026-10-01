# SmartBursary Database Schema

## Entity Relationship Overview

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       │
       │ 1:1
       │
┌──────┴──────────┐
│   Applicants    │◄───────────────┐
└──────┬──────────┘                │
       │                           │
       │ 1:N                       │ N:1
       ├───────────┐               │
       │           │               │
┌──────▼──────┐ ┌──▼─────────┐ ┌──┴────────────┐
│  Guardians  │ │  Academic  │ │ Institutions  │
│             │ │  Progress  │ └───────────────┘
└─────────────┘ └────────────┘         │
                                       │ 1:N
                                       │
┌──────────────┐                 ┌─────▼────────┐
│  Applications│◄────────────────┤   Bursaries  │
└──────┬───────┘                 └──────────────┘
       │
       │ 1:N
       │
┌──────▼───────────┐
│  Disbursements   │
└──────────────────┘
```

## Tables

### 1. users
**Purpose:** Authentication and basic user information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique user ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| phone | VARCHAR(20) | | Phone number |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| role | ENUM | NOT NULL | applicant/reviewer/administrator/system_admin |
| is_active | INTEGER | DEFAULT 1 | Account status |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

### 2. applicants
**Purpose:** Extended applicant profile information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique applicant ID |
| user_id | INTEGER | FOREIGN KEY → users.id, UNIQUE | Link to user account |
| id_number | VARCHAR(50) | UNIQUE, NOT NULL | National ID number |
| date_of_birth | DATETIME | | Date of birth |
| gender | VARCHAR(20) | | Gender |
| nationality | VARCHAR(100) | | Nationality |
| county | VARCHAR(100) | | County of residence |
| sub_county | VARCHAR(100) | | Sub-county |
| address | TEXT | | Physical address |
| student_number | VARCHAR(50) | UNIQUE | Student registration number |
| institution_id | INTEGER | FOREIGN KEY → institutions.id | Educational institution |
| course | VARCHAR(255) | | Course/program of study |
| education_level | ENUM | | certificate/diploma/undergraduate/postgraduate |
| year_of_study | ENUM | | year_1 to year_6 |
| expected_graduation | DATETIME | | Expected graduation date |
| household_income | NUMERIC(12,2) | | Total household monthly income |
| household_size | INTEGER | | Number of household members |
| other_funding_sources | TEXT | | Other scholarships/funding |
| emergency_contact_name | VARCHAR(255) | | Emergency contact |
| emergency_contact_phone | VARCHAR(20) | | Emergency phone |
| emergency_contact_relationship | VARCHAR(100) | | Relationship to emergency contact |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

### 3. guardians
**Purpose:** Parent/guardian information for financial assessment

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique guardian ID |
| applicant_id | INTEGER | FOREIGN KEY → applicants.id, NOT NULL | Link to applicant |
| full_name | VARCHAR(255) | NOT NULL | Guardian full name |
| id_number | VARCHAR(50) | | Guardian ID number |
| relationship | VARCHAR(100) | NOT NULL | Father/Mother/Guardian/etc. |
| phone | VARCHAR(20) | | Phone number |
| email | VARCHAR(255) | | Email address |
| occupation | VARCHAR(255) | | Current occupation |
| employer | VARCHAR(255) | | Employer name |
| monthly_income | NUMERIC(12,2) | | Monthly income |
| address | TEXT | | Physical address |
| county | VARCHAR(100) | | County |
| is_primary | INTEGER | DEFAULT 0 | Primary guardian flag |
| is_alive | INTEGER | DEFAULT 1 | Living status |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

### 4. institutions
**Purpose:** Verified educational institutions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique institution ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Institution name |
| code | VARCHAR(50) | UNIQUE | Institution code |
| institution_type | ENUM | NOT NULL | university/college/polytechnic/technical/vocational |
| email | VARCHAR(255) | | Contact email |
| phone | VARCHAR(20) | | Contact phone |
| website | VARCHAR(255) | | Website URL |
| address | TEXT | | Physical address |
| county | VARCHAR(100) | | County |
| town | VARCHAR(100) | | Town/city |
| verification_status | ENUM | DEFAULT pending | pending/verified/rejected/suspended |
| verification_document | VARCHAR(500) | | Path to verification document |
| verified_at | DATETIME | | Verification date |
| verified_by | INTEGER | | Admin user ID who verified |
| accreditation_number | VARCHAR(100) | | Accreditation number |
| accreditation_body | VARCHAR(255) | | Accrediting body |
| is_active | INTEGER | DEFAULT 1 | Active status |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

### 5. academic_progress
**Purpose:** Track student academic performance

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique record ID |
| applicant_id | INTEGER | FOREIGN KEY → applicants.id, NOT NULL | Link to applicant |
| academic_year | VARCHAR(20) | NOT NULL | e.g., "2024/2025" |
| semester | ENUM | NOT NULL | semester_1/semester_2/semester_3 |
| year_of_study | INTEGER | NOT NULL | Current year (1-6) |
| gpa | NUMERIC(3,2) | | Grade Point Average |
| cgpa | NUMERIC(3,2) | | Cumulative GPA |
| credits_earned | INTEGER | | Credits completed |
| total_credits_required | INTEGER | | Total credits needed |
| academic_status | ENUM | DEFAULT active | active/probation/suspended/graduated/withdrawn/deferred |
| is_on_track | INTEGER | DEFAULT 1 | On track for graduation |
| transcript_document | VARCHAR(500) | | Path to transcript |
| progress_report_document | VARCHAR(500) | | Path to progress report |
| verified_by_institution | INTEGER | DEFAULT 0 | Institution verification flag |
| verification_date | DATETIME | | Verification date |
| verification_notes | TEXT | | Verification notes |
| comments | TEXT | | Additional comments |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

**Calculated Field:**
- `completion_percentage`: (credits_earned / total_credits_required) * 100

---

### 6. bursaries
**Purpose:** Bursary programs/opportunities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique bursary ID |
| name | VARCHAR(255) | NOT NULL | Bursary program name |
| description | TEXT | | Detailed description |
| total_budget | NUMERIC(15,2) | | Total budget available |
| amount_per_student | NUMERIC(12,2) | | Fixed amount per student |
| min_amount | NUMERIC(12,2) | | Minimum award amount |
| max_amount | NUMERIC(12,2) | | Maximum award amount |
| eligibility_criteria | TEXT | | JSON eligibility criteria |
| required_documents | TEXT | | JSON list of required docs |
| min_gpa | NUMERIC(3,2) | | Minimum GPA requirement |
| target_education_levels | VARCHAR(255) | | Comma-separated levels |
| target_institutions | TEXT | | JSON list or comma-separated |
| application_start_date | DATETIME | | Application period start |
| application_deadline | DATETIME | NOT NULL | Application deadline |
| disbursement_start_date | DATETIME | | When payments begin |
| status | ENUM | DEFAULT draft | draft/active/closed/suspended |
| total_applications | INTEGER | DEFAULT 0 | Application count |
| total_approved | INTEGER | DEFAULT 0 | Approved count |
| total_disbursed | NUMERIC(15,2) | DEFAULT 0 | Total amount disbursed |
| contact_email | VARCHAR(255) | | Contact email |
| contact_phone | VARCHAR(20) | | Contact phone |
| created_by | INTEGER | | Admin user ID |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

### 7. applications
**Purpose:** Bursary applications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique application ID |
| applicant_id | INTEGER | FOREIGN KEY → applicants.id, NOT NULL | Link to applicant |
| bursary_id | INTEGER | FOREIGN KEY → bursaries.id, NOT NULL | Link to bursary |
| application_number | VARCHAR(50) | UNIQUE, NOT NULL | Reference number |
| amount_requested | NUMERIC(12,2) | | Requested amount |
| reason_for_application | TEXT | | Application reason/statement |
| status | ENUM | DEFAULT draft | draft/submitted/under_review/verification/additional_info_required/committee_review/approved/rejected/disbursed/cancelled |
| submission_date | DATETIME | | Submission timestamp |
| review_start_date | DATETIME | | Review start timestamp |
| decision_date | DATETIME | | Decision timestamp |
| priority_score | NUMERIC(5,2) | | AI priority score (0-100) |
| financial_need_score | NUMERIC(5,2) | | Financial need score |
| duplicate_risk_flag | INTEGER | DEFAULT 0 | Duplicate detection flag |
| ai_analysis_data | TEXT | | JSON AI analysis results |
| assigned_reviewer_id | INTEGER | FOREIGN KEY → users.id | Assigned reviewer |
| reviewer_score | NUMERIC(5,2) | | Reviewer score |
| reviewer_recommendation | VARCHAR(50) | | Approve/Reject/etc. |
| reviewer_comments | TEXT | | Reviewer comments |
| decision_made_by | INTEGER | FOREIGN KEY → users.id | Decision maker |
| decision_reason | TEXT | | Decision justification |
| approved_amount | NUMERIC(12,2) | | Approved amount |
| additional_info_requested | TEXT | | Info requested from applicant |
| additional_info_provided | TEXT | | Info provided by applicant |
| additional_info_date | DATETIME | | Info provided date |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

### 8. disbursements
**Purpose:** Track payment disbursements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique disbursement ID |
| application_id | INTEGER | FOREIGN KEY → applications.id, NOT NULL | Link to application |
| amount | NUMERIC(12,2) | NOT NULL | Payment amount |
| currency | VARCHAR(10) | DEFAULT 'KES' | Currency code |
| disbursement_method | ENUM | NOT NULL | bank_transfer/mobile_money/cheque/direct_to_institution |
| recipient_name | VARCHAR(255) | NOT NULL | Recipient name |
| recipient_account | VARCHAR(100) | | Account number or mobile |
| recipient_bank | VARCHAR(255) | | Bank name |
| institution_id | INTEGER | FOREIGN KEY → institutions.id | For direct payments |
| status | ENUM | DEFAULT pending | pending/approved/processing/completed/failed/cancelled/reversed |
| reference_number | VARCHAR(100) | UNIQUE | Payment reference |
| transaction_id | VARCHAR(255) | | External transaction ID |
| scheduled_date | DATETIME | | Scheduled payment date |
| processed_date | DATETIME | | Processing start date |
| completed_date | DATETIME | | Completion date |
| approved_by | INTEGER | FOREIGN KEY → users.id | Approver user ID |
| approved_at | DATETIME | | Approval timestamp |
| approval_notes | TEXT | | Approval notes |
| failure_reason | TEXT | | Failure reason if failed |
| cancelled_by | INTEGER | FOREIGN KEY → users.id | Canceller user ID |
| cancelled_at | DATETIME | | Cancellation timestamp |
| cancellation_reason | TEXT | | Cancellation reason |
| receipt_document | VARCHAR(500) | | Path to receipt |
| payment_proof | VARCHAR(500) | | Path to payment proof |
| notes | TEXT | | Additional notes |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

---

## Indexes

### Primary Indexes (Already defined):
- All `id` columns are PRIMARY KEYs
- Unique constraints on: `users.email`, `applicants.id_number`, `applicants.student_number`, `institutions.name`, `institutions.code`, `applications.application_number`, `disbursements.reference_number`

### Recommended Additional Indexes:
```sql
-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Applicants
CREATE INDEX idx_applicants_institution ON applicants(institution_id);
CREATE INDEX idx_applicants_education_level ON applicants(education_level);

-- Applications
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_bursary ON applications(bursary_id);
CREATE INDEX idx_applications_submission_date ON applications(submission_date);

-- Disbursements
CREATE INDEX idx_disbursements_status ON disbursements(status);
CREATE INDEX idx_disbursements_application ON disbursements(application_id);
CREATE INDEX idx_disbursements_method ON disbursements(disbursement_method);

-- Academic Progress
CREATE INDEX idx_academic_applicant ON academic_progress(applicant_id);
CREATE INDEX idx_academic_year ON academic_progress(academic_year);

-- Institutions
CREATE INDEX idx_institutions_status ON institutions(verification_status);
CREATE INDEX idx_institutions_type ON institutions(institution_type);
```

---

## Relationships Summary

### One-to-One:
- `users` ↔ `applicants` (One user has one applicant profile)

### One-to-Many:
- `users` → `applications` (as reviewer)
- `users` → `applications` (as decision maker)
- `users` → `disbursements` (as approver)
- `applicants` → `guardians` (One applicant can have multiple guardians)
- `applicants` → `academic_progress` (One applicant has multiple progress records)
- `applicants` → `applications` (One applicant can apply multiple times)
- `institutions` → `applicants` (One institution has many students)
- `institutions` → `disbursements` (One institution receives many payments)
- `bursaries` → `applications` (One bursary has many applications)
- `applications` → `disbursements` (One application can have multiple disbursements)

---

## Data Flow Example

### Typical Application Lifecycle:

```
1. User Registration
   ↓
   users table → Create record
   
2. Profile Completion
   ↓
   applicants table → Create profile
   guardians table → Add parents/guardians
   
3. Institution Selection
   ↓
   institutions table → Link to verified institution
   
4. Academic Records
   ↓
   academic_progress table → Upload transcripts
   
5. Application Submission
   ↓
   applications table → Create application
   
6. Review Process
   ↓
   applications table → Update status, scores, comments
   
7. Approval
   ↓
   applications table → Mark approved, set amount
   
8. Disbursement Creation
   ↓
   disbursements table → Create payment record
   
9. Payment Processing
   ↓
   disbursements table → Update status to completed
   
10. Next Semester
    ↓
    academic_progress table → Update performance
    ↓
    Eligibility check for renewal
```

---

## Security Considerations

1. **Personal Data**: ID numbers, phone, email, address - encrypt at rest
2. **Financial Data**: Income, amounts - restrict access by role
3. **Academic Records**: Transcripts - require institution verification
4. **Payment Data**: Account numbers - PCI compliance if storing cards
5. **Documents**: Store in secure location with access controls

---

## Backup and Archival

- **Daily Backups**: All tables
- **Archival**: Completed applications > 5 years
- **Retention**: Keep disbursement records indefinitely for audits
- **GDPR Compliance**: Allow data export and deletion on request

---

*Last Updated: 2024*
*Database Engine: PostgreSQL 14+*
*ORM: SQLAlchemy 2.0*
