#!/usr/bin/env python3
"""
Quick test script for Twitter service - no OAuth required
"""

def test_basic_functionality():
    """Test basic service functionality without OAuth"""
    print("🧪 Quick Twitter Service Test")
    print("=" * 40)
    
    try:
        # Test imports
        print("✅ Testing imports...")
        from twitter_service import TwitterService
        from config import get_config
        
        # Test configuration
        print("✅ Testing configuration...")
        config = get_config()
        twitter_config = config.get_twitter_config()
        
        print(f"   API Key: {twitter_config['api_key'][:10] if twitter_config['api_key'] else 'None'}...")
        print(f"   API Secret: {twitter_config['api_secret'][:10] if twitter_config['api_secret'] else 'None'}...")
        print(f"   Redirect URI: {twitter_config['redirect_uri']}")
        
        # Test service initialization
        print("✅ Testing service initialization...")
        twitter = TwitterService()
        print(f"   Base URL: {twitter.base_url}")
        print(f"   API URL: {twitter.api_url}")
        
        # Test utility methods
        print("✅ Testing utility methods...")
        nonce1 = twitter._generate_nonce()
        nonce2 = twitter._generate_nonce()
        print(f"   Nonce 1: {nonce1[:20]}...")
        print(f"   Nonce 2: {nonce2[:20]}...")
        print(f"   Nonces different: {nonce1 != nonce2}")
        
        # Test OAuth header building
        print("✅ Testing OAuth header building...")
        test_params = {
            'oauth_consumer_key': 'test_key',
            'oauth_nonce': 'test_nonce',
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': '1234567890',
            'oauth_version': '1.0'
        }
        header = twitter._build_oauth_header(test_params)
        print(f"   Header: {header[:50]}...")
        
        print("\n🎉 All basic tests passed!")
        print("\n📝 Next steps:")
        print("   1. Set up your .env file with Twitter API credentials")
        print("   2. Run 'python run.py' to start the full app")
        print("   3. Test the complete OAuth flow in your browser")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        print("\n🔍 Common issues:")
        print("   - Missing .env file")
        print("   - Missing Twitter API credentials")
        print("   - Missing dependencies (run: pip install -r requirements.txt)")
        return False

def test_configuration():
    """Test configuration loading"""
    print("\n🔧 Configuration Test")
    print("=" * 40)
    
    try:
        from config import get_config
        
        # Test different configs
        dev_config = get_config('development')
        print(f"✅ Development config loaded: {dev_config.__name__}")
        
        prod_config = get_config('production')
        print(f"✅ Production config loaded: {prod_config.__name__}")
        
        test_config = get_config('testing')
        print(f"✅ Testing config loaded: {test_config.__name__}")
        
        # Test Twitter config
        twitter_config = dev_config.get_twitter_config()
        print(f"✅ Twitter config loaded with {len(twitter_config)} items")
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("🚀 Twitter Service Quick Test Suite")
    print("=" * 50)
    
    success = True
    
    # Run tests
    if not test_basic_functionality():
        success = False
    
    if not test_configuration():
        success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎯 All quick tests passed!")
        print("\n💡 Your Twitter service is ready for testing!")
    else:
        print("❌ Some tests failed. Please check the issues above.")
        print("\n🔧 Run 'python run.py' for more detailed error information.")
