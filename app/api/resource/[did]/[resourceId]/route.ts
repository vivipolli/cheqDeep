import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const url = new URL(request.url);
  const did = url.pathname.split('/')[3];
  const resourceId = url.pathname.split('/')[4];

  try {
    const response = await fetch(`https://studio-api.cheqd.net/resource/${did}/${resourceId}`, {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get resource: ${errorText}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error getting resource:', error);
    return NextResponse.json(
      { error: 'Failed to get resource' },
      { status: 500 }
    );
  }
} 