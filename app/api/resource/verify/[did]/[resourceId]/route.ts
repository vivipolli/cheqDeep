import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.CHEQD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const url = new URL(request.url);
  const did = url.pathname.split('/')[4];
  const resourceId = url.pathname.split('/')[5];

  try {
    const response = await fetch(`https://studio-api.cheqd.net/resource/verify/${did}/${resourceId}`, {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to verify resource: ${errorText}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error verifying resource:', error);
    return NextResponse.json(
      { error: 'Failed to verify resource' },
      { status: 500 }
    );
  }
} 