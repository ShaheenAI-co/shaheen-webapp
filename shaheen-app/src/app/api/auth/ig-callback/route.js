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
    // using the Instagram Graph API endpoint
    const tokenRes = await fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.FB_APP_ID || '1274014204192589',
          client_secret: process.env.FB_APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: 'https://shaheen-ai.com/api/auth/ig-callback',
          code: code,
        })
      }
    );

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Instagram token exchange failed:", errorText);
      throw new Error(`Token exchange failed: ${tokenRes.status} - ${errorText}`);
    }

    const tokenData = await tokenRes.json();
    console.log("Instagram access token response:", tokenData);

    if (tokenData.error_type) {
      throw new Error(`Instagram API error: ${tokenData.error_message || tokenData.error_type}`);
    }

    // According to the docs, the response has a 'data' array with the first item containing our token
    const shortLivedToken = tokenData.data && tokenData.data[0] ? tokenData.data[0].access_token : tokenData.access_token;
    const userId = tokenData.data && tokenData.data[0] ? tokenData.data[0].user_id : tokenData.user_id;
    
    if (!shortLivedToken) {
      throw new Error('No access token received from Instagram');
    }

    // Now exchange the short-lived token for a long-lived token (60 days)
    const longLivedTokenRes = await fetch(
      `https://graph.instagram.com/access_token?` +
      new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: process.env.FB_APP_SECRET,
        access_token: shortLivedToken,
      })
    );

    if (!longLivedTokenRes.ok) {
      const errorText = await longLivedTokenRes.text();
      console.error("Long-lived token exchange failed:", errorText);
      throw new Error(`Long-lived token exchange failed: ${longLivedTokenRes.status} - ${errorText}`);
    }

    const longLivedTokenData = await longLivedTokenRes.json();
    console.log("Long-lived token response:", longLivedTokenData);

    if (longLivedTokenData.error_type) {
      throw new Error(`Instagram API error: ${longLivedTokenData.error_message || longLivedTokenData.error_type}`);
    }

    // Get the user's Instagram business account information using the long-lived token
    const userRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedTokenData.access_token}`
    );

    if (!userRes.ok) {
      throw new Error(`Failed to fetch Instagram user info: ${userRes.status}`);
    }

    const userData = await userRes.json();
    console.log("Instagram user data:", userData);

    // Create Instagram account data structure
    const instagramAccount = {
      instagram_business_account_id: userData.id,
      username: userData.username,
      page_access_token: longLivedTokenData.access_token, // Use the long-lived token
      page_token_expires_in: longLivedTokenData.expires_in || 5184000, // 60 days in seconds
      page_name: userData.username,
      isLongLived: true
    };

    // Store the complete data (in production, save to your database)
    const responseData = {
      access_token: longLivedTokenData.access_token, // Use the long-lived token
      token_type: longLivedTokenData.token_type || 'Bearer',
      expires_in: longLivedTokenData.expires_in || 5184000, // ~5184000 seconds (60 days)
      isLongLived: true,
      instagram_accounts: [instagramAccount],
      timestamp: new Date().toISOString()
    };

    // Redirect user back to dashboard with success message
    const dashboardUrl = `https://shaheen-ai.com/dashboard?instagram_success=true&message=${encodeURIComponent('Instagram Business login successful with long-lived tokens!')}`;
    
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Instagram Login Success</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center; padding: 2rem;">
              <h2 style="color: #10b981;">✅ Instagram Login Successful!</h2>
              <p>Redirecting you back to the dashboard...</p>
              <div style="margin-top: 1rem;">
                <a href="${dashboardUrl}" style="color: #3b82f6; text-decoration: none;">Click here if you're not redirected automatically</a>
              </div>
            </div>
          </div>
          <script>
            // Store the Instagram data in localStorage for the frontend to pick up
            localStorage.setItem('instagram_auth_data', '${JSON.stringify(responseData).replace(/'/g, "\\'")}');
            
            // Redirect to dashboard
            setTimeout(() => {
              window.location.href = '${dashboardUrl}';
            }, 2000);
          </script>
        </body>
      </html>`,
      { 
        status: 200,
        headers: {
          'Content-Type': 'text/html'
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

    // Exchange code for access token using Instagram API
    const tokenRes = await fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.FB_APP_ID || '1274014204192589',
          client_secret: process.env.FB_APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: 'https://shaheen-ai.com/api/auth/ig-callback',
          code: code,
        })
      }
    );

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      throw new Error(`Token exchange failed: ${tokenRes.status} - ${errorText}`);
    }

    const tokenData = await tokenRes.json();
    
    if (tokenData.error_type) {
      throw new Error(`Instagram API error: ${tokenData.error_message || tokenData.error_type}`);
    }

    // According to the docs, the response has a 'data' array with the first item containing our token
    const shortLivedToken = tokenData.data && tokenData.data[0] ? tokenData.data[0].access_token : tokenData.access_token;
    
    if (!shortLivedToken) {
      throw new Error('No access token received from Instagram');
    }

    // Now exchange the short-lived token for a long-lived token (60 days)
    const longLivedTokenRes = await fetch(
      `https://graph.instagram.com/access_token?` +
      new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: process.env.FB_APP_SECRET,
        access_token: shortLivedToken,
      })
    );

    if (!longLivedTokenRes.ok) {
      const errorText = await longLivedTokenRes.text();
      throw new Error(`Long-lived token exchange failed: ${longLivedTokenRes.status} - ${errorText}`);
    }

    const longLivedTokenData = await longLivedTokenRes.json();
    
    if (longLivedTokenData.error_type) {
      throw new Error(`Instagram API error: ${longLivedTokenData.error_message || longLivedTokenData.error_type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        access_token: longLivedTokenData.access_token,
        token_type: longLivedTokenData.token_type || 'Bearer',
        expires_in: longLivedTokenData.expires_in || 5184000, // ~5184000 seconds (60 days)
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
  
