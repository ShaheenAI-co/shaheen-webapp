import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { instagramId, accessToken, payload } = await request.json();
    
    console.log('Instagram media publish API called with:', { instagramId, payload });
    
    if (!instagramId || !accessToken) {
      return NextResponse.json(
        { error: 'Instagram ID and access token are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/v19.0/${instagramId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
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
    console.log('Instagram API response:', data);
    
    if (data.error) {
      return NextResponse.json(
        { error: `Instagram API error: ${data.error.message || data.error.type}` },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Instagram media publish API:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
