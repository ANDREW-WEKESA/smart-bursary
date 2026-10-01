# Backend Setup Guide

## Prerequisites

- Python 3.10 or higher
- PostgreSQL 14 or higher
- pip (Python package manager)

## Installation Steps

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Database

**Option A: Use PostgreSQL**

1. Install PostgreSQL if not already installed
2. Create database:
```sql
CREATE DATABASE smartbursary;
```

3. Note your database credentials

**Option B: Use SQLite (for quick testing)**

Change the `DATABASE_URL` in `.env` to:
```
DATABASE_URL=sqlite:///./smartbursary.db
```

### 5. Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` and update with your values:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/smartbursary
SECRET_KEY=generate-a-secure-random-key-here
```

To generate a secure secret key, run:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 6. Run the Application

```bash
python run.py
```

The API will be available at: http://localhost:8000

### 7. Access API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing the API

### Register a User

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "securepassword123"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=securepassword123"
```

## Common Issues

### Issue: Database connection error

**Solution:** Check that PostgreSQL is running and credentials in `.env` are correct

### Issue: Module not found

**Solution:** Make sure virtual environment is activated and dependencies are installed

### Issue: Port 8000 already in use

**Solution:** Either stop the process using port 8000 or change the port in `run.py`

## Next Steps

- Add more API endpoints for applications, bursaries, etc.
- Implement file upload functionality
- Add database migrations with Alembic
- Write tests
