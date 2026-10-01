# SmartBursary Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Check Prerequisites

Make sure you have installed:
- ✅ Python 3.10+ ([Download](https://www.python.org/downloads/))
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Edit .env and add your database URL and secret key
# For quick testing, you can use SQLite:
# DATABASE_URL=sqlite:///./smartbursary.db
```

**Generate a secret key:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy this into your `.env` file as `SECRET_KEY`

**Run the backend:**
```bash
python run.py
```

✅ Backend running at: http://localhost:8000
📚 API docs at: http://localhost:8000/docs

### Step 3: Setup Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Run the frontend
npm run dev
```

✅ Frontend running at: http://localhost:3000

### Step 4: Test the Application

1. **Open your browser:** http://localhost:3000
2. **Click "Apply Now"** to register as an applicant
3. **Test the API:** http://localhost:8000/docs

## 🎯 What You Have Now

✅ **Working Backend API** with:
- User registration and authentication
- JWT token-based security
- Database models
- API documentation (Swagger)

✅ **Working Frontend** with:
- Modern React + Next.js setup
- Tailwind CSS styling
- API client configured
- Responsive landing page

## 📁 Project Structure

```
smart-bursary/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Config, database, security
│   │   ├── models/      # Database models
│   │   └── schemas/     # Pydantic schemas
│   └── run.py           # Start backend
│
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities
│   └── package.json
│
└── docs/               # Documentation
```

## 🔧 Quick Commands Reference

### Backend Commands
```bash
# Start backend
cd backend
python run.py

# Run tests (once you add them)
pytest

# Create new migration
alembic revision --autogenerate -m "description"
```

### Frontend Commands
```bash
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Backend won't start
- ❌ **Error:** Database connection failed
- ✅ **Fix:** Check PostgreSQL is running OR use SQLite in `.env`:
  ```
  DATABASE_URL=sqlite:///./smartbursary.db
  ```

### Frontend won't start
- ❌ **Error:** Cannot find module
- ✅ **Fix:** Delete `node_modules` and run `npm install` again

### Can't connect frontend to backend
- ❌ **Error:** Network error or CORS
- ✅ **Fix:** Check both servers are running and `.env.local` has correct API URL

## 📖 Next Steps

Now that everything is running:

1. **Create more API endpoints** (see `backend/app/api/`)
2. **Build frontend pages** (see `frontend/src/app/`)
3. **Add database models** (see `backend/app/models/`)
4. **Follow the roadmap** (see `DEVELOPMENT_ROADMAP.md`)

### Suggested Order of Development:
1. ✅ Project setup (DONE!)
2. 🔄 Complete authentication UI (login/register pages)
3. 🔄 Build applicant profile system
4. 🔄 Create bursary program management
5. 🔄 Build application submission form
6. 🔄 Add document upload
7. 🔄 Create admin dashboard
8. 🔄 Implement AI features
9. 🔄 Add notifications
10. 🔄 Deploy!

## 🆘 Need Help?

- Check `backend/SETUP.md` for detailed backend instructions
- Check `frontend/SETUP.md` for detailed frontend instructions
- Review `DEVELOPMENT_ROADMAP.md` for the full project plan
- Read the requirements: `SmartBursary-Requirements-Documentation.pdf`

## 🎉 You're Ready to Build!

Everything is set up and working. Start building features one at a time, test as you go, and follow the development roadmap.

Happy coding! 🚀
