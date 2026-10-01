# Start Backend - Quick Guide

## Option 1: If pip works (Standard method)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## Option 2: Without venv (If Application Control blocks pip)

```bash
cd backend
python -m pip install --user fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic pydantic-settings python-jose passlib python-multipart python-dotenv email-validator
python run.py
```

## Option 3: Use system Python directly

```bash
cd backend
python run.py
```

**Note:** Make sure `.env` file exists in the backend folder!

## Check if it's running:

Open browser: http://localhost:8000/docs

You should see the Swagger UI with all API endpoints!

## Common Issues:

### Issue: ModuleNotFoundError
**Solution:** Install the missing module:
```bash
python -m pip install --user <module-name>
```

### Issue: Database error
**Solution:** The SQLite database will be created automatically. Just make sure `.env` has:
```
DATABASE_URL=sqlite:///./smartbursary.db
```

### Issue: Port 8000 already in use
**Solution:** Change port in run.py or kill the process using port 8000
