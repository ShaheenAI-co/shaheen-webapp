import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { instagramId, accessToken } = await request.json();
    
    console.log('Instagram publishing limit API called with:', { instagramId });
    
    if (!instagramId || !accessToken) {
      return NextResponse.json(
        { error: 'Instagram ID and access token are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/v19.0/${instagramId}/content_publishing_limit?access_token=${accessToken}`
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
    console.error('Error in Instagram publishing limit API:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
