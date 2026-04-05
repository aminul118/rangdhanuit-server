import multer from 'multer';

// Use memory storage to allow Sharp to process images before uploading to Cloudinary
const storage = multer.memoryStorage();

export const multerUpload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
