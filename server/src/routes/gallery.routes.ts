import { Router } from 'express';
import {
  getAllGalleryImages,
  uploadGalleryFile,
  createGalleryImage,
  deleteGalleryImage,
} from '../controllers/gallery.controller';
import { requireAdmin } from '../middleware/auth';
import { uploadGalleryImage } from '../middleware/upload';

const router = Router();

router.get('/', getAllGalleryImages);

router.post('/upload', requireAdmin, uploadGalleryImage.single('image'), uploadGalleryFile);
router.post('/', requireAdmin, createGalleryImage);
router.delete('/:id', requireAdmin, deleteGalleryImage);

export default router;
