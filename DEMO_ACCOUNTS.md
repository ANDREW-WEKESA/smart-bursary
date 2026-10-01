# Demo Accounts for SmartBursary

## How to Create Demo Accounts

Since we have a bcrypt compatibility issue, please create the demo accounts using the API:

### Method 1: Using Swagger UI (Recommended)

1. Go to http://localhost:8000/docs
2. Find the **POST /api/v1/auth/register** endpoint
3. Click "Try it out"

**Create Admin Account:**
```json
{
  "username": "admin",
  "email": "admin@smartbursary.com",
  "password": "admin123",
  "full_name": "System Administrator",
  "phone_number": "+254700000000"
}
```

Then manually update the database to make this user an admin:
```sql
UPDATE users SET role = 'administrator' WHERE email = 'admin@smartbursary.com';
```

**Create Applicant Account:**
```json
{
  "username": "johndoe",
  "email": "john@demo.com",
  "password": "demo123",
  "full_name": "John Doe",
  "phone_number": "+254712345678"
}
```

### Method 2: Using cURL

**Admin Account:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@smartbursary.com",
    "password": "admin123",
    "full_name": "System Administrator",
    "phone_number": "+254700000000"
  }'
```

**Applicant Account:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@demo.com",
    "password": "demo123",
    "full_name": "John Doe",
    "phone_number": "+254712345678"
  }'
```

---

## Login Credentials

After creating the accounts:

### Admin Account
- **Email**: admin@smartbursary.com
- **Password**: admin123
- **Role**: Administrator (needs manual database update)

### Applicant Account
- **Email**: john@demo.com
- **Password**: demo123
- **Role**: Applicant (default)

---

## Testing the API

1. **Register** using one of the methods above
2. **Login** at POST /api/v1/auth/login
3. Copy the **access_token** from the response
4. Click "Authorize" button in Swagger UI
5. Enter: `Bearer YOUR_ACCESS_TOKEN`
6. Now you can test all authenticated endpoints!

---

## Quick Test Workflow

1. Register applicant account
2. Login and get token
3. Create applicant profile at POST /api/v1/applicants/
4. Browse bursaries at GET /api/v1/bursaries/
5. Create an application at POST /api/v1/applications/
6. Upload documents at POST /api/v1/documents/upload

---

## Making User Admin (Database Update)

To make a user an administrator, you need to update the database directly:

**Using SQLite CLI:**
```bash
cd backend
sqlite3 smartbursary.db
```

Then run:
```sql
UPDATE users SET role = 'administrator' WHERE email = 'admin@smartbursary.com';
SELECT * FROM users WHERE email = 'admin@smartbursary.com';
.quit
```

**Or use a SQLite GUI tool** like:
- DB Browser for SQLite
- SQLiteStudio
- DBeaver

---

## Alternative: Use Registration Endpoint

Since the password hashing is working in the API (FastAPI handles it correctly), you can simply:

1. Register both accounts via the API
2. Update one to admin in the database
3. Both passwords will be properly hashed and work perfectly!

This is actually the recommended approach for demo accounts.
