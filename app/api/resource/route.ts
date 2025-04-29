import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_CHEQD_API_KEY is not set');
    return NextResponse.json({ error: 'NEXT_PUBLIC_CHEQD_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { did, content, metadata } = await request.json();
    console.log('Creating resource with:', { did, metadata });

    const params = new URLSearchParams();
    params.append('data', content);
    params.append('encoding', 'base64url');
    params.append('name', metadata.name);
    params.append('type', metadata.type);

    if (metadata.version) {
      params.append('version', metadata.version);
    }
    if (metadata.alsoKnownAs) {
      params.append('alsoKnownAs', JSON.stringify(metadata.alsoKnownAs));
    }
    if (metadata.publicKeyHexs) {
      params.append('publicKeyHexs', JSON.stringify(metadata.publicKeyHexs));
    }

    console.log('Resource params:', Object.fromEntries(params));

    const response = await fetch(`https://api.cheqd.io/resource/create/${did}`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create resource:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: 'Failed to create resource',
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Resource created successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ 
      error: 'Failed to create resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 