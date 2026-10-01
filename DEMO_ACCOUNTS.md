# Demo Accounts

## Available Demo Accounts

### 1. Administrator Account
- **Email:** admin@smartbursary.com
- **Password:** admin123
- **Role:** ADMINISTRATOR
- **Access:** Full system access - manage users, bursaries, institutions, applications, disbursements, reports, settings

### 2. Applicant Account  
- **Email:** john.doe@student.com
- **Password:** student123
- **Role:** APPLICANT
- **Access:** Apply for bursaries, manage profile, upload documents, track applications

### 3. Reviewer Account
- **Email:** reviewer@smartbursary.com
- **Password:** reviewer123
- **Role:** REVIEWER
- **Access:** Review applications, add comments, approve/reject applications, view applicant profiles

### 4. Finance Officer Account
- **Email:** finance@smartbursary.com
- **Password:** finance123
- **Role:** FINANCE_OFFICER
- **Access:** Process disbursements, manage payments, generate financial reports, track fund allocation

### 5. Institution Officer Account
- **Email:** institution@university.edu
- **Password:** institution123
- **Role:** INSTITUTION_OFFICER
- **Access:** Verify students, submit academic reports, manage institution profile, view institution applications

## Login URL
http://localhost:3001/login

## API Endpoints

### Test Login (PowerShell)
```powershell
# Login as Administrator
$response = curl.exe -X POST "http://localhost:8000/api/v1/auth/login" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=admin@smartbursary.com&password=admin123" | ConvertFrom-Json

$token = $response.access_token

# Get current user info
curl.exe -X GET "http://localhost:8000/api/v1/auth/me" `
  -H "Authorization: Bearer $token"

# Get user permissions
curl.exe -X GET "http://localhost:8000/api/v1/auth/me/permissions" `
  -H "Authorization: Bearer $token"
```

## Notes
- All accounts are active and ready to use
- Each role has different dashboard layouts and permissions
- Passwords are hashed using Argon2 for security
- To create additional accounts, use the registration page at http://localhost:3001/register
