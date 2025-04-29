import { createHash } from 'crypto';

export interface DIDResource {
  resourceURI: string;
  resourceCollectionId: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  mediaType: string;
  resourceVersion: string;
  checksum: string;
  created: string;
}

export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = createHash('sha256');
  hash.update(Buffer.from(buffer));
  return hash.digest('hex');
}

export async function createDIDResource(
  file: File,
  hash: string,
  did: string
): Promise<DIDResource> {
  const apiKey = process.env.NEXT_PUBLIC_NEXT_PUBLIC_CHEQD_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_NEXT_PUBLIC_CHEQD_API_KEY is not set');
  }

  const base64Data = await file.arrayBuffer().then(buffer => 
    Buffer.from(buffer).toString('base64url')
  );

  const response = await fetch(`https://api.cheqd.io/resource/create/${did}`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      data: base64Data,
      encoding: 'base64url',
      name: `media-${hash.substring(0, 8)}`,
      type: 'MediaVerification',
      version: '1.0',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create DID resource: ${response.statusText}`);
  }

  return response.json();
} 