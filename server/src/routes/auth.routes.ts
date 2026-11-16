import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate';
import { loginSchema } from '../validations/auth.validation';
import { requireAdmin } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.get('/me', requireAdmin, getMe);
router.post('/logout', logout);

export default router;
