import { Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUploads } from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUploads,
  params: {
    public_id: (req: Request, file: Express.Multer.File) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\./g, '-')
        .replace(/[^a-z0-9\-\.]/g, '');

      const extension = file.originalname.split('.').pop();

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        '-' +
        Date.now() +
        '-' +
        fileName;

      return uniqueFileName;
    },
  } as any, // Cast to any because of type mismatch in multer-storage-cloudinary types
});

export const multerUpload = multer({ storage: storage });
