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
  metadata?: {
    thumbnailUrl?: string;
    title?: string;
    description?: string;
    fileType?: string;
    fileSize?: number;
    hash?: string;
    exifData?: {
      creationDate?: string;
      deviceInfo?: string;
      location?: string;
      resolution?: string;
      software?: string;
    };
  };
}

export interface ResourceResponse {
  resource: DIDResource;
}

export interface ResourceMetadata {
  title: string;
  description: string;
  fileType: string;
  fileSize: number;
  hash: string;
  thumbnailUrl?: string;
  exifData?: {
    creationDate?: string;
    deviceInfo?: string;
    location?: string;
    resolution?: string;
    software?: string;
  };
} 