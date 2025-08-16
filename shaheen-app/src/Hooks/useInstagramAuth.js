"use client";
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { instagramAuth } from '@/lib/instagram-auth';

export const useInstagramAuth = () => {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [supabaseAccounts, setSupabaseAccounts] = useState([]);

  // Check connection status on mount and load accounts from Supabase
  useEffect(() => {
    const checkAndLoadAccounts = async () => {
      if (!isClerkLoaded || !user) return;

      try {
        // Load Instagram accounts from Supabase
        const accounts = await instagramAuth.getAccountsFromSupabase(user.id);
        setSupabaseAccounts(accounts);

        if (accounts.length > 0) {
          // Check if any account has valid tokens
          const validAccount = accounts.find(account => {
            const now = new Date();
            const expiresAt = new Date(account.expires_at);
            return expiresAt > now;
          });

          if (validAccount) {
            setIsConnected(true);
            setUserData({
              access_token: validAccount.access_token,
              token_type: 'bearer',
              expires_in: Math.floor((new Date(validAccount.expires_at) - new Date()) / 1000),
              isLongLived: true,
              timestamp: validAccount.connected_at,
              instagram_id: validAccount.instagram_id,
              username: validAccount.username
            });
          }
        }
      } catch (err) {
        console.error('Error loading Instagram accounts from Supabase:', err);
        setError(err.message);
      }
    };

    checkAndLoadAccounts();
  }, [isClerkLoaded, user]);

  // Handle Instagram login
  const login = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const authUrl = instagramAuth.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [user]);

  // Handle Instagram logout
  const logout = useCallback(async () => {
    if (!user) return;

    try {
      // Disconnect all Instagram accounts
      for (const account of supabaseAccounts) {
        await instagramAuth.disconnectAccount(account.instagram_id, user.id);
      }

      // Clear local state
      setSupabaseAccounts([]);
      setIsConnected(false);
      setUserData(null);
      setError(null);
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err.message);
    }
  }, [user, supabaseAccounts]);

  // Check if we're returning from Instagram OAuth
  const checkOAuthReturn = useCallback(async () => {
    if (!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      setError(`Instagram login failed: ${error}`);
      return;
    }
    
    if (code) {
      setIsLoading(true);
      try {
        // Exchange code for token (this now returns long-lived tokens automatically)
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
        
        if (data.success) {
          // Save Instagram accounts to Supabase
          if (data.data && data.data.instagram_accounts) {
            const savedAccounts = await instagramAuth.saveAccountsToSupabase(
              data.data.instagram_accounts, 
              user.id
            );
            setSupabaseAccounts(savedAccounts);

            // Set user data from the first account
            if (savedAccounts.length > 0) {
              const firstAccount = savedAccounts[0];
              setUserData({
                access_token: firstAccount.access_token,
                token_type: 'bearer',
                expires_in: Math.floor((new Date(firstAccount.expires_at) - new Date()) / 1000),
                isLongLived: true,
                timestamp: firstAccount.connected_at,
                instagram_id: firstAccount.instagram_id,
                username: firstAccount.username
              });
              setIsConnected(true);
            }
          }
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  // Check OAuth return on mount
  useEffect(() => {
    checkOAuthReturn();
  }, [checkOAuthReturn]);

  // Function to manually refresh tokens
  const refreshTokens = useCallback(async () => {
    if (!userData || !user) return;
    
    try {
      setIsLoading(true);
      const refreshedCredentials = await instagramAuth.refreshTokenIfNeeded(userData);
      setUserData(refreshedCredentials);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      // If refresh fails, user needs to reconnect
      setIsConnected(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [userData, user]);

  // Check token expiration status
  const isTokenExpired = useCallback(() => {
    if (!userData) return true;
    return instagramAuth.isTokenExpired(userData);
  }, [userData]);

  // Get token expiration info
  const getTokenExpirationInfo = useCallback(() => {
    if (!userData || !userData.timestamp || !userData.expires_in) {
      return { isExpired: true, expiresAt: null, daysRemaining: 0 };
    }

    const tokenCreated = new Date(userData.timestamp);
    const tokenExpires = new Date(tokenCreated.getTime() + (userData.expires_in * 1000));
    const now = new Date();
    const daysRemaining = Math.ceil((tokenExpires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      isExpired: now.getTime() > tokenExpires.getTime(),
      expiresAt: tokenExpires,
      daysRemaining: Math.max(0, daysRemaining)
    };
  }, [userData]);

  // Disconnect specific Instagram account
  const disconnectAccount = useCallback(async (instagramId) => {
    if (!user) return;

    try {
      setIsLoading(true);
      await instagramAuth.disconnectAccount(instagramId, user.id);
      
      // Update local state
      setSupabaseAccounts(prev => prev.filter(acc => acc.instagram_id !== instagramId));
      
      // If this was the currently connected account, clear connection
      if (userData && userData.instagram_id === instagramId) {
        setIsConnected(false);
        setUserData(null);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, userData]);

  // Get accounts that need token refresh
  const getAccountsNeedingRefresh = useCallback(async () => {
    if (!user) return [];

    try {
      const accounts = await instagramAuth.getAccountsNeedingRefresh(user.id);
      return accounts;
    } catch (err) {
      console.error('Error getting accounts needing refresh:', err);
      return [];
    }
  }, [user]);

  return {
    isConnected,
    isLoading,
    userData,
    error,
    supabaseAccounts,
    user,
    isClerkLoaded,
    login,
    logout,
    checkOAuthReturn,
    refreshTokens,
    isTokenExpired: isTokenExpired(),
    getTokenExpirationInfo,
    disconnectAccount,
    getAccountsNeedingRefresh,
    checkAndRefreshTokens: () => checkOAuthReturn()
  };
};
