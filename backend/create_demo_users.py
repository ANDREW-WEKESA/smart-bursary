"""Create demo users for all roles"""
from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def create_demo_users():
    db = SessionLocal()
    
    demo_users = [
        {
            "email": "admin@smartbursary.com",
            "full_name": "System Administrator",
            "role": UserRole.ADMINISTRATOR,
            "password": "admin123"
        },
        {
            "email": "john.doe@student.com",
            "full_name": "John Doe",
            "role": UserRole.APPLICANT,
            "password": "student123"
        },
        {
            "email": "reviewer@smartbursary.com",
            "full_name": "Jane Smith",
            "role": UserRole.REVIEWER,
            "password": "reviewer123"
        },
        {
            "email": "finance@smartbursary.com",
            "full_name": "David Johnson",
            "role": UserRole.FINANCE_OFFICER,
            "password": "finance123"
        },
        {
            "email": "institution@university.edu",
            "full_name": "Prof. Mary Williams",
            "role": UserRole.INSTITUTION_OFFICER,
            "password": "institution123"
        }
    ]
    
    created = []
    skipped = []
    
    for user_data in demo_users:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        
        if existing_user:
            # Update role if different
            if existing_user.role != user_data["role"]:
                existing_user.role = user_data["role"]
                db.commit()
                print(f"✅ Updated role for: {user_data['email']} -> {user_data['role'].value}")
            else:
                skipped.append(user_data["email"])
                print(f"⏭️  Skipped (already exists): {user_data['email']}")
        else:
            # Create new user
            db_user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                password_hash=get_password_hash(user_data["password"]),
                role=user_data["role"],
                is_active=1
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            created.append(user_data["email"])
            print(f"✅ Created: {user_data['email']} ({user_data['role'].value})")
    
    db.close()
    
    print("\n" + "="*60)
    print(f"✅ Created {len(created)} new users")
    print(f"⏭️  Skipped {len(skipped)} existing users")
    print("="*60)
    
    print("\n📋 Demo User Credentials:\n")
    for user_data in demo_users:
        print(f"Role: {user_data['role'].value}")
        print(f"  Email: {user_data['email']}")
        print(f"  Password: {user_data['password']}")
        print()

if __name__ == "__main__":
    create_demo_users()
