import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import ordersRoutes from './orders.routes';
import blogsRoutes from './blogs.routes';
import submissionsRoutes from './submissions.routes';
import galleryRoutes from './gallery.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/blogs', blogsRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/settings', settingsRoutes);

export default router;
