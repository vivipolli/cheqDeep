import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_CHEQD_API_KEY is not set' }, { status: 500 });
  }

  try {
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
      return NextResponse.json({ 
        error: 'Failed to create keypair',
        details: errorText
      }, { status: keyResponse.status });
    }

    const keyData = await keyResponse.json();

    const didDocResponse = await fetch(
      `https://did-registrar.cheqd.net/1.0/did-document?verificationMethod=Ed25519VerificationKey2020&methodSpecificIdAlgo=uuid&network=testnet&publicKeyHex=${keyData.publicKeyHex}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!didDocResponse.ok) {
      const errorText = await didDocResponse.text();
      return NextResponse.json({ 
        error: 'Failed to get DID document template',
        details: errorText
      }, { status: didDocResponse.status });
    }

    const didDocData = await didDocResponse.json();

    const didResponse = await fetch('https://studio-api.cheqd.net/did/create', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        network: 'testnet',
        identifierFormatType: 'uuid',
        assertionMethod: true,
        options: {
          key: keyData.kid,
          verificationMethodType: 'Ed25519VerificationKey2018'
        },
        didDocument: {
          ...didDocData.didDoc,
        }
      })
    });

    if (!didResponse.ok) {
      const errorText = await didResponse.text();
      return NextResponse.json({ 
        error: 'Failed to create DID',
        details: errorText
      }, { status: didResponse.status });
    }

    const didData = await didResponse.json();

    return NextResponse.json({
      did: didData.did,
      keys: didData.keys,
      services: didData.services,
      controllerKeys: didData.controllerKeys
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create DID',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 