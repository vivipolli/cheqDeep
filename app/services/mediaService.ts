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

export async function createVideoThumbnail(videoContent: string): Promise<string> {
  try {
    // Create thumbnail in browser
    const thumbnail = await new Promise<string>((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoContent;
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = (video.videoHeight * 640) / video.videoWidth;
        
        video.currentTime = 1;
        video.onseeked = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
      };
      video.onerror = () => reject(new Error('Error loading video'));
    });

    return thumbnail;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    throw error;
  }
} 