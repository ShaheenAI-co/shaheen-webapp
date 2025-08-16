// Instagram authentication service
import { supabaseInstagram } from './supabase-instagram';

export class InstagramAuthService {
  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_FB_APP_ID || '1274014204192589';
    this.clientSecret = process.env.FB_APP_SECRET;
    this.redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/ig-callback`;
  }

  // Get Instagram OAuth URL using the Instagram Business API endpoint as provided by Meta
  // Using the new scope values as documented by Meta (replacing deprecated business_* scopes)
  getAuthUrl(state = 'instagram_login') {
    const scope = 'instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments';
    
    return `https://www.instagram.com/oauth/authorize?` +
      new URLSearchParams({
        force_reauth: 'true',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        response_type: 'code',
        scope: scope,
        state: state
      });
  }

  // Exchange authorization code for short-lived access token
  async exchangeCodeForToken(code) {
    try {
      const response = await fetch('/api/auth/ig-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Exchange short-lived token for long-lived token (60 days) using Instagram API
  async exchangeForLongLivedToken(shortLivedToken) {
    try {
      const response = await fetch(
        `https://graph.instagram.com/access_token?` +
        new URLSearchParams({
          grant_type: 'ig_exchange_token',
          client_secret: this.clientSecret,
          access_token: shortLivedToken,
        })
      );

      if (!response.ok) {
        throw new Error('Failed to exchange for long-lived token');
      }

      const data = await response.json();
      
      if (data.error_type) {
        throw new Error(`Instagram API error: ${data.error_message || data.error_type}`);
      }

      return {
        access_token: data.access_token,
        token_type: data.token_type || 'Bearer',
        expires_in: data.expires_in, // This will be ~5184000 seconds (60 days)
        isLongLived: true
      };
    } catch (error) {
      console.error('Error exchanging for long-lived token:', error);
      throw error;
    }
  }

  // Get Instagram business account info (Instagram Business API doesn't use page tokens)
  async getInstagramBusinessAccount(userAccessToken) {
    try {
      // For Instagram Business API, we get the account info directly
      const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${userAccessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram business account');
      }

      const data = await response.json();
      
      // Return in the same format expected by the rest of the system
      return [{
        page_id: data.id,
        page_name: data.username,
        page_access_token: userAccessToken,
        page_token_expires_in: 5184000, // 60 days in seconds
        instagram_business_account_id: data.id,
        isLongLived: true
      }];
    } catch (error) {
      console.error('Error getting Instagram business account:', error);
      throw error;
    }
  }

  // Save Instagram accounts to Supabase
  async saveAccountsToSupabase(instagramAccounts, clerkUserId) {
    try {
      if (!clerkUserId) {
        throw new Error('Clerk user ID is required to save Instagram accounts');
      }

      if (!instagramAccounts || instagramAccounts.length === 0) {
        console.log('No Instagram accounts to save');
        return [];
      }

      // Save all accounts to Supabase
      const savedAccounts = await supabaseInstagram.saveInstagramAccounts(instagramAccounts, clerkUserId);
      console.log('Instagram accounts saved to Supabase:', savedAccounts);

      return savedAccounts;
    } catch (error) {
      console.error('Error saving Instagram accounts to Supabase:', error);
      throw error;
    }
  }

  // Get Instagram accounts from Supabase
  async getAccountsFromSupabase(clerkUserId) {
    try {
      if (!clerkUserId) {
        throw new Error('Clerk user ID is required to fetch Instagram accounts');
      }

      const accounts = await supabaseInstagram.getInstagramAccounts(clerkUserId);
      console.log('Instagram accounts fetched from Supabase:', accounts);

      return accounts;
    } catch (error) {
      console.error('Error fetching Instagram accounts from Supabase:', error);
      throw error;
    }
  }

  // Check if token is expired or will expire soon
  isTokenExpired(tokenData) {
    if (!tokenData || !tokenData.timestamp || !tokenData.expires_in) {
      return true;
    }

    const tokenCreated = new Date(tokenData.timestamp);
    const tokenExpires = new Date(tokenCreated.getTime() + (tokenData.expires_in * 1000));
    const now = new Date();
    
    // Consider token expired if it expires within 24 hours
    const bufferTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return now.getTime() > (tokenExpires.getTime() - bufferTime);
  }

  // Refresh token if it's expired or will expire soon
  async refreshTokenIfNeeded(tokenData) {
    if (!this.isTokenExpired(tokenData)) {
      return tokenData; // Token is still valid
    }

    try {
      // If we have a short-lived token, exchange it for a long-lived one
      if (tokenData.access_token && !tokenData.isLongLived) {
        const longLivedToken = await this.exchangeForLongLivedToken(tokenData.access_token);
        
        // Update stored credentials
        const updatedCredentials = {
          ...tokenData,
          ...longLivedToken,
          timestamp: new Date().toISOString()
        };
        
        this.storeCredentials(updatedCredentials);
        return updatedCredentials;
      }

      // If we have a long-lived token that's expired, try to refresh it
      if (tokenData.access_token && tokenData.isLongLived) {
        try {
          const refreshedToken = await this.refreshLongLivedToken(tokenData.access_token);
          
          // Update stored credentials
          const updatedCredentials = {
            ...tokenData,
            ...refreshedToken,
            timestamp: new Date().toISOString()
          };
          
          this.storeCredentials(updatedCredentials);
          return updatedCredentials;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // If refresh fails, user needs to re-authenticate
          throw new Error('Long-lived token has expired and could not be refreshed. Please reconnect your Instagram account.');
        }
      }

      // If we can't handle this token type, user needs to re-authenticate
      throw new Error('Token type not supported for refresh. Please reconnect your Instagram account.');
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Get Instagram user profile using Instagram Graph API
  async getUserProfile(accessToken) {
    try {
      // For Instagram Business API, use the Instagram Graph API
      const response = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram user info');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Instagram user profile:', error);
      throw error;
    }
  }

  // Get Instagram business accounts
  async getBusinessAccounts(accessToken) {
    try {
      // For Instagram Business API, we get the account info directly
      const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram business account');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Instagram business account:', error);
      throw error;
    }
  }

  // Refresh a long-lived access token for another 60 days
  async refreshLongLivedToken(longLivedToken) {
    try {
      const response = await fetch(
        `https://graph.instagram.com/refresh_access_token?` +
        new URLSearchParams({
          grant_type: 'ig_refresh_token',
          access_token: longLivedToken,
        })
      );

      if (!response.ok) {
        throw new Error('Failed to refresh long-lived token');
      }

      const data = await response.json();
      
      if (data.error_type) {
        throw new Error(`Instagram API error: ${data.error_message || data.error_type}`);
      }

      return {
        access_token: data.access_token,
        token_type: data.token_type || 'Bearer',
        expires_in: data.expires_in, // Another 60 days
        isLongLived: true
      };
    } catch (error) {
      console.error('Error refreshing long-lived token:', error);
      throw error;
    }
  }

  // Store Instagram credentials in localStorage (for demo purposes)
  // In production, store this securely in your backend
  storeCredentials(credentials) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('instagram_credentials', JSON.stringify(credentials));
    }
  }

  // Get stored Instagram credentials
  getStoredCredentials() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('instagram_credentials');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  // Clear stored credentials
  clearCredentials() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('instagram_credentials');
    }
  }

  // Check if user is connected to Instagram
  isConnected() {
    const credentials = this.getStoredCredentials();
    return credentials && credentials.access_token && !this.isTokenExpired(credentials);
  }

  // Disconnect Instagram account (remove from Supabase and local storage)
  async disconnectAccount(instagramId, clerkUserId) {
    try {
      // Remove from Supabase
      if (clerkUserId && instagramId) {
        await supabaseInstagram.deleteInstagramAccount(instagramId, clerkUserId);
        console.log('Instagram account removed from Supabase');
      }

      // Clear local storage
      this.clearCredentials();
      console.log('Instagram credentials cleared from local storage');

      return true;
    } catch (error) {
      console.error('Error disconnecting Instagram account:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const instagramAuth = new InstagramAuthService();
