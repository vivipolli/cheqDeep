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
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

export async function createVideoThumbnail(videoContent: string): Promise<string> {
  try {
    const response = await fetch('/api/media/thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoContent })
    });

    if (!response.ok) {
      throw new Error('Failed to create thumbnail');
    }

    const data = await response.json();
    return data.thumbnail;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    throw error;
  }
} 