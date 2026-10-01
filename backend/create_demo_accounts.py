"""
Create demo accounts for SmartBursary system
- Admin account
- Applicant account
"""
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.applicant import Applicant
from app.core.security import get_password_hash
from datetime import date

# Create all tables
Base.metadata.create_all(bind=engine)


def create_demo_accounts():
    db: Session = SessionLocal()
    
    try:
        # Check if accounts already exist
        existing_admin = db.query(User).filter(User.email == "admin@smartbursary.com").first()
        existing_applicant = db.query(User).filter(User.email == "applicant@demo.com").first()
        
        if existing_admin:
            print("⚠️  Admin account already exists")
        else:
            # Create Admin Account
            admin = User(
                username="admin",
                email="admin@smartbursary.com",
                full_name="System Administrator",
                phone_number="+254700000000",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_admin=True
            )
            db.add(admin)
            db.commit()
            print("✅ Admin account created!")
            print("   Email: admin@smartbursary.com")
            print("   Password: admin123")
        
        if existing_applicant:
            print("⚠️  Applicant account already exists")
        else:
            # Create Applicant Account
            applicant_user = User(
                username="johndoe",
                email="applicant@demo.com",
                full_name="John Doe",
                phone_number="+254712345678",
                hashed_password=get_password_hash("demo123"),
                is_active=True,
                is_admin=False
            )
            db.add(applicant_user)
            db.commit()
            db.refresh(applicant_user)
            
            # Create Applicant Profile
            applicant_profile = Applicant(
                user_id=applicant_user.id,
                first_name="John",
                middle_name="Kamau",
                last_name="Doe",
                date_of_birth=date(2000, 5, 15),
                gender="male",
                national_id="12345678",
                phone_number="+254712345678",
                email="applicant@demo.com",
                county="Nairobi",
                sub_county="Westlands",
                ward="Parklands",
                village="Highridge",
                postal_address="P.O. Box 12345-00100 Nairobi",
                disability_status="none",
                is_verified=False
            )
            db.add(applicant_profile)
            db.commit()
            
            print("✅ Applicant account created!")
            print("   Email: applicant@demo.com")
            print("   Password: demo123")
            print("   Profile: John Kamau Doe")
        
        print("\n" + "="*50)
        print("🎉 Demo accounts setup complete!")
        print("="*50)
        print("\n📝 Login Credentials:\n")
        print("ADMIN ACCOUNT:")
        print("  Email: admin@smartbursary.com")
        print("  Password: admin123")
        print()
        print("APPLICANT ACCOUNT:")
        print("  Email: applicant@demo.com")
        print("  Password: demo123")
        print()
        print("🌐 Access the API at: http://localhost:8000/docs")
        print("🖥️  Frontend at: http://localhost:3001")
        print()
        
    except Exception as e:
        print(f"❌ Error creating accounts: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("\n🚀 Creating demo accounts...\n")
    create_demo_accounts()
