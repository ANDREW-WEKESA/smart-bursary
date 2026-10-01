"""Direct server start script bypassing venv issues."""
import sys
import os

if __name__ == "__main__":
    # Make sure we're using the right Python
    print(f"Python: {sys.version}")
    print(f"Executable: {sys.executable}")

    # Add app to path
    sys.path.insert(0, os.path.dirname(__file__))

    try:
        import uvicorn
        print("✓ uvicorn loaded")
        
        # Run the server
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"Error: {e}")
        print("\nPlease install dependencies:")
        print("python -m pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose passlib python-multipart python-dotenv email-validator bcrypt cryptography --user")
