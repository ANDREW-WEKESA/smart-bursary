# Roles and Permissions

## User Roles

### 1. APPLICANT (Default User)
**Description:** Students/individuals applying for bursaries

**Permissions:**
- View own profile
- Edit own profile (personal info, guardian details)
- View available bursaries
- Apply for bursaries
- View own applications and their status
- Upload required documents
- View disbursement history (own)
- Track academic progress
- Receive notifications

**Dashboard Features:**
- Application status overview
- Available bursaries
- Document upload status
- Disbursement timeline
- Profile completion progress

### 2. INSTITUTION_OFFICER
**Description:** School/College/University representatives

**Permissions:**
- View students from their institution
- Verify student enrollment
- Submit academic progress reports
- View applications from their institution
- Upload institutional documents
- Manage institution profile
- View disbursements to institution

**Dashboard Features:**
- Student verification queue
- Academic progress submission
- Institution statistics
- Pending verifications
- Disbursement records

### 3. REVIEWER
**Description:** Bursary application reviewers

**Permissions:**
- View all applications
- Review applications (approve/reject/request more info)
- Add review comments
- View applicant profiles (read-only)
- View supporting documents
- Generate review reports
- Assign applications to self

**Dashboard Features:**
- Application review queue
- Applications by status
- Review statistics
- Flagged applications
- Review history

### 4. FINANCE_OFFICER
**Description:** Handles disbursements and financial matters

**Permissions:**
- View approved applications
- Create disbursement schedules
- Process disbursements
- View payment history
- Generate financial reports
- Track fund allocation
- Manage payment methods

**Dashboard Features:**
- Disbursement queue
- Payment processing
- Financial reports
- Fund allocation overview
- Payment history
- Audit logs

### 5. ADMINISTRATOR
**Description:** System administrators with full access

**Permissions:**
- All permissions from other roles
- Manage users (create, edit, deactivate)
- Manage bursaries (create, edit, delete)
- Manage institutions
- View system analytics
- Configure system settings
- Manage user roles
- View audit logs
- Generate all reports

**Dashboard Features:**
- System overview
- User management
- Bursary management
- Institution management
- System statistics
- Analytics dashboard
- Audit logs

### 6. SYSTEM_ADMIN
**Description:** Technical administrators

**Permissions:**
- All ADMINISTRATOR permissions
- Database management
- System configuration
- API access management
- Security settings
- Backup/restore operations

**Dashboard Features:**
- System health monitoring
- Database status
- API usage statistics
- Security logs
- System configuration

## Permission Matrix

| Action | Applicant | Institution Officer | Reviewer | Finance Officer | Administrator | System Admin |
|--------|-----------|-------------------|----------|----------------|---------------|--------------|
| Apply for bursary | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View own applications | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View all applications | ❌ | 🟡 (own institution) | ✅ | ✅ | ✅ | ✅ |
| Review applications | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Process disbursements | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Verify students | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Create bursaries | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View reports | 🟡 (own) | 🟡 (institution) | ✅ | ✅ | ✅ | ✅ |
| System config | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Navigation Structure

### Applicant Navigation
- Dashboard
- My Profile
- Available Bursaries
- My Applications
- Documents
- Disbursements
- Help

### Institution Officer Navigation
- Dashboard
- Institution Profile
- Student Verification
- Academic Reports
- Disbursements
- Help

### Reviewer Navigation
- Dashboard
- Review Queue
- All Applications
- Reports
- Help

### Finance Officer Navigation
- Dashboard
- Disbursement Queue
- Process Payments
- Financial Reports
- Payment History
- Help

### Administrator Navigation
- Dashboard
- Users Management
- Bursaries Management
- Institutions Management
- Applications Overview
- Disbursements
- Reports
- System Settings

### System Admin Navigation
- All Administrator features
- System Health
- Database Management
- API Management
- Security Settings
- Audit Logs
