import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_CHEQD_API_KEY is not set');
    return NextResponse.json({ error: 'NEXT_PUBLIC_CHEQD_API_KEY is not set' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { did, data, encoding, name, type } = body;

    if (!did || !data || !encoding || !name || !type) {
      console.error('Missing required fields:', { did, data, encoding, name, type });
      return NextResponse.json(
        { error: 'Missing required fields', details: 'did, data, encoding, name, and type are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://studio-api.cheqd.net/resource/create/${did}`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data,
        encoding,
        name,
        type
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

    const responseData = await response.json();
    console.log('Resource created successfully:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ 
      error: 'Failed to create resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 