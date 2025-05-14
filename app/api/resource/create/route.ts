import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_CHEQD_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { did, data, encoding, name, type, metadata } = body;

    if (!did || !data || !encoding || !name || !type) {
      console.error('Missing required fields:', { did, data, encoding, name, type });
      return NextResponse.json(
        { error: 'Missing required fields', details: 'did, data, encoding, name, and type are required' },
        { status: 400 }
      );
    }

    const parsedData = JSON.parse(atob(data));
    const updatedData = {
      ...parsedData,
      metadata
    };

    const updatedBase64Data = btoa(JSON.stringify(updatedData))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch(`https://studio-api.cheqd.net/resource/create/${did}`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_CHEQD_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data: updatedBase64Data,
        encoding,
        name,
        type
      })
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json({ 
        error: 'Failed to create resource',
        details: errorText
      }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create resource', details: error },
      { status: 500 }
    );
  }
} 