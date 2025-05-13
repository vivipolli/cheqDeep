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

interface ResourceResponse {
  resource: DIDResource;
  thumbnailUrl?: string;
}

interface ResourceMetadata {
  title: string;
  description: string;
  fileType: string;
  fileSize: number;
  hash: string;
  exifData?: {
    creationDate?: string;
    deviceInfo?: string;
    location?: string;
    resolution?: string;
    software?: string;
  };
}

export async function createResource(did: string, content: string, metadata: ResourceMetadata): Promise<ResourceResponse> {
  try {
    // Convert content to base64url
    const base64Content = btoa(content)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('/api/resource/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        did,
        data: base64Content,
        encoding: 'base64url',
        name: metadata.title,
        type: 'MediaVerification',
        metadata
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to create resource');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
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

export async function verifyResource(resourceId: string) {
  try {
    const response = await fetch(`/api/resource/${resourceId}/verify`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to verify resource');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying resource:', error);
    throw error;
  }
} 