"""
Configuration module for Calendar Agent
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    load_dotenv(env_path)


class Config:
    """Configuration class for Calendar Agent"""
    
    # Service Configuration
    SERVICE_NAME = "calendar-agent"
    SERVICE_PORT = int(os.getenv('SERVICE_PORT', '8001'))
    SERVICE_HOST = os.getenv('SERVICE_HOST', '0.0.0.0')
    
    # Central API Configuration
    CENTRAL_API_URL = os.getenv('CENTRAL_API_URL', 'http://localhost:8000/api/features')
    
    # Celery Configuration
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    
    # Google Calendar API
    GOOGLE_CALENDAR_API = os.getenv('GOOGLE_CALENDAR_API', 'https://www.googleapis.com/calendar/v3')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8001/oauth/callback')
    
    # Outlook Calendar API (Microsoft Graph)
    OUTLOOK_CALENDAR_API = os.getenv('OUTLOOK_CALENDAR_API', 'https://graph.microsoft.com/v1.0')
    MICROSOFT_CLIENT_ID = os.getenv('MICROSOFT_CLIENT_ID', '')
    MICROSOFT_CLIENT_SECRET = os.getenv('MICROSOFT_CLIENT_SECRET', '')
    MICROSOFT_TENANT_ID = os.getenv('MICROSOFT_TENANT_ID', '')
    MICROSOFT_REDIRECT_URI = os.getenv('MICROSOFT_REDIRECT_URI', 'http://localhost:8001/oauth/callback')
    
    # Scraping Configuration
    SCRAPING_INTERVAL_MINUTES = int(os.getenv('SCRAPING_INTERVAL_MINUTES', '60'))
    ANALYSIS_DAYS_BACK = int(os.getenv('ANALYSIS_DAYS_BACK', '7'))
    
    # Working Hours Configuration
    WORK_START_HOUR = int(os.getenv('WORK_START_HOUR', '9'))
    WORK_END_HOUR = int(os.getenv('WORK_END_HOUR', '18'))
    STANDARD_WORK_HOURS = float(os.getenv('STANDARD_WORK_HOURS', '8.0'))
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Privacy Configuration
    ANONYMIZE_DATA = os.getenv('ANONYMIZE_DATA', 'true').lower() == 'true'
    HASH_ALGORITHM = 'sha256'
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        errors = []
        
        if not cls.CENTRAL_API_URL:
            errors.append("CENTRAL_API_URL is required")
        
        if errors:
            raise ValueError(f"Configuration errors: {', '.join(errors)}")


# Validate configuration on import
Config.validate()
