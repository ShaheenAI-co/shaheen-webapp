#!/usr/bin/env python3
"""
Test script to find the correct Twitter media upload endpoint
"""

import requests
import os
from twitter_service import TwitterService

def test_media_upload_endpoints():
    """Test different media upload endpoints to find which one works"""
    
    # Initialize Twitter service
    try:
        twitter_service = TwitterService()
        print("✅ Twitter service initialized")
    except Exception as e:
        print(f"❌ Failed to initialize Twitter service: {e}")
        return
    
    # Test endpoints
    endpoints = [
        "/1.1/media/upload.json",  # Old API v1.1 (deprecated)
        "/2/media",                 # API v2 (current)
        "/2/media/upload",          # Alternative v2 endpoint
        "/1.1/media/upload",        # Alternative v1.1 endpoint
    ]
    
    print("\n🔍 Testing different media upload endpoints...")
    
    for endpoint in endpoints:
        url = f"https://api.twitter.com{endpoint}"
        print(f"\n📡 Testing: {url}")
        
        try:
            # Simple HEAD request to check if endpoint exists
            response = requests.head(url, timeout=10)
            print(f"   Status: {response.status_code}")
            print(f"   Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                print(f"   ✅ Endpoint accessible")
            elif response.status_code == 404:
                print(f"   ❌ Endpoint not found")
            elif response.status_code == 401:
                print(f"   🔒 Endpoint requires authentication")
            else:
                print(f"   ⚠️ Unexpected status: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def test_with_oauth():
    """Test media upload with actual OAuth tokens"""
    print("\n🔐 Testing with OAuth tokens...")
    
    # This would require actual OAuth tokens
    # For now, just show the expected flow
    print("To test with OAuth:")
    print("1. Run the Flask app")
    print("2. Connect your Twitter account")
    print("3. Try uploading an image")
    print("4. Check the console logs")

if __name__ == "__main__":
    print("🚀 Twitter Media Upload Endpoint Tester")
    print("=" * 50)
    
    test_media_upload_endpoints()
    test_with_oauth()
    
    print("\n📋 Summary:")
    print("- /1.1/media/upload.json is deprecated")
    print("- /2/media should be the current endpoint")
    print("- Check Twitter API documentation for latest endpoints")
