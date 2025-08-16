"""
Configuration file for Twitter Post Scheduler Test App
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # Twitter API settings
    TWITTER_API_KEY = os.getenv('TWITTER_API_KEY')
    TWITTER_API_SECRET = os.getenv('TWITTER_API_SECRET')
    TWITTER_CLIENT_ID = os.getenv('TWITTER_CLIENT_ID')
    TWITTER_CLIENT_SECRET = os.getenv('TWITTER_CLIENT_SECRET')
    
    # App settings
    APP_URL = os.getenv('APP_URL', 'http://localhost:5000')
    
    # Twitter API endpoints
    TWITTER_BASE_URL = 'https://twitter.com'
    TWITTER_API_URL = 'https://api.twitter.com'
    TWITTER_REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
    TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
    
    # OAuth callback URL
    TWITTER_REDIRECT_URI = f"{APP_URL}/oauth/callback/twitter"
    
    @classmethod
    def validate_twitter_credentials(cls):
        """Validate that required Twitter credentials are present"""
        required = ['TWITTER_API_KEY', 'TWITTER_API_SECRET']
        missing = [var for var in required if not getattr(cls, var)]
        
        if missing:
            raise ValueError(f"Missing required Twitter credentials: {', '.join(missing)}")
        
        # Client ID and Secret are optional for OAuth 1.0a
        if not cls.TWITTER_CLIENT_ID:
            print("⚠️  Warning: TWITTER_CLIENT_ID not set (optional for OAuth 1.0a)")
        if not cls.TWITTER_CLIENT_SECRET:
            print("⚠️  Warning: TWITTER_CLIENT_SECRET not set (optional for OAuth 1.0a)")
        
        return True
    
    @classmethod
    def get_twitter_config(cls):
        """Get Twitter configuration as a dictionary"""
        return {
            'api_key': cls.TWITTER_API_KEY,
            'api_secret': cls.TWITTER_API_SECRET,
            'client_id': cls.TWITTER_CLIENT_ID,
            'client_secret': cls.TWITTER_CLIENT_SECRET,
            'base_url': cls.TWITTER_BASE_URL,
            'api_url': cls.TWITTER_API_URL,
            'request_token_url': cls.TWITTER_REQUEST_TOKEN_URL,
            'access_token_url': cls.TWITTER_ACCESS_TOKEN_URL,
            'redirect_uri': cls.TWITTER_REDIRECT_URI
        }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    @classmethod
    def validate_twitter_credentials(cls):
        """Strict validation for production"""
        super().validate_twitter_credentials()
        
        # Additional production checks
        if not cls.SECRET_KEY or cls.SECRET_KEY == 'dev-secret-key-change-in-production':
            raise ValueError("SECRET_KEY must be set in production")
        
        return True

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    SECRET_KEY = 'test-secret-key'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """Get configuration class by name"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    
    return config.get(config_name, config['default'])
