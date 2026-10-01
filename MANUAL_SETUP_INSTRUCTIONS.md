# Manual Setup Instructions

Due to Application Control policies on your system, automated installation is blocked. Follow these manual steps:

## Backend Setup (Python/FastAPI)

### Step 1: Install Dependencies Manually

Open a **new PowerShell window** (not in VS Code) and run:

```powershell
cd "c:\dev\smart bursary\backend"
python -m pip install fastapi uvicorn[standard] sqlalchemy pydantic pydantic-settings python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv email-validator
```

**Wait for it to complete** (may take 5-10 minutes on first install)

### Step 2: Verify Installation

```powershell
python -c "import fastapi; print('FastAPI:', fastapi.__version__)"
python -c "import sqlalchemy; print('SQLAlchemy:', sqlalchemy.__version__)"
```

If these work, you're ready!

### Step 3: Start Backend Server

```powershell
cd "c:\dev\smart bursary\backend"
python run.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 4: Test the API

Open browser: **http://localhost:8000/docs**

You should see the Swagger UI!

---

## Frontend Setup (Node.js/Next.js)

### Step 1: Install Dependencies

Open a **new PowerShell window** and run:

```powershell
cd "c:\dev\smart bursary\frontend"
npm install
```

This should work fine (npm usually isn't blocked)

### Step 2: Create Environment File

```powershell
cd "c:\dev\smart bursary\frontend"
copy .env.local.example .env.local
```

### Step 3: Start Frontend Server

```powershell
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000
```

### Step 4: View the Application

Open browser: **http://localhost:3000**

You should see the SmartBursary landing page!

---

## Quick Test Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:8000/docs
- [ ] Can access http://localhost:3000
- [ ] Can register a user via Swagger UI
- [ ] Can login and get token

---

## Troubleshooting

### Python packages won't install

Try installing one at a time:
```powershell
python -m pip install fastapi
python -m pip install uvicorn
# etc...
```

### Port already in use

**Backend (8000):**
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend (3000):**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found errors

Install the specific missing module:
```powershell
python -m pip install <module-name>
```

---

## Alternative: Use Docker (If available)

If Docker is available on your system, I can create Dockerfiles for easier setup!

Let me know if you want Docker setup instead.
