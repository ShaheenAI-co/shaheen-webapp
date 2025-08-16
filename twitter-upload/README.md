# Twitter Post Scheduler Test App

This is a Python/Flask implementation of the Twitter OAuth and posting functionality from your Laravel guide. It's designed to test the core logic before implementing in your Next.js application.

## 🎯 Purpose

This test app validates the Twitter OAuth 1.0a flow and posting functionality described in your Laravel guide, ensuring the core logic works correctly before porting to Next.js.

## 🏗️ Architecture

The app follows the same structure as your Laravel implementation:

- **Twitter Service** (`twitter_service.py`) - Core OAuth and API logic
- **Flask Web App** (`app.py`) - Web interface for testing
- **Templates** - HTML views for the OAuth flow and posting interface

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Twitter API Credentials

1. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

2. Add your Twitter API credentials to `.env`:
```env
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
FLASK_SECRET_KEY=your_secret_key_here
APP_URL=http://localhost:5000
```

### 3. Get Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use an existing one
3. Get your API Key and API Secret
4. Set up OAuth 1.0a with callback URL: `http://localhost:5000/oauth/callback/twitter`

### 4. Run the App

```bash
python app.py
```

The app will be available at `http://localhost:5000`

## 🧪 Testing

### Basic Service Tests

Run the test script to verify core functionality:

```bash
python test_twitter_service.py
```

This will test:
- Service initialization
- OAuth signature generation
- Nonce generation
- Header building

### Full OAuth Flow Test

1. **Start the web app**: `python app.py`
2. **Open browser**: Navigate to `http://localhost:5000`
3. **Connect Twitter**: Click "Connect Twitter Account"
4. **Authorize**: Complete Twitter authorization
5. **Post Tweet**: Use the dashboard to post a test tweet

## 📋 OAuth Flow Implementation

The app implements the complete OAuth 1.0a flow as described in your Laravel guide:

### 1. Request Token
```python
# Get OAuth request token
request_token = twitter_service._get_request_token()
```

### 2. User Authorization
```python
# Build authorization URL
auth_url = f"{base_url}/oauth/authorize?oauth_token={request_token}"
```

### 3. Access Token Exchange
```python
# Exchange OAuth tokens for access tokens
access_tokens = twitter_service.get_access_token(oauth_token, oauth_verifier)
```

### 4. API Calls
```python
# Set tokens and make authenticated calls
twitter_service.set_tokens(oauth_token, oauth_token_secret)
result = twitter_service.post_tweet("Hello World!")
```

## 🔧 Key Components

### Twitter Service (`twitter_service.py`)

- **OAuth 1.0a Implementation**: Complete signature generation and header building
- **Request Token Management**: Handles OAuth request token flow
- **Access Token Exchange**: Converts authorization to permanent access
- **API Integration**: Twitter API v2 endpoints for posting tweets

### Flask App (`app.py`)

- **OAuth Routes**: `/auth/twitter` and `/oauth/callback/twitter`
- **Session Management**: Stores OAuth tokens in Flask session
- **Tweet Posting**: `/post-tweet` endpoint for posting tweets
- **Error Handling**: Comprehensive error handling and user feedback

### Templates

- **Base Template**: Common layout with navigation and flash messages
- **Index Page**: Home page with connection status and OAuth flow
- **Dashboard**: Connected account info and tweet posting interface

## 🐛 Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   ValueError: Twitter API credentials not found in environment variables
   ```
   - Ensure `.env` file exists with correct credentials
   - Check variable names match exactly

2. **OAuth Callback Errors**
   ```
   Failed to get access token: 401 - Unauthorized
   ```
   - Verify callback URL matches Twitter app settings
   - Check API key/secret are correct
   - Ensure app has proper permissions

3. **Tweet Posting Fails**
   ```
   Failed to post tweet: 403 - Forbidden
   ```
   - Check app has "Read and Write" permissions
   - Verify OAuth tokens are valid
   - Ensure user hasn't revoked access

### Debug Mode

Enable Flask debug mode for detailed error information:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📚 Next Steps for Next.js Implementation

Once testing is complete, you can port this to Next.js:

1. **Convert Python OAuth logic to JavaScript/TypeScript**
2. **Use NextAuth.js or similar for OAuth handling**
3. **Implement proper token storage (database instead of session)**
4. **Add scheduling functionality from your Laravel guide**
5. **Implement media upload and multi-platform support**

## 🔒 Security Notes

- **Never commit `.env` files** with real credentials
- **Use HTTPS in production** for OAuth callbacks
- **Implement proper token storage** (database, not session)
- **Add rate limiting** for API endpoints
- **Validate all user inputs** before API calls

## 📖 API Reference

### Twitter Service Methods

- `get_authorization_url()` - Start OAuth flow
- `get_access_token(oauth_token, oauth_verifier)` - Complete OAuth
- `set_tokens(oauth_token, oauth_token_secret)` - Set auth tokens
- `get_user_info()` - Get authenticated user info
- `post_tweet(text)` - Post a tweet

### Flask Routes

- `GET /` - Home page
- `GET /auth/twitter` - Start Twitter OAuth
- `GET /oauth/callback/twitter` - OAuth callback
- `GET /dashboard` - User dashboard
- `POST /post-tweet` - Post tweet endpoint
- `GET /logout` - Clear session

## 🤝 Contributing

This is a test implementation. For production use:

1. Add proper error handling
2. Implement database storage
3. Add logging and monitoring
4. Include unit tests
5. Add CI/CD pipeline

## 📄 License

This is a test implementation for your project. Use as needed for development and testing purposes.
