import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed: jpeg, jpg, png, gif, webp'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export const uploadSingle = upload.single('image');

export const uploadArray = upload.array('images', 5);

export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
  { name: 'attachments', maxCount: 5 },
  { name: 'deliveryFiles', maxCount: 5 },
]);

export const uploadNone = upload.none();

export default upload;
