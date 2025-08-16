# Instagram Business API Integration for Shaheen AI

This document describes the Instagram Business API integration implemented in the Shaheen AI webapp.

## 🎉 **App Status: APPROVED by Meta**

Your Facebook App (ID: `1274014204192589`) has been approved for Instagram Business API access with **essential permissions only**.

## Features

### 🔐 Instagram Business API Authentication
- Secure OAuth 2.0 flow with Instagram Business API
- Access token management and storage
- User account connection status tracking
- **Approved permissions**: Basic profile access and content publishing only

### 📱 Instagram Post Scheduler
- Schedule posts with captions and media
- Date and time picker for post scheduling
- Media upload interface (UI only - backend integration needed)
- **Business API features**: Focused on content creation and scheduling

### 🔗 Connection Management
- Connect/disconnect Instagram Business accounts
- Real-time connection status
- Token validation and expiration handling
- **Focused functionality**: Only what's needed for posting

## Components

### InstagramLoginButton
A reusable button component that initiates the Instagram Business API OAuth flow.

**Usage:**
```jsx
import InstagramLoginButton from '@/components/InstagramLoginButton';

<InstagramLoginButton>
  Connect Instagram Business
</InstagramLoginButton>
```

### InstagramConnectionStatus
Displays the current Instagram Business API connection status and provides connect/disconnect functionality.

**Features:**
- Connection status indicator
- Token information display
- Connect/disconnect buttons
- Error handling and display
- **Business account detection**: Shows connected business accounts

### InstagramPostScheduler
A comprehensive post scheduling interface that appears when Instagram Business API is connected.

**Features:**
- Caption input with character counter (Instagram Business API limit: 2200 chars)
- Date and time selection
- Media upload interface
- Form validation
- Success/error messaging
- **Focused features**: Content creation and scheduling only

## Hooks

### useInstagramAuth
A custom hook that manages Instagram Business API authentication state and provides authentication methods.

**Returns:**
- `isConnected`: Boolean indicating connection status
- `isLoading`: Boolean indicating loading state
- `userData`: Object containing user credentials
- `error`: String containing any error messages
- `login`: Function to initiate login
- `logout`: Function to disconnect
- `checkOAuthReturn`: Function to handle OAuth callback

**Usage:**
```jsx
import { useInstagramAuth } from '@/Hooks/useInstagramAuth';

const { isConnected, login, logout } = useInstagramAuth();
```

## Services

### InstagramAuthService
A service class that handles Instagram Business API interactions and credential management.

**Methods:**
- `getAuthUrl()`: Generate Instagram Business API OAuth URL
- `exchangeCodeForToken(code)`: Exchange authorization code for access token
- `getUserProfile(accessToken)`: Fetch user profile information
- `getBusinessAccounts(accessToken, pageId)`: Get Instagram business accounts
- `storeCredentials(credentials)`: Store credentials locally
- `getStoredCredentials()`: Retrieve stored credentials
- `clearCredentials()`: Clear stored credentials
- `isConnected()`: Check connection status

## API Endpoints

### GET /api/auth/ig-callback
Handles the OAuth callback from Instagram Business API and exchanges the authorization code for an access token.

**Response:**
```json
{
  "success": true,
  "message": "Instagram Business login successful!",
  "data": {
    "access_token": "token_here",
    "token_type": "bearer",
    "expires_in": 5184000,
    "pages": [...],
    "instagram_accounts": [...],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/ig-callback
Alternative endpoint for exchanging authorization codes via POST request.

**Request Body:**
```json
{
  "code": "authorization_code_here"
}
```

## Environment Variables

Required environment variables for Instagram Business API integration:

```env
# Facebook App credentials (App ID is already configured)
FB_APP_ID=1274014204192589
FB_APP_SECRET=your_facebook_app_secret_here

# App URL for redirect URIs (Production)
NEXT_PUBLIC_APP_URL=https://shaheen-webapp.vercel.app

# Client-side accessible app ID
NEXT_PUBLIC_FB_APP_ID=1274014204192589
```

## OAuth Configuration

The integration uses the **Instagram Business API OAuth endpoint** with minimal permissions:

```
https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1274014204192589&redirect_uri=https://shaheen-webapp.vercel.app/api/auth/ig-callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_content_publish
```

**Approved Scopes (Minimal & Focused):**
- `instagram_business_basic` - Basic business profile access (required for connection)
- `instagram_business_content_publish` - Create and schedule posts (core functionality)

## Why Minimal Permissions?

We follow the **principle of least privilege** by only requesting what you actually need:

✅ **`instagram_business_basic`** - Required to identify and connect your Instagram business account  
✅ **`instagram_business_content_publish`** - Required to create and schedule posts  

**Benefits:**
- 🔒 **Enhanced Security** - Less access means reduced risk
- ✅ **Faster Approval** - Meta prefers apps with minimal permissions
- 🚀 **Better User Trust** - Users see exactly what permissions you need
- 📱 **Focused Functionality** - Perfect for content scheduling and posting
- 🎯 **Cleaner Integration** - No unnecessary API calls or data access

## Security Considerations

1. **Client-side exposure**: Only `NEXT_PUBLIC_FB_APP_ID` should be exposed to the client
2. **Server-side secrets**: `FB_APP_SECRET` should never be exposed to the client
3. **Token storage**: Currently uses localStorage for demo purposes - implement secure server-side storage for production
4. **Token refresh**: Implement token refresh mechanisms for long-lived access
5. **Rate limiting**: Add rate limiting to your API endpoints
6. **HTTPS only**: Always use secure connections in production
7. **Minimal permissions**: Only requesting essential access needed for functionality

## Setup Instructions

1. **Environment Setup**: Add your `FB_APP_SECRET` to `.env.local`
2. **Test Integration**: Use the dashboard to test connection and scheduling
3. **Customize UI**: Modify components to match your design system
4. **Production Deployment**: Ensure HTTPS is enabled

## Available Business Features

With your approved Instagram Business API access, you can:

✅ **Connect Instagram Business Accounts**  
✅ **Schedule Posts** (with the post scheduler component)  
✅ **Publish Content** (create and schedule posts)  
✅ **Basic Profile Access** (account information)  

**Focused on Core Functionality:**
- Content creation and scheduling
- Post management
- Account connection
- Basic profile information

## Future Enhancements

### Backend Integration
- Database storage for Instagram credentials
- Token refresh mechanisms
- Post scheduling backend services
- Media upload handling

### Additional Features
- Content calendar view
- Bulk post scheduling
- Media management
- Post templates
- **Focused on posting**: No unnecessary features

### Security Improvements
- Server-side token storage
- Encrypted credential storage
- OAuth state validation
- CSRF protection
- Rate limiting implementation

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: The redirect URI is already configured correctly
2. **"App not configured"**: Your app is already approved and configured
3. **"Insufficient permissions"**: The two required permissions are already approved
4. **"Invalid client_id"**: The client ID `1274014204192589` is already configured

### Debug Steps

1. Check that `FB_APP_SECRET` is set in your `.env.local` file
2. Verify the redirect URI matches exactly: `https://shaheen-webapp.vercel.app/api/auth/ig-callback`
3. Check browser console for any client-side errors
4. Check server logs for backend errors
5. Ensure you're using the production URL, not localhost

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your `FB_APP_SECRET` is correct
3. Ensure you're using the production URL, not localhost
4. Check that all environment variables are set correctly
5. Review the setup guide in `INSTAGRAM_SETUP.md`
