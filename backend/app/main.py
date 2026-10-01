from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"/api/{settings.API_VERSION}")

# Import and register all API routers
try:
    from app.api import (
        institutions,
        applicants,
        guardians,
        academic_progress,
        bursaries,
        applications,
        disbursements
    )
    
    app.include_router(institutions.router, prefix=f"/api/{settings.API_VERSION}")
    app.include_router(applicants.router, prefix=f"/api/{settings.API_VERSION}")
    app.include_router(guardians.router, prefix=f"/api/{settings.API_VERSION}")
    app.include_router(academic_progress.router, prefix=f"/api/{settings.API_VERSION}")
    app.include_router(bursaries.router, prefix=f"/api/{settings.API_VERSION}")
    app.include_router(applications.router, prefix=f"/api/{settings.API_VERSION}")
    app.include_router(disbursements.router, prefix=f"/api/{settings.API_VERSION}")
except ImportError as e:
    print(f"Warning: Some routers could not be imported: {e}")


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to SmartBursary API",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
