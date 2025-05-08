export interface MediaMetadata {
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'audio';
  mediaHash: string;
  captureDevice: {
    id: string;
    type: string;
    manufacturer?: string;
    model?: string;
  };
  captureDetails: {
    timestamp: string;
    location?: {
      latitude?: number;
      longitude?: number;
    };
    settings?: {
      resolution?: string;
      format?: string;
      duration?: number;
    };
  };
  creator: string;
  creationDate: string;
  type?: string;
  issuer?: string;
  issuanceDate?: string;
  '@context'?: string[];
} 