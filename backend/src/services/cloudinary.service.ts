import cloudinary from '@/config/cloudinary';
import { Readable } from 'stream';

interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: Record<string, unknown>;
}

interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const { folder = 'otpmart', publicId } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'auto',
        transformation: options.transformation,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        } else {
          reject(new Error('Cloudinary upload returned empty result'));
        }
      },
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset: ${publicId}`, error);
  }
}

export async function uploadMultipleToCloudinary(
  buffers: Buffer[],
  options: UploadOptions = {},
): Promise<UploadResult[]> {
  const promises = buffers.map((buffer) => uploadToCloudinary(buffer, options));
  return Promise.all(promises);
}
