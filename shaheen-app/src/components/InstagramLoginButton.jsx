"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const InstagramLoginButton = ({ className, variant = "outline", children }) => {
  const handleInstagramLogin = () => {
    // Instagram OAuth flow
    const clientId = process.env.NEXT_PUBLIC_FB_APP_ID;
    const redirectUri = `${window.location.origin}/api/auth/ig-callback`;
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list';
    
    const instagramAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        response_type: 'code',
        state: 'instagram_login' // Optional state parameter for security
      });

    // Open Instagram OAuth in a popup or redirect
    window.location.href = instagramAuthUrl;
  };

  return (
    <Button
      type="button"
      onClick={handleInstagramLogin}
      variant={variant}
      className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none cursor-pointer text-white hover:from-purple-600 hover:to-pink-600 h-10 md:h-12 ${className || ''}`}
    >
      <Instagram className="w-4 h-4 md:w-5 md:h-5 mr-2" />
      {children || "Connect Instagram"}
    </Button>
  );
};

export default InstagramLoginButton;
