# SmartBursary API Documentation

## Current Status

Both servers are running:
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3001

## Available API Endpoints

### Authentication (`/api/v1`)

#### POST `/auth/register`
Register a new user account
- **Body**: `{ username, email, password, full_name, phone_number }`
- **Returns**: User object with access token

#### POST `/auth/login`
Login with email and password
- **Body**: `{ email, password }`
- **Returns**: Access token and user details

#### GET `/auth/me`
Get current authenticated user
- **Headers**: `Authorization: Bearer {token}`
- **Returns**: Current user details

---

### Applicants (`/api/v1/applicants`)

#### POST `/applicants/`
Create applicant profile for current user
- **Auth Required**: Yes
- **Body**: All applicant details (name, DOB, gender, national_id, location, etc.)
- **Returns**: Created applicant profile

#### GET `/applicants/me`
Get current user's applicant profile
- **Auth Required**: Yes
- **Returns**: Applicant profile

#### GET `/applicants/{applicant_id}`
Get specific applicant by ID
- **Auth Required**: Yes (own profile or admin)
- **Returns**: Applicant profile

#### GET `/applicants/`
List all applicants
- **Auth Required**: Admin only
- **Query Params**: `skip`, `limit`
- **Returns**: List of applicants

#### PUT `/applicants/{applicant_id}`
Update applicant profile
- **Auth Required**: Yes (own profile or admin)
- **Body**: Fields to update
- **Returns**: Updated applicant profile

#### DELETE `/applicants/{applicant_id}`
Delete applicant profile
- **Auth Required**: Admin only

#### POST `/applicants/{applicant_id}/verify`
Verify an applicant profile
- **Auth Required**: Admin only
- **Returns**: Updated applicant with verified status

---

### Guardians (`/api/v1/guardians`)

#### POST `/guardians/`
Create guardian for an applicant
- **Auth Required**: Yes (own profile or admin)
- **Body**: Guardian details (name, relationship, contact, income, etc.)
- **Returns**: Created guardian

#### GET `/guardians/applicant/{applicant_id}`
Get all guardians for an applicant
- **Auth Required**: Yes (own profile or admin)
- **Returns**: List of guardians

#### GET `/guardians/{guardian_id}`
Get specific guardian
- **Auth Required**: Yes (own profile or admin)
- **Returns**: Guardian details

#### PUT `/guardians/{guardian_id}`
Update guardian information
- **Auth Required**: Yes (own profile or admin)
- **Body**: Fields to update
- **Returns**: Updated guardian

#### DELETE `/guardians/{guardian_id}`
Delete a guardian
- **Auth Required**: Yes (own profile or admin)

---

### Academic Progress (`/api/v1/academic-progress`)

#### POST `/academic-progress/`
Create academic progress record
- **Auth Required**: Yes (own profile or admin)
- **Body**: Institution, course, year, semester, GPA, credits, status, etc.
- **Returns**: Created progress record

#### GET `/academic-progress/applicant/{applicant_id}`
Get all academic records for an applicant
- **Auth Required**: Yes (own profile or admin)
- **Returns**: List of academic progress records

#### GET `/academic-progress/{progress_id}`
Get specific academic progress record
- **Auth Required**: Yes (own profile or admin)
- **Returns**: Progress record details

#### PUT `/academic-progress/{progress_id}`
Update academic progress record
- **Auth Required**: Yes (own profile or admin)
- **Body**: Fields to update
- **Returns**: Updated progress record

#### DELETE `/academic-progress/{progress_id}`
Delete academic progress record
- **Auth Required**: Yes (own profile or admin)

---

### Bursaries (`/api/v1/bursaries`)

#### POST `/bursaries/`
Create a new bursary
- **Auth Required**: Admin only
- **Body**: Bursary details (name, type, amount, slots, deadline, criteria, etc.)
- **Returns**: Created bursary

#### GET `/bursaries/`
List all bursaries
- **Query Params**: `skip`, `limit`, `status_filter`, `bursary_type`
- **Returns**: List of bursaries

#### GET `/bursaries/active`
List active bursaries with upcoming deadlines
- **Query Params**: `skip`, `limit`
- **Returns**: List of open bursaries

#### GET `/bursaries/{bursary_id}`
Get specific bursary details
- **Returns**: Bursary details

#### PUT `/bursaries/{bursary_id}`
Update a bursary
- **Auth Required**: Admin only
- **Body**: Fields to update
- **Returns**: Updated bursary

#### DELETE `/bursaries/{bursary_id}`
Delete a bursary
- **Auth Required**: Admin only

#### POST `/bursaries/{bursary_id}/open`
Open a bursary for applications
- **Auth Required**: Admin only
- **Returns**: Updated bursary with 'open' status

#### POST `/bursaries/{bursary_id}/close`
Close a bursary for applications
- **Auth Required**: Admin only
- **Returns**: Updated bursary with 'closed' status

---

### Institutions (`/api/v1/institutions`)

#### POST `/institutions/`
Create a new institution
- **Auth Required**: Admin only
- **Body**: Institution details (name, type, code, location, etc.)
- **Returns**: Created institution

#### GET `/institutions/`
List all institutions
- **Query Params**: `skip`, `limit`, `institution_type`, `verified_only`
- **Returns**: List of institutions

#### GET `/institutions/{institution_id}`
Get specific institution
- **Returns**: Institution details

#### PUT `/institutions/{institution_id}`
Update institution
- **Auth Required**: Admin only
- **Body**: Fields to update
- **Returns**: Updated institution

#### DELETE `/institutions/{institution_id}`
Delete institution
- **Auth Required**: Admin only

#### POST `/institutions/{institution_id}/verify`
Verify an institution
- **Auth Required**: Admin only
- **Returns**: Verified institution

---

## Data Models

### Applicant
- Personal details (name, DOB, gender, national_id)
- Contact information (phone, email)
- Location (county, sub-county, ward, village)
- Disability information
- Verification status

### Guardian
- Personal details (name, national_id)
- Relationship to applicant
- Contact information
- Employment and income details

### Academic Progress
- Institution and course details
- Academic year and semester
- GPA and CGPA
- Credits earned
- Attendance percentage
- Academic status

### Bursary
- Name and description
- Type (merit, need-based, sports, disability, etc.)
- Amount and total slots
- Application deadline
- Eligibility criteria
- Required documents
- Status (draft, open, closed, suspended)

### Institution
- Name and code
- Type (university, college, TVET)
- Contact information
- Location
- Accreditation status
- Verification status

---

## Next Steps

### Immediate (Priority 1)
1. **Application Management API** - Submit, review, and approve bursary applications
2. **Frontend Components** - Build UI for all API endpoints
3. **File Upload** - Document upload system for applications

### Short Term (Priority 2)
1. **Disbursement Tracking** - Payment management system
2. **Notifications** - Email/SMS for application updates
3. **Dashboard** - Admin and applicant dashboards

### Medium Term (Priority 3)
1. **Reports & Analytics** - Application statistics and insights
2. **Document Verification** - Automated document checking
3. **Payment Integration** - M-Pesa and bank integration

---

## Testing the API

Visit http://localhost:8000/docs to access the interactive Swagger documentation where you can:
- Test all endpoints
- View request/response schemas
- Try authentication flows
- See all available parameters

## Database

Currently using SQLite database at: `backend/smartbursary.db`

All tables are automatically created on server start.
