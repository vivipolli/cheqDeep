import { MediaMetadata } from '../types/media';

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
  nextVersionId?: string;
  previousVersionId?: string;
}

export interface ResourceMetadata {
  name: string;
  type: string;
  version?: string;
  alsoKnownAs?: {
    id: string;
    type: string;
  }[];
  publicKeyHexs?: string[];
}

export async function createResource(did: string, mediaHash: string, metadata: MediaMetadata): Promise<DIDResource> {
  try {
    const response = await fetch('/api/resource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        did,
        content: mediaHash,
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
      throw new Error(`Failed to create resource: ${errorText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error creating resource:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create resource: ${error.message}`);
    }
    throw new Error('Failed to create resource: Unknown error');
  }
}

export async function getResource(did: string, resourceId: string): Promise<DIDResource> {
  try {
    const response = await fetch(`/api/resource/${did}/${resourceId}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get resource: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting resource:', error);
    throw error;
  }
}

interface VerificationDetails {
  timestamp: string;
  hash: string;
  signature: string;
  verifiedBy: string;
}

export async function verifyResource(did: string, resourceId: string, mediaHash: string): Promise<{ verified: boolean; details: VerificationDetails }> {
  try {
    const response = await fetch(`/api/resource/verify/${did}/${resourceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mediaHash })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to verify resource: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying resource:', error);
    throw error;
  }
} 