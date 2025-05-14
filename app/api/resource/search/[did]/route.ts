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
    // First, get the DID document
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
    console.log('DID data:', didData);

    // For each resource in the DID document, fetch its content from the resolver
    const resourcesWithContent = await Promise.all(
      didData.didDocumentMetadata.linkedResourceMetadata.map(async (resource: ResourceMetadata) => {
        try {
          // Extract resource ID from resourceURI
          const resourceId = resource.resourceURI.split('/').pop();
          console.log('Fetching resource:', resourceId);
          
          // Fetch resource content from resolver
          const resolverResponse = await fetch(
            `https://resolver.cheqd.net/1.0/identifiers/${did}/resources/${resourceId}`
          );

          if (!resolverResponse.ok) {
            console.error(`Failed to fetch resource ${resourceId} from resolver`);
            return resource;
          }

          const resolverData = await resolverResponse.json();
          console.log('Resolver data:', resolverData);

          // If we have a thumbnail URL, verify it's accessible
          if (resolverData.metadata?.thumbnailUrl) {
            console.log('Checking thumbnail URL:', resolverData.metadata.thumbnailUrl);
            try {
              const thumbnailResponse = await fetch(resolverData.metadata.thumbnailUrl);
              console.log('Thumbnail response status:', thumbnailResponse.status);
              if (!thumbnailResponse.ok) {
                console.error('Thumbnail not accessible:', thumbnailResponse.statusText);
              }
            } catch (thumbnailError) {
              console.error('Error checking thumbnail:', thumbnailError);
            }
          }

          // Return the resource with its metadata
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

    // Update the DID document with the resource content
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