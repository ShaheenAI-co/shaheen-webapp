"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, CheckCircle, XCircle, Loader2, RefreshCw, Clock, Users, Trash2 } from 'lucide-react';
import { useInstagramAuth } from '@/Hooks/useInstagramAuth';

const InstagramConnectionStatus = () => {
  const { 
    isConnected, 
    isLoading, 
    userData, 
    error, 
    supabaseAccounts,
    user,
    isClerkLoaded,
    login, 
    logout, 
    refreshTokens,
    disconnectAccount,
    getTokenExpirationInfo 
  } = useInstagramAuth();

  // Don't render if Clerk is still loading
  if (!isClerkLoaded) {
    return (
      <Card className="w-[800px] bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span className="ml-2 text-white">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return (
      <Card className="w-[800px] bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Instagram className="w-5 h-5" />
            Instagram Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">Please sign in to connect your Instagram accounts.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Instagram className="w-5 h-5" />
            Instagram Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span className="ml-2 text-white">Connecting to Instagram...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[800px] bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Instagram className="w-5 h-5" />
          Instagram Connection
        </CardTitle>
        <CardDescription className="text-gray-300">
          Connect your Instagram accounts to schedule posts and manage content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isConnected && supabaseAccounts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Connected to Instagram</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                {supabaseAccounts.length} Account{supabaseAccounts.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            {/* Connected Accounts List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Users className="w-4 h-4" />
                Connected Accounts
              </h4>
              
              {supabaseAccounts.map((account) => {
                const isCurrentAccount = userData && userData.instagram_id === account.instagram_id;
                // const expiresAt = new Date(account.expires_at);
                // const now = new Date();
                // const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                // const isExpired = expiresAt <= now;
                // const needsRefresh = daysRemaining <= 7;

                return (
                  <div key={account.instagram_id} className="p-3 bg-white/5 border border-white/10 rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{account.username}</span>
                          {isCurrentAccount && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Active
                            </Badge>
                          )}
                          {/* <Badge 
                            variant="secondary" 
                            className={`${
                              daysRemaining > 30 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : daysRemaining > 7
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {isExpired ? 'Expired' : `${daysRemaining} days left`}
                          </Badge> */}
                        </div>
                        
                        <div className="text-xs text-gray-400 space-y-1">
                          {/* <div>Instagram ID: {account.instagram_id}</div> */}
                          <div>Connected: {new Date(account.connected_at).toLocaleDateString()}</div>
                          {/* {account.last_posted_at && (
                            <div>Last Posted: {new Date(account.last_posted_at).toLocaleDateString()}</div>
                          )} */}
                          {/* <div>Expires: {expiresAt.toLocaleDateString()} at {expiresAt.toLocaleTimeString()}</div> */}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => disconnectAccount(account.instagram_id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* <div className="flex gap-2">
              <Button
                onClick={refreshTokens}
                variant="outline"
                className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Tokens
              </Button>
              
              <Button
                onClick={logout}
                variant="outline"
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Disconnect All
              </Button>
            </div> */}
            
            <Button
              onClick={logout}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Disconnect All
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Not connected to Instagram</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                Disconnected
              </Badge>
            </div>
            
            <p className="text-sm text-gray-300">
              Connect your Instagram accounts to start scheduling posts and managing your content.
              {/* <br />
              <span className="text-xs text-gray-400 mt-1 block">
                🔒 Uses long-lived tokens (60 days) stored securely in Supabase
              </span> */}
            </p>
            
            <Button
              onClick={login}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Connect Instagram
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramConnectionStatus;
