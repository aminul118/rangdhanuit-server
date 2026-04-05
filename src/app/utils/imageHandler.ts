import sharp from 'sharp';
import { cloudinaryUploads } from '../config/cloudinary.config';

/**
 * ImageHandler manages the server-side optimization and uploading of images.
 */
export const ImageHandler = {
  /**
   * Processes a file buffer with Sharp and uploads it to Cloudinary.
   * Target: Optimization, auto-format (mostly WebP), and quality compression.
   */
  async uploadImage(file: Express.Multer.File, folder = 'rangdhanu'): Promise<string> {
    // 1. Process image with Sharp
    // We convert to WebP or optimize JPEG depending on input, ensuring ~80% quality
    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }) // Responsive cap
      .webp({ quality: 80 }) // High performance WebP conversion
      .toBuffer();

    // 2. Upload to Cloudinary using upload_stream (since we have a buffer)
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinaryUploads.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-")}`,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result.secure_url);
        }
      );

      uploadStream.end(optimizedBuffer);
    });
  },
};
