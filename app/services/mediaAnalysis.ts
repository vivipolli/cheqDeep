import exifr from 'exifr';

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
  };
  warnings: string[];
}

interface MetadataResult {
  metadata: Partial<MediaAnalysis['metadata']>;
  warnings: string[];
}

async function extractImageMetadata(file: File): Promise<MetadataResult> {
  try {
    const buffer = await file.arrayBuffer();
    const exif = await exifr.parse(buffer);
    
    if (!exif) {
      return {
        metadata: {},
        warnings: ['No EXIF data found in the image']
      };
    }

    return {
      metadata: {
        creationDate: exif.DateTimeOriginal || exif.CreateDate,
        deviceInfo: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : undefined,
        location: exif.GPSLatitude && exif.GPSLongitude 
          ? `${exif.GPSLatitude}, ${exif.GPSLongitude}` 
          : undefined,
        resolution: exif.ImageWidth && exif.ImageHeight 
          ? `${exif.ImageWidth}x${exif.ImageHeight}` 
          : undefined,
        software: exif.Software,
      },
      warnings: []
    };
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    return {
      metadata: {},
      warnings: ['Failed to extract image metadata']
    };
  }
}

async function extractVideoMetadata(): Promise<MetadataResult> {
  // Note: In a real implementation, you would use a video metadata library
  // For now, we'll return basic information
  return {
    metadata: {},
    warnings: ['Video metadata extraction not implemented yet']
  };
}

export async function analyzeMedia(file: File): Promise<MediaAnalysis> {
  const baseMetadata = {
    fileSize: file.size,
    fileType: file.type,
  };

  const isImage = file.type.startsWith('image/');
  const { metadata, warnings } = isImage 
    ? await extractImageMetadata(file)
    : await extractVideoMetadata();

  const hasMetadata = warnings.length === 0;
  
  return {
    isAuthentic: hasMetadata,
    confidence: hasMetadata ? 0.85 : 0.3,
    metadata: {
      ...baseMetadata,
      ...metadata,
    },
    warnings,
  };
} 