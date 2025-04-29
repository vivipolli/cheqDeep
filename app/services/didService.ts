export interface DIDDocument {
  id: string;
  verificationMethod: {
    id: string;
    type: string;
    controller: string;
    publicKeyHex: string;
  }[];
  '@context': string[];
}

export async function createDID(): Promise<DIDDocument> {
  const response = await fetch('/api/did', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to create DID: ${response.statusText}`);
  }

  return response.json();
} 