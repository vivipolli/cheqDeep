import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { did: string } }
) {
  const params = await Promise.resolve(context.params);
  const { did } = params;

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

    const didData = await didResponse.json();

    // For each resource in the DID document, fetch its content
    const resourcesWithContent = await Promise.all(
      didData.didDocumentMetadata.linkedResourceMetadata.map(async (resource: any) => {
        try {
          // Fetch the resource content
          const resourceResponse = await fetch(
            `https://studio-api.cheqd.net/resource/${did}/${resource.resourceId}`,
            {
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHEQD_API_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!resourceResponse.ok) {
            console.error(`Failed to fetch resource ${resource.resourceId}`);
            return resource;
          }

          const resourceData = await resourceResponse.json();

          // Decode the base64 content
          const base64Content = resourceData.data
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .replace(/\s/g, '');

          // Add padding if needed
          const padding = base64Content.length % 4;
          const paddedContent = padding ? 
            base64Content + '='.repeat(4 - padding) : 
            base64Content;

          try {
            const decodedContent = atob(paddedContent);
            const parsedContent = JSON.parse(decodedContent);

            // Return the resource with its metadata
            return {
              ...resource,
              metadata: parsedContent.metadata
            };
          } catch (decodeError) {
            console.error('Error decoding resource content:', decodeError);
            return resource;
          }
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