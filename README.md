# SmartBursary

Intelligent Bursary Application, Verification & Tracking System

## Overview

SmartBursary is a digital bursary management system that simplifies the process of applying for, reviewing, and managing bursary applications. The system incorporates AI-assisted verification and duplicate detection to streamline the application process.

## Features

- **For Applicants:**
  - Easy online application submission
  - Document upload and management
  - Real-time application status tracking
  - Email notifications
  - Academic progress tracking
  - Parent/guardian information management
  - Payment disbursement status tracking

- **For Administrators:**
  - Centralized application management dashboard
  - AI-assisted application analysis
  - Duplicate detection
  - Comprehensive reporting
  - **Institution verification system**
  - **Academic progress monitoring**
  - **Payment disbursement tracking**
  - Guardian information verification

- **For Reviewers:**
  - Streamlined review workflow
  - Document verification tools
  - Scoring and recommendation system
  - Institution enrollment verification
  - Academic performance review

## 🌟 Enhanced Features (HELB-Inspired)

1. **🏛️ Institution Verification**: Verified registry of accredited institutions with verification workflow
2. **📊 Academic Progress Tracking**: Semester-by-semester GPA/CGPA tracking with institution verification
3. **👨‍👩‍👧‍👦 Parent/Guardian Information**: Comprehensive family financial assessment
4. **💰 Payment Disbursement Tracking**: Complete payment lifecycle from approval to completion

See [ENHANCED_FEATURES.md](ENHANCED_FEATURES.md) for detailed documentation.

## Technology Stack

### Backend
- Python with FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- JWT authentication

### Frontend
- React with Next.js
- Tailwind CSS
- Shadcn UI components

## Project Structure

```
smart-bursary/
├── backend/          # FastAPI backend
├── frontend/         # Next.js frontend
├── docs/            # Documentation
└── database/        # Database scripts and migrations
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [Requirements Specification](SmartBursary-Requirements-Documentation.pdf)
- [Development Roadmap](DEVELOPMENT_ROADMAP.md)
- [API Documentation](http://localhost:8000/docs) (when backend is running)

## Team

Academic Group Project

## License

This project is developed for educational purposes.
