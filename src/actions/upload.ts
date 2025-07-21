'use server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

console.log("[uploadAudio] Initializing Cloudinary config...");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadAudio(formData: FormData) {
  console.log("[uploadAudio] Starting upload process...");
  
  try {
    const file = formData.get('audio');
    console.log("[uploadAudio] Received formData file:", file ? `exists (${file instanceof Blob ? 'Blob' : 'other type'})` : "null");

    if (!file || !(file instanceof Blob)) {
      throw new Error('No valid audio file found in form data');
    }

    console.log(`[uploadAudio] File details - size: ${file.size} bytes, type: ${file.type}`);

    console.log("[uploadAudio] Converting to array buffer...");
    const arrayBuffer = await file.arrayBuffer();
    console.log(`[uploadAudio] ArrayBuffer received - length: ${arrayBuffer.byteLength}`);

    console.log("[uploadAudio] Converting to Buffer...");
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[uploadAudio] Buffer created - length: ${buffer.length}`);

    console.log("[uploadAudio] Setting up Cloudinary upload stream...");
    return new Promise<{ url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'voice-notes',
          public_id: `audio-${Date.now()}`,
          format: 'webm',
        },
        (error, result) => {
          if (error) {
            console.error('[uploadAudio] Cloudinary upload error:', error);
            return reject(error);
          }
          if (!result) {
            console.error('[uploadAudio] Cloudinary upload returned no result');
            return reject(new Error('Upload returned no result'));
          }
          console.log('[uploadAudio] Upload successful, URL:', result.secure_url);
          resolve({ url: result.secure_url });
        }
      );

      console.log("[uploadAudio] Creating readable stream...");
      const readableStream = bufferToStream(buffer);
      
      readableStream.on('error', (err) => {
        console.error('[uploadAudio] Readable stream error:', err);
        reject(err);
      });
      
      uploadStream.on('error', (err) => {
        console.error('[uploadAudio] Upload stream error:', err);
        reject(err);
      });

      console.log("[uploadAudio] Piping to upload stream...");
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('[uploadAudio] Error in upload process:', error);
    throw error;
  }
}