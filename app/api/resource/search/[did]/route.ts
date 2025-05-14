import { NextResponse } from 'next/server';

interface ResourceMetadata {
  resourceURI: string;
  resourceName: string;
  resourceType: string;
  mediaType: string;
  resourceVersion: string;
  created: string;
  checksum: string;
  metadata?: {
    thumbnailUrl?: string;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
export async function GET(request: any, context: any) {
  const { did } = context.params;

  if (!process.env.NEXT_PUBLIC_CHEQD_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const didResponse = await fetch(
      `https://studio-api.cheqd.net/resource/search/${did}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHEQD_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!didResponse.ok) {
      throw new Error('Failed to fetch DID document');
    }

    const didData: any = await didResponse.json();

    const resourcesWithContent = await Promise.all(
      didData.didDocumentMetadata.linkedResourceMetadata.map(async (resource: ResourceMetadata) => {
        try {
          const resourceId = resource.resourceURI.split('/').pop();
          
          const resolverResponse = await fetch(
            `https://resolver.cheqd.net/1.0/identifiers/${did}/resources/${resourceId}`
          );

          if (!resolverResponse.ok) {
            return resource;
          }

          const resolverData = await resolverResponse.json();

          if (resolverData.metadata?.thumbnailUrl) {
            try {
              await fetch(resolverData.metadata.thumbnailUrl);
            } catch (error) {
              console.error('Error checking thumbnail:', error);
            }
          }

          return {
            ...resource,
            metadata: resolverData.metadata
          };
        } catch (error) {
          console.error('Error processing resource:', error);
          return resource;
        }
      })
    );

    didData.didDocumentMetadata.linkedResourceMetadata = resourcesWithContent;

    return NextResponse.json(didData);
  } catch (error) {
    console.error('Error in resource search:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
} 