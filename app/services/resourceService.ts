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

export async function createResource(
  did: string,
  content: string,
  metadata: ResourceMetadata
): Promise<DIDResource> {
  const response = await fetch('/api/resource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      did,
      content,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create resource: ${response.statusText}`);
  }

  return response.json();
} 