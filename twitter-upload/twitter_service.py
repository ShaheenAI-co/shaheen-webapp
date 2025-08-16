import os
import time
import hashlib
import hmac
import base64
import urllib.parse
import requests
from typing import Optional, Dict, Any
from urllib.parse import urlencode

class TwitterService:
    """
    Twitter API service implementing OAuth 1.0a for authorization and posting tweets
    Based on the Laravel implementation from the guide
    """
    
    def __init__(self, config=None):
        if config is None:
            from config import get_config
            config = get_config().get_twitter_config()
        
        self.api_key = config['api_key']
        self.api_secret = config['api_secret']
        self.client_id = config.get('client_id')  # Optional for OAuth 1.0a
        self.client_secret = config.get('client_secret')  # Optional for OAuth 1.0a
        
        # Twitter API endpoints
        self.base_url = config['base_url']
        self.api_url = config['api_url']
        self.request_token_url = config['request_token_url']
        self.access_token_url = config['access_token_url']
        self.redirect_uri = config['redirect_uri']
        
        # OAuth tokens (set after authorization)
        self.oauth_token = None
        self.oauth_token_secret = None
        
        if not all([self.api_key, self.api_secret]):
            raise ValueError("Twitter API credentials not found in environment variables")
    
    def get_authorization_url(self) -> str:
        """
        Generate OAuth 1.0a authorization URL
        Returns the URL where user should authorize the app
        """
        # Get request token
        request_token = self._get_request_token()
        if not request_token:
            raise Exception('Failed to get OAuth request token')
        
        # Build authorization URL
        auth_url = f"{self.base_url}/oauth/authorize?oauth_token={request_token}"
        return auth_url
    
    def _get_request_token(self) -> Optional[str]:
        """
        Get OAuth request token from Twitter
        """
        # OAuth parameters
        oauth_params = {
            'oauth_callback': self.redirect_uri,
            'oauth_consumer_key': self.api_key,
            'oauth_nonce': self._generate_nonce(),
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': str(int(time.time())),
            'oauth_version': '1.0'
        }
        
        # Generate signature
        signature = self._generate_signature('POST', self.request_token_url, oauth_params)
        oauth_params['oauth_signature'] = signature
        
        # Build Authorization header
        auth_header = self._build_oauth_header(oauth_params)
        
        # Make request
        response = requests.post(
            self.request_token_url,
            headers={'Authorization': auth_header}
        )
        
        if response.status_code == 200:
            # Parse response
            params = dict(urllib.parse.parse_qsl(response.text))
            return params.get('oauth_token')
        
        print(f"Failed to get request token: {response.status_code} - {response.text}")
        return None
    
    def get_access_token(self, oauth_token: str, oauth_verifier: str) -> Dict[str, str]:
        """
        Exchange OAuth tokens for access tokens
        """
        # OAuth parameters
        oauth_params = {
            'oauth_consumer_key': self.api_key,
            'oauth_nonce': self._generate_nonce(),
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': str(int(time.time())),
            'oauth_token': oauth_token,
            'oauth_verifier': oauth_verifier,
            'oauth_version': '1.0'
        }
        
        # Generate signature
        signature = self._generate_signature('POST', self.access_token_url, oauth_params)
        oauth_params['oauth_signature'] = signature
        
        # Build Authorization header
        auth_header = self._build_oauth_header(oauth_params)
        
        # Make request
        response = requests.post(
            self.access_token_url,
            headers={'Authorization': auth_header}
        )
        
        if response.status_code == 200:
            # Parse response
            params = dict(urllib.parse.parse_qsl(response.text))
            return {
                'oauth_token': params.get('oauth_token', ''),
                'oauth_token_secret': params.get('oauth_token_secret', ''),
                'user_id': params.get('user_id', ''),
                'screen_name': params.get('screen_name', '')
            }
        
        raise Exception(f'Failed to get access token: {response.status_code} - {response.text}')
    
    def set_tokens(self, oauth_token: str, oauth_token_secret: str):
        """
        Set OAuth tokens for API calls
        """
        self.oauth_token = oauth_token
        self.oauth_token_secret = oauth_token_secret
    
    def get_user_info(self) -> Dict[str, Any]:
        """
        Get authenticated user information
        """
        if not self.oauth_token or not self.oauth_token_secret:
            raise Exception('OAuth tokens not set. Please authorize first.')
        
        url = f"{self.api_url}/2/users/me"
        
        # OAuth parameters
        oauth_params = {
            'oauth_consumer_key': self.api_key,
            'oauth_nonce': self._generate_nonce(),
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': str(int(time.time())),
            'oauth_token': self.oauth_token,
            'oauth_version': '1.0'
        }
        
        # Generate signature
        signature = self._generate_signature('GET', url, oauth_params)
        oauth_params['oauth_signature'] = signature
        
        # Build Authorization header
        auth_header = self._build_oauth_header(oauth_params)
        
        # Make request
        response = requests.get(url, headers={'Authorization': auth_header})
        
        if response.status_code == 200:
            return response.json()
        
        raise Exception(f'Failed to get user info: {response.status_code} - {response.text}')
    
    def post_tweet(self, text: str, media_ids: list = None) -> Dict[str, Any]:
        """
        Post a tweet with optional media
        """
        if not self.oauth_token or not self.oauth_token_secret:
            raise Exception('OAuth tokens not set. Please authorize first.')
        
        url = f"{self.api_url}/2/tweets"
        
        # Prepare tweet data
        tweet_data = {'text': text}
        if media_ids:
            tweet_data['media'] = {'media_ids': media_ids}
        
        # OAuth parameters
        oauth_params = {
            'oauth_consumer_key': self.api_key,
            'oauth_nonce': self._generate_nonce(),
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': str(int(time.time())),
            'oauth_token': self.oauth_token,
            'oauth_version': '1.0'
        }
        
        # Generate signature
        signature = self._generate_signature('POST', url, oauth_params)
        oauth_params['oauth_signature'] = signature
        
        # Build Authorization header
        auth_header = self._build_oauth_header(oauth_params)
        
        # Make request
        response = requests.post(
            url,
            headers={
                'Authorization': auth_header,
                'Content-Type': 'application/json'
            },
            json=tweet_data
        )
        
        if response.status_code == 201:
            return response.json()
        
        raise Exception(f'Failed to post tweet: {response.status_code} - {response.text}')
    
    def upload_media(self, file_path: str) -> str:
        """
        Upload media file and return media ID using Twitter API v2
        """
        if not self.oauth_token or not self.oauth_token_secret:
            raise Exception('OAuth tokens not set. Please authorize first.')
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise Exception(f'File not found: {file_path}')
        
        # Get file size
        file_size = os.path.getsize(file_path)
        print(f"📊 File size: {file_size} bytes")
        
        # Check file size limit (Twitter allows up to 5MB)
        if file_size > 5 * 1024 * 1024:  # 5MB
            raise Exception(f'File too large: {file_size} bytes. Twitter allows max 5MB.')
        
        # Twitter API v2 media upload endpoint (correct endpoint)
        url = f"{self.api_url}/2/media/upload"
        print(f"🌐 Uploading to: {url}")
        
        # OAuth parameters
        oauth_params = {
            'oauth_consumer_key': self.api_key,
            'oauth_nonce': self._generate_nonce(),
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': str(int(time.time())),
            'oauth_token': self.oauth_token,
            'oauth_version': '1.0'
        }
        
        # Generate signature
        signature = self._generate_signature('POST', url, oauth_params)
        oauth_params['oauth_signature'] = signature
        
        # Build Authorization header
        auth_header = self._build_oauth_header(oauth_params)
        
        try:
            # Prepare file for upload - Twitter API v2 expects multipart form
            with open(file_path, 'rb') as f:
                # Twitter API v2 expects 'media' as the file parameter name
                files = {'media': f}
                
                # Add media_category as form data
                data = {'media_category': 'tweet_image'}
                
                print(f"📤 Sending request with OAuth header: {auth_header[:50]}...")
                
                # Make request to API v2 with proper multipart form
                response = requests.post(
                    url,
                    headers={'Authorization': auth_header},
                    files=files,
                    data=data
                )
            
            print(f"📡 Response status: {response.status_code}")
            print(f"📡 Response headers: {dict(response.headers)}")
            print(f"📡 Response body: {response.text[:200]}...")
            
            if response.status_code == 200:
                data = response.json()
                print(f"📡 Full response data: {data}")
                
                # Twitter API v2 returns media ID in data.id
                media_id = data.get('data', {}).get('id')
                if media_id:
                    print(f"✅ Media uploaded successfully, ID: {media_id}")
                    return str(media_id)  # Convert to string for consistency
                else:
                    print(f"⚠️ No media ID found in response: {data}")
                    raise Exception(f'No media ID returned from Twitter: {data}')
            else:
                raise Exception(f'Failed to upload media: {response.status_code} - {response.text}')
                
        except Exception as e:
            print(f"❌ Upload error: {str(e)}")
            raise e
    
    def _generate_nonce(self) -> str:
        """
        Generate random nonce for OAuth
        """
        import random
        import string
        return ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    
    def _generate_signature(self, method: str, url: str, params: Dict[str, str]) -> str:
        """
        Generate OAuth signature
        """
        # Sort parameters
        sorted_params = sorted(params.items())
        
        # Build base string
        base_string = f"{method.upper()}&{urllib.parse.quote(url, safe='')}&"
        base_string += urllib.parse.quote(urlencode(sorted_params), safe='')
        
        # Create signing key
        signing_key = f"{urllib.parse.quote(self.api_secret, safe='')}&"
        if self.oauth_token_secret:
            signing_key += urllib.parse.quote(self.oauth_token_secret, safe='')
        
        # Generate signature
        signature = hmac.new(
            signing_key.encode('utf-8'),
            base_string.encode('utf-8'),
            hashlib.sha1
        ).digest()
        
        return base64.b64encode(signature).decode('utf-8')
    
    def _build_oauth_header(self, params: Dict[str, str]) -> str:
        """
        Build OAuth Authorization header
        """
        header = 'OAuth '
        header_parts = []
        
        for key, value in params.items():
            header_parts.append(f'{key}="{urllib.parse.quote(value, safe="")}"')
        
        header += ', '.join(header_parts)
        return header
