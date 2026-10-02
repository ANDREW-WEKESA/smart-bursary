"""
Migration script to add constituency and ward columns to applicants table
"""
import sqlite3
import os

def migrate():
    db_path = "smartbursary.db"
    
    if not os.path.exists(db_path):
        print("Database does not exist. Please run the application to create it first.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if constituency column exists
        cursor.execute("PRAGMA table_info(applicants)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'constituency' not in columns:
            print("Adding constituency column...")
            cursor.execute("ALTER TABLE applicants ADD COLUMN constituency VARCHAR(100)")
            print("✓ constituency column added")
        else:
            print("✓ constituency column already exists")
        
        if 'ward' not in columns:
            print("Adding ward column...")
            cursor.execute("ALTER TABLE applicants ADD COLUMN ward VARCHAR(100)")
            print("✓ ward column added")
        else:
            print("✓ ward column already exists")
        
        conn.commit()
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
