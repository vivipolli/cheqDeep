export async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadToIPFS(content: string): Promise<string> {
  try {
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}

export async function createVideoThumbnail(videoData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.src = videoData;
      video.crossOrigin = 'anonymous';
      
      // Set video properties for better compatibility
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        // Seek to 1 second to avoid black frames
        video.currentTime = 1;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          // Draw the video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to base64
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        } catch (error) {
          console.error('Error creating thumbnail:', error);
          reject(error);
        }
      };

      video.onerror = (error) => {
        console.error('Error loading video for thumbnail:', error);
        reject(new Error('Failed to load video for thumbnail generation'));
      };

      // Start loading the video
      video.load();
    } catch (error) {
      console.error('Error in createVideoThumbnail:', error);
      reject(error);
    }
  });
} 