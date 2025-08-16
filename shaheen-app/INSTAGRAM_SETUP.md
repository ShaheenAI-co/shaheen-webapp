# Instagram Business API Setup Guide

This guide will help you set up Instagram Business API integration for the Shaheen AI webapp.

## 🎉 **Great News! Your App is Already Approved!**

Your Facebook App (ID: `1274014204192589`) has been approved for Instagram Business API access with the following **essential permissions**:
- `instagram_business_basic` - Access to basic business profile info
- `instagram_business_content_publish` - Publish content to Instagram

**Note**: We're only requesting the permissions you actually need for posting content, keeping the integration focused and secure.

## 🔐 **Long-Lived Token Support**

The integration automatically exchanges short-lived tokens for **long-lived tokens that last 60 days**, ensuring persistent access without frequent re-authentication.

## 🗄️ **Supabase Integration**

All Instagram accounts and long-lived tokens are securely stored in your Supabase database with proper user isolation and security policies.

## Prerequisites

✅ **Facebook Developer Account** - Already set up  
✅ **Facebook App** - Already created and configured  
✅ **Instagram Business Account** - Already connected  
✅ **App Approval** - Already approved by Meta  
✅ **Supabase Project** - For secure token storage  
✅ **Clerk Authentication** - For user management  

## Step 1: Environment Variables Setup

Create a `.env.local` file in your project root with:

```env
# Instagram Business API Configuration
# Your app has been approved for Instagram Business API access
FB_APP_ID=1274014204192589
FB_APP_SECRET=your_facebook_app_secret_here

# App URL (for redirect URI) - Use your Vercel deployment URL
NEXT_PUBLIC_APP_URL=https://shaheen-webapp.vercel.app

# Make sure FB_APP_ID is also available on the client side
NEXT_PUBLIC_FB_APP_ID=1274014204192589

# Supabase Configuration (Required for Instagram account storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Configuration (Required for user authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

**Important**: You only need to add your `FB_APP_SECRET` - the app ID is already configured!

## Step 2: Get Your Facebook App Secret

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app (ID: `1274014204192589`)
3. Go to **Settings** → **Basic**
4. Copy the **App Secret** and add it to your `.env.local` file

## Step 3: Set Up Supabase Database

### 3.1 Create the Instagram Accounts Table

Run the following SQL migration in your Supabase SQL editor:

```sql
-- Create Instagram accounts table
CREATE TABLE IF NOT EXISTS instagram_accounts (
    instagram_id BIGINT PRIMARY KEY,  -- Instagram Business Account ID
    clerk_id VARCHAR(255) NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
    username VARCHAR(255),            -- Instagram account username
    access_token TEXT NOT NULL,       -- Long-lived access token
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,  -- Token expiration
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_posted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(clerk_id, username)        -- Ensure one account per user per username
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_clerk_id ON instagram_accounts(clerk_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_expires_at ON instagram_accounts(expires_at);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_username ON instagram_accounts(username);

-- Enable Row Level Security (RLS)
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can only access their own Instagram accounts
CREATE POLICY "Users can only access their own Instagram accounts" ON instagram_accounts
    FOR ALL USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON instagram_accounts TO authenticated;
```

### 3.2 Alternative: Use the Migration File

1. Copy the migration file from `supabase/migrations/001_create_instagram_accounts.sql`
2. Paste it into your Supabase SQL editor
3. Run the migration

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the dashboard page
3. Click "Connect Instagram"
4. Complete the OAuth flow using the approved Instagram Business API
5. Verify that the connection status shows "Connected" with long-lived token info
6. Check your Supabase database to see the stored Instagram accounts

## How It Works

The integration now uses the **Instagram Business API OAuth endpoint** with minimal permissions and automatic long-lived token exchange:

```
https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1274014204192589&redirect_uri=https://shaheen-webapp.vercel.app/api/auth/ig-callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_content_publish
```

### Token Flow:
1. **OAuth Authorization** → Get authorization code
2. **Short-lived Token** → Exchange code for short-lived token (1-2 hours)
3. **Long-lived Token** → Automatically exchange for long-lived token (60 days)
4. **Page Tokens** → Get long-lived page access tokens for Instagram business accounts
5. **Database Storage** → Save all tokens securely to Supabase with user isolation

### Data Flow:
1. **User Authentication** → Clerk handles user login
2. **Instagram OAuth** → Get long-lived tokens from Meta
3. **Supabase Storage** → Store tokens with user association
4. **Account Management** → Users can manage multiple Instagram accounts
5. **Post Scheduling** → Schedule posts using stored tokens

## Available Features

With your approved Instagram Business API access, you can:

✅ **Connect Instagram Business Accounts**  
✅ **Schedule Posts** (with the post scheduler component)  
✅ **Publish Content** (create and schedule posts)  
✅ **Basic Profile Access** (account information)  
✅ **Long-lived Tokens** (60-day persistent access)  
✅ **Automatic Token Refresh** (seamless user experience)  
✅ **Multiple Account Support** (manage several Instagram accounts)  
✅ **Secure Token Storage** (Supabase with RLS policies)  
✅ **User Isolation** (each user only sees their own accounts)  

## Why Minimal Permissions?

We're following the **principle of least privilege** by only requesting the permissions you actually need:

- **`instagram_business_basic`** - Required to identify and connect your Instagram business account
- **`instagram_business_content_publish`** - Required to create and schedule posts

This approach:
- 🔒 **Increases security** - Less access means less risk
- ✅ **Faster approval** - Meta prefers apps with minimal permissions
- 🚀 **Better user trust** - Users see exactly what permissions you need
- 📱 **Focused functionality** - Perfect for content scheduling and posting
- 🔐 **Long-lived access** - 60-day tokens for persistent functionality
- 🗄️ **Secure storage** - Tokens stored in Supabase with proper security

## Token Management Features

### Automatic Long-lived Token Exchange
- Short-lived tokens are automatically exchanged for 60-day tokens
- No manual intervention required
- Seamless user experience

### Token Expiration Monitoring
- Real-time token expiration tracking
- Visual indicators for token status
- Automatic refresh when possible

### Page Token Management
- Long-lived page access tokens for Instagram business accounts
- Persistent access to connected pages
- Secure token storage and management

### Database Security
- Row Level Security (RLS) policies
- User isolation and data privacy
- Encrypted token storage
- Automatic cleanup of expired tokens

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**:
   - The redirect URI is already configured: `https://shaheen-webapp.vercel.app/api/auth/ig-callback`
   - Make sure you're using the production URL, not localhost

2. **"App not configured for Instagram" error**:
   - Your app is already configured and approved
   - This error shouldn't occur with the approved configuration

3. **"Insufficient permissions" error**:
   - The two required permissions are already approved
   - This error shouldn't occur

4. **"Invalid client_id" error**:
   - The client ID `1274014204192589` is already configured
   - Just make sure `FB_APP_SECRET` is set correctly

5. **"Long-lived token exchange failed" error**:
   - Check that `FB_APP_SECRET` is correct
   - Verify your app has the required permissions
   - Ensure you're using the production URL

6. **"Supabase connection failed" error**:
   - Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Verify the Instagram accounts table exists
   - Check Supabase RLS policies are configured correctly

7. **"Clerk authentication failed" error**:
   - Check that Clerk environment variables are set
   - Verify Clerk is properly configured in your app
   - Ensure user is signed in before connecting Instagram

### Debug Steps

1. Check that all environment variables are set in your `.env.local` file
2. Verify the redirect URI matches exactly: `https://shaheen-webapp.vercel.app/api/auth/ig-callback`
3. Check browser console for any client-side errors
4. Check server logs for backend errors
5. Verify token exchange is working in the Network tab
6. Check Supabase logs for database errors
7. Verify Clerk authentication is working

## Next Steps

After successful integration, you can:

1. **Test the Post Scheduler** - Schedule your first Instagram post
2. **Create Content** - Write captions and schedule posts
3. **Manage Schedule** - Plan your content calendar
4. **Scale Operations** - Schedule multiple posts in advance
5. **Monitor Tokens** - Track token expiration and refresh status
6. **Manage Accounts** - Connect and manage multiple Instagram accounts
7. **Database Monitoring** - Monitor token storage and usage in Supabase

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your `FB_APP_SECRET` is correct
3. Ensure you're using the production URL, not localhost
4. Check that all environment variables are set correctly
5. Monitor token exchange in browser Network tab
6. Verify Supabase table structure and RLS policies
7. Check Clerk authentication configuration

## Security Notes

- ✅ **Client ID is public** - This is normal and safe
- 🔒 **App Secret is private** - Never expose this in client-side code
- 🔒 **Access tokens are sensitive** - Stored securely in Supabase with encryption
- 🔒 **Use HTTPS** - Always use secure connections in production
- 🎯 **Minimal permissions** - Only requesting what you need
- 🔐 **Long-lived tokens** - 60-day persistent access with automatic refresh
- 🗄️ **Database security** - RLS policies ensure user data isolation
- 🔐 **User authentication** - Clerk handles secure user management
