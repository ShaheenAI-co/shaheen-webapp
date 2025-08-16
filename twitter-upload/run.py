#!/usr/bin/env python3
"""
Startup script for Twitter Post Scheduler Test App
"""

import sys
import os

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import flask
        import requests
        import dotenv
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists"""
    if not os.path.exists('.env'):
        print("❌ .env file not found")
        print("Please create a .env file with your Twitter API credentials")
        print("You can copy from .env.example and fill in your values")
        return False
    return True

def main():
    """Main startup function"""
    print("🚀 Twitter Post Scheduler Test App")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check environment file
    if not check_env_file():
        sys.exit(1)
    
    print("✅ Dependencies and environment file check passed")
    print("\n📝 Starting Flask application...")
    
    try:
        # Import and run the app
        from app import app, config
        
        # Validate configuration
        config.validate_twitter_credentials()
        print("✅ Configuration validated successfully")
        print(f"🌐 App will be available at: {config.APP_URL}")
        print(f"🔧 Debug mode: {'ON' if config.DEBUG else 'OFF'}")
        
        # Start the app
        app.run(
            debug=config.DEBUG,
            host='0.0.0.0',
            port=5000
        )
        
    except Exception as e:
        print(f"❌ Failed to start app: {str(e)}")
        print("\n🔍 Troubleshooting tips:")
        print("   1. Check your .env file has correct Twitter API credentials")
        print("   2. Ensure TWITTER_API_KEY and TWITTER_API_SECRET are set")
        print("   3. Verify your Twitter app has OAuth 1.0a enabled")
        print("   4. Check callback URL matches: http://localhost:5000/oauth/callback/twitter")
        sys.exit(1)

if __name__ == '__main__':
    main()
