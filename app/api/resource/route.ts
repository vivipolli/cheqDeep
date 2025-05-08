import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_CHEQD_API_KEY is not set');
    return NextResponse.json({ error: 'NEXT_PUBLIC_CHEQD_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { did, content, metadata } = await request.json();

    if (!did || !content || !metadata) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'did, content, and metadata are required'
      }, { status: 400 });
    }

    console.log('Creating resource with params:', { did, content, metadata });

    const response = await fetch(`https://studio-api.cheqd.net/resource/create/${did}`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        content,
        metadata: {
          ...metadata,
          type: 'VerifiableCredential',
          issuer: did,
          issuanceDate: new Date().toISOString(),
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://www.w3.org/ns/did/v1'
          ]
        }
      })
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