import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_CHEQD_API_KEY is not set');
    return NextResponse.json({ error: 'NEXT_PUBLIC_CHEQD_API_KEY is not set' }, { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('network', 'testnet');
  params.append('identifierFormatType', 'uuid');
  params.append('verificationMethodType', 'Ed25519VerificationKey2018');
  params.append('@context', 'https://www.w3.org/ns/did/v1');

  try {
    console.log('Creating DID with params:', Object.fromEntries(params));
    
    const response = await fetch('https://api.cheqd.io/did/create', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create DID:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: 'Failed to create DID',
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('DID created successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating DID:', error);
    return NextResponse.json({ 
      error: 'Failed to create DID',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 