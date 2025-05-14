import { NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import { unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { createWriteStream } from 'fs';

export async function POST(request: Request) {
  try {
    const { videoContent } = await request.json();
    
    const videoPath = join(tmpdir(), `video-${Date.now()}.mp4`);
    const compressedPath = join(tmpdir(), `compressed-${Date.now()}.mp4`);
    
    const videoBuffer = Buffer.from(videoContent.split(',')[1], 'base64');
    const writeStream = createWriteStream(videoPath);
    
    await new Promise((resolve, reject) => {
      writeStream.write(videoBuffer, (error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });
    writeStream.end();

    // Compress video first
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-vf scale=640:-1',  // Scale to 640px width
          '-c:v libx264',      // Use H.264 codec
          '-crf 28',           // Compression quality
          '-preset fast',      // Encoding speed
          '-c:a aac',          // Audio codec
          '-b:a 128k'          // Audio bitrate
        ])
        .output(compressedPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // Generate thumbnail from compressed video
    await new Promise((resolve, reject) => {
      ffmpeg(compressedPath)
        .on('end', resolve)
        .on('error', reject)
        .screenshot({
          timestamps: ['00:00:01'],
          filename: 'thumbnail.jpg',
          folder: tmpdir(),
          size: '320x240'
        });
    });

    // Read thumbnail
    const thumbnail = await readFile(join(tmpdir(), 'thumbnail.jpg'), 'base64');

    // Clean up temporary files
    await Promise.all([
      unlink(videoPath),
      unlink(compressedPath),
      unlink(join(tmpdir(), 'thumbnail.jpg'))
    ]);

    return NextResponse.json({ thumbnail: `data:image/jpeg;base64,${thumbnail}` });
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to create thumbnail' },
      { status: 500 }
    );
  }
} 