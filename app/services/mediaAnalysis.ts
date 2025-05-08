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
    duration?: string;
    bitrate?: string;
  };
  warnings: string[];
}

interface MetadataResult {
  metadata: {
    creationDate?: string;
    deviceInfo?: string;
    location?: string;
    resolution?: string;
    software?: string;
  };
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

export async function analyzeMedia(file: File): Promise<MediaAnalysis> {
  try {
    const { metadata: imageMetadata, warnings } = await extractImageMetadata(file);
    
    const metadata = {
      fileSize: file.size,
      fileType: file.type,
      ...imageMetadata
    };

    return {
      isAuthentic: !!imageMetadata.deviceInfo,
      confidence: imageMetadata.deviceInfo ? 0.95 : 0.3,
      metadata,
      warnings
    };
  } catch (error) {
    console.error('Error analyzing media:', error);
    throw error;
  }
} 