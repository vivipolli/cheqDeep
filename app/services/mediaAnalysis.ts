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

export async function analyzeMedia(file: File): Promise<MediaAnalysis> {
  try {
    const buffer = await file.arrayBuffer();
    const exif = await exifr.parse(buffer);
    
    const metadata = {
      fileSize: file.size,
      fileType: file.type,
      ...(exif ? {
        creationDate: exif.DateTimeOriginal || exif.CreateDate,
        deviceInfo: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : undefined,
        location: exif.GPSLatitude && exif.GPSLongitude 
          ? `${exif.GPSLatitude}, ${exif.GPSLongitude}` 
          : undefined,
        resolution: exif.ImageWidth && exif.ImageHeight 
          ? `${exif.ImageWidth}x${exif.ImageHeight}` 
          : undefined,
        software: exif.Software,
      } : {})
    };

    return {
      isAuthentic: !!exif,
      confidence: exif ? 0.95 : 0.3,
      metadata,
      warnings: exif ? [] : ['No EXIF data found in the media file']
    };
  } catch (error) {
    console.error('Error analyzing media:', error);
    throw error;
  }
} 