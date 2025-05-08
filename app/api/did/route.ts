import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_CHEQD_API_KEY is not set');
    return NextResponse.json({ error: 'NEXT_PUBLIC_CHEQD_API_KEY is not set' }, { status: 500 });
  }

  try {
    // Step 1: Create a keypair
    const keyResponse = await fetch('https://studio-api.cheqd.net/key/create', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!keyResponse.ok) {
      const errorText = await keyResponse.text();
      console.error('Failed to create keypair:', {
        status: keyResponse.status,
        statusText: keyResponse.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: 'Failed to create keypair',
        details: errorText
      }, { status: keyResponse.status });
    }

    const keyData = await keyResponse.json();
    console.log('Keypair created successfully:', {
      kid: keyData.kid,
      type: keyData.type
    });

    // Step 2: Create DID with the generated key
    const didParams = {
      network: 'testnet',
      identifierFormatType: 'uuid',
      assertionMethod: true,
      options: {
        key: keyData.kid,
        verificationMethodType: 'Ed25519VerificationKey2018'
      }
    };

    console.log('Creating DID with params:', didParams);
    
    const didResponse = await fetch('https://studio-api.cheqd.net/did/create', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(didParams)
    });

    if (!didResponse.ok) {
      const errorText = await didResponse.text();
      console.error('Failed to create DID:', {
        status: didResponse.status,
        statusText: didResponse.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: 'Failed to create DID',
        details: errorText
      }, { status: didResponse.status });
    }

    const didData = await didResponse.json();
    console.log('DID created successfully:', {
      did: didData.did,
      keys: didData.keys
    });

    return NextResponse.json({
      did: didData.did,
      keys: didData.keys,
      services: didData.services,
      controllerKeys: didData.controllerKeys
    });
  } catch (error) {
    console.error('Error in DID creation process:', error);
    return NextResponse.json({ 
      error: 'Failed to create DID',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 