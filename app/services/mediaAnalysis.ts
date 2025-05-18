export interface MediaAnalysis {
  isAuthentic: boolean;
  confidence: number;
  metadata: {
    creationDate?: string;
    deviceInfo?: string;
    location?: string;
    fileSize: number;
    fileType: string;
    resolution?: string;
    software?: string;
    codec?: string;
    duration?: string;
    bitrate?: string;
    fps?: string;
    creation_date?: string;
    last_modification?: string;
    producer?: string;
    copyright?: string;
    comment?: string;
    operating_system?: string;
    os_version?: string;
    os_release?: string;
    os_architecture?: string;
    // EXIF fields
    Make?: string;
    Model?: string;
    DateTimeOriginal?: string;
    CreateDate?: string;
    GPSLatitude?: number;
    GPSLongitude?: number;
    GPSAltitude?: number;
  };
  warnings: string[];
}

export async function analyzeMedia(file: File): Promise<MediaAnalysis> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_MIDIA_VALIDATOR_URL}/analyze`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to analyze media: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing media:', error);
    throw error;
  }
} 