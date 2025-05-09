import { DIDDocument } from '../types/did';

export async function createDID(): Promise<DIDDocument> {
  try {
    const response = await fetch('/api/did', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationMethodType: 'Ed25519VerificationKey2020'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to create DID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating DID:', error);
    throw error;
  }
} 