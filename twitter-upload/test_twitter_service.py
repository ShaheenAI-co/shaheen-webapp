#!/usr/bin/env python3
"""
Simple test script for Twitter service functionality
Run this to test the core Twitter service without the web interface
"""

import os
from dotenv import load_dotenv
from twitter_service import TwitterService

def test_twitter_service():
    """Test basic Twitter service functionality"""
    print("🧪 Testing Twitter Service...")
    
    # Load environment variables
    load_dotenv()
    
    # Check if credentials are available
    required_vars = ['TWITTER_API_KEY', 'TWITTER_API_SECRET']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file with your Twitter API credentials")
        return False
    
    try:
        # Initialize service
        print("✅ Initializing Twitter service...")
        twitter = TwitterService()
        print(f"   API Key: {twitter.api_key[:10]}...")
        print(f"   API Secret: {twitter.api_secret[:10]}...")
        print(f"   Redirect URI: {twitter.redirect_uri}")
        
        # Test nonce generation
        print("\n✅ Testing nonce generation...")
        nonce1 = twitter._generate_nonce()
        nonce2 = twitter._generate_nonce()
        print(f"   Nonce 1: {nonce1[:20]}...")
        print(f"   Nonce 2: {nonce2[:20]}...")
        print(f"   Nonces are different: {nonce1 != nonce2}")
        
        # Test OAuth header building
        print("\n✅ Testing OAuth header building...")
        test_params = {
            'oauth_consumer_key': 'test_key',
            'oauth_nonce': 'test_nonce',
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': '1234567890',
            'oauth_version': '1.0'
        }
        header = twitter._build_oauth_header(test_params)
        print(f"   OAuth Header: {header[:50]}...")
        
        # Test signature generation
        print("\n✅ Testing signature generation...")
        test_url = "https://api.twitter.com/1.1/statuses/update.json"
        test_params = {
            'oauth_consumer_key': twitter.api_key,
            'oauth_nonce': 'test_nonce',
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': '1234567890',
            'oauth_version': '1.0'
        }
        signature = twitter._generate_signature('POST', test_url, test_params)
        print(f"   Generated signature: {signature[:20]}...")
        print(f"   Signature length: {len(signature)}")
        
        print("\n🎉 All basic tests passed!")
        print("\n📝 Next steps:")
        print("   1. Run 'python app.py' to start the web server")
        print("   2. Open http://localhost:5000 in your browser")
        print("   3. Click 'Connect Twitter Account' to test OAuth flow")
        print("   4. Try posting a tweet to test the full functionality")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

def test_oauth_flow():
    """Test the OAuth flow (requires user interaction)"""
    print("\n🔄 Testing OAuth flow...")
    print("This will open a browser window for Twitter authorization")
    
    try:
        twitter = TwitterService()
        auth_url = twitter.get_authorization_url()
        print(f"✅ Authorization URL generated: {auth_url}")
        print("\n📱 Please:")
        print("   1. Copy the URL above and open it in your browser")
        print("   2. Authorize the app on Twitter")
        print("   3. Copy the oauth_verifier from the callback URL")
        print("   4. Run the test_access_token function with the verifier")
        
        return auth_url
        
    except Exception as e:
        print(f"❌ OAuth flow test failed: {str(e)}")
        return None

def test_access_token(oauth_token, oauth_verifier):
    """Test getting access token (requires oauth_verifier from user)"""
    print(f"\n🔑 Testing access token exchange...")
    print(f"   OAuth Token: {oauth_token}")
    print(f"   OAuth Verifier: {oauth_verifier}")
    
    try:
        twitter = TwitterService()
        access_tokens = twitter.get_access_token(oauth_token, oauth_verifier)
        
        print("✅ Access tokens received:")
        for key, value in access_tokens.items():
            print(f"   {key}: {value}")
        
        # Test setting tokens and getting user info
        twitter.set_tokens(access_tokens['oauth_token'], access_tokens['oauth_token_secret'])
        user_info = twitter.get_user_info()
        
        print("\n✅ User info retrieved:")
        if user_info.get('data'):
            user_data = user_info['data']
            print(f"   Name: {user_data.get('name')}")
            print(f"   Username: @{user_data.get('username')}")
            print(f"   User ID: {user_data.get('id')}")
        
        return access_tokens
        
    except Exception as e:
        print(f"❌ Access token test failed: {str(e)}")
        return None

def test_tweet_posting(oauth_token, oauth_token_secret, tweet_text="Test tweet from Python service!"):
    """Test posting a tweet (requires valid access tokens)"""
    print(f"\n🐦 Testing tweet posting...")
    print(f"   Tweet text: {tweet_text}")
    
    try:
        twitter = TwitterService()
        twitter.set_tokens(oauth_token, oauth_token_secret)
        
        result = twitter.post_tweet(tweet_text)
        
        print("✅ Tweet posted successfully!")
        print(f"   Response: {result}")
        
        if result.get('data', {}).get('id'):
            print(f"   Tweet ID: {result['data']['id']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Tweet posting test failed: {str(e)}")
        return None

if __name__ == "__main__":
    print("🚀 Twitter Service Test Suite")
    print("=" * 50)
    
    # Run basic tests
    if test_twitter_service():
        print("\n" + "=" * 50)
        print("🎯 Basic functionality tests completed successfully!")
        print("\n💡 To test the full OAuth flow and tweet posting:")
        print("   1. Start the web app: python app.py")
        print("   2. Open http://localhost:5000")
        print("   3. Follow the Twitter authorization process")
        print("   4. Try posting a tweet from the dashboard")
    else:
        print("\n❌ Basic tests failed. Please check your configuration.")
