from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "SmartBursary API"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    API_VERSION: str = "v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/smartbursary"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: str = '["http://localhost:3000", "http://localhost:3001"]'
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse ALLOWED_ORIGINS as JSON list."""
        try:
            return json.loads(self.ALLOWED_ORIGINS)
        except:
            return ["http://localhost:3000", "http://localhost:3001"]
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
