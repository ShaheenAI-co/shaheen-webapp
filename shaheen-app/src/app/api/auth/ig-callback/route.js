// app/api/auth/ig-callback/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    return new Response("Instagram login failed: " + error, { status: 400 });
  }

  if (!code) {
    return new Response("No authorization code provided", { status: 400 });
  }

  try {
    // For Instagram Business API, we need to exchange the code for an access token
    // using the Facebook Graph API since Instagram Business API tokens are managed through Facebook
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FB_APP_ID || '1274014204192589',
          client_secret: process.env.FB_APP_SECRET,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shaheen-webapp.vercel.app'}/api/auth/ig-callback`,
          code: code,
        })
    );

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    console.log("Short-lived access token response:", tokenData);

    if (tokenData.error) {
      throw new Error(`Facebook API error: ${tokenData.error.message}`);
    }

    // Now exchange the short-lived token for a long-lived token (60 days)
    const longLivedTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: 'fb_exchange_token',
          client_id: process.env.FB_APP_ID || '1274014204192589',
          client_secret: process.env.FB_APP_SECRET,
          fb_exchange_token: tokenData.access_token,
        })
    );

    if (!longLivedTokenRes.ok) {
      throw new Error(`Long-lived token exchange failed: ${longLivedTokenRes.status}`);
    }

    const longLivedTokenData = await longLivedTokenRes.json();
    console.log("Long-lived access token response:", longLivedTokenData);

    if (longLivedTokenData.error) {
      throw new Error(`Facebook API error: ${longLivedTokenData.error.message}`);
    }

    // Get user's Facebook pages with long-lived tokens
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedTokenData.access_token}`
    );

    if (!pagesRes.ok) {
      throw new Error(`Failed to fetch pages: ${pagesRes.status}`);
    }

    const pagesData = await pagesRes.json();
    console.log("Pages data:", pagesData);

    // Get Instagram business accounts for each page and exchange for long-lived page tokens
    const instagramAccounts = [];
    for (const page of pagesData.data || []) {
      try {
        // Exchange page token for long-lived page token
        const pageTokenRes = await fetch(
          `https://graph.facebook.com/v19.0/oauth/access_token?` +
            new URLSearchParams({
              grant_type: 'fb_exchange_token',
              client_id: process.env.FB_APP_ID || '1274014204192589',
              client_secret: process.env.FB_APP_SECRET,
              fb_exchange_token: page.access_token,
            })
        );

        if (pageTokenRes.ok) {
          const pageTokenData = await pageTokenRes.json();
          
          // Get Instagram business account for this page
          const igRes = await fetch(
            `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${longLivedTokenData.access_token}`
          );
          
          if (igRes.ok) {
            const igData = await igRes.json();
            if (igData.instagram_business_account) {
              instagramAccounts.push({
                page_id: page.id,
                page_name: page.name,
                page_access_token: pageTokenData.access_token, // Long-lived page token
                page_token_expires_in: pageTokenData.expires_in,
                instagram_business_account_id: igData.instagram_business_account.id,
                isLongLived: true
              });
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching Instagram data for page ${page.id}:`, err);
      }
    }

    // Store the complete data with long-lived tokens (in production, save to your database)
    const userData = {
      access_token: longLivedTokenData.access_token, // Long-lived user token
      token_type: longLivedTokenData.token_type,
      expires_in: longLivedTokenData.expires_in, // ~5184000 seconds (60 days)
      isLongLived: true,
      pages: pagesData.data || [],
      instagram_accounts: instagramAccounts,
      timestamp: new Date().toISOString()
    };

    // Return success with user data
    return new Response(
      JSON.stringify({
        success: true,
        message: "Instagram Business login successful with long-lived tokens!",
        data: userData
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error("Instagram login error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function POST(req) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ success: false, error: "No authorization code provided" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Exchange code for short-lived access token using Facebook Graph API
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FB_APP_ID || '1274014204192589',
          client_secret: process.env.FB_APP_SECRET,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shaheen-webapp.vercel.app'}/api/auth/ig-callback`,
          code: code,
        })
    );

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    
    if (tokenData.error) {
      throw new Error(`Facebook API error: ${tokenData.error.message}`);
    }

    // Exchange for long-lived token
    const longLivedTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: 'fb_exchange_token',
          client_id: process.env.FB_APP_ID || '1274014204192589',
          client_secret: process.env.FB_APP_SECRET,
          fb_exchange_token: tokenData.access_token,
        })
    );

    if (!longLivedTokenRes.ok) {
      throw new Error(`Long-lived token exchange failed: ${longLivedTokenRes.status}`);
    }

    const longLivedTokenData = await longLivedTokenRes.json();

    if (longLivedTokenData.error) {
      throw new Error(`Facebook API error: ${longLivedTokenData.error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        access_token: longLivedTokenData.access_token,
        token_type: longLivedTokenData.token_type,
        expires_in: longLivedTokenData.expires_in, // ~5184000 seconds (60 days)
        isLongLived: true
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error("Instagram token exchange error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
  