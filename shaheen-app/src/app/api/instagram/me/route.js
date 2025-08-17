import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accessToken } = await request.json();
    
    console.log('Instagram /me API called to get account info');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Call Instagram's /me endpoint to get the Professional Account ID
    const response = await fetch(
      `https://graph.instagram.com/v19.0/me?fields=id,username,account_type&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Instagram API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Instagram /me response:', data);
    
    if (data.error) {
      return NextResponse.json(
        { error: `Instagram API error: ${data.error.message || data.error.type}` },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Instagram /me API:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
