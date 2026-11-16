import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { updateSettingsSchema } from '../validations/settings.validation';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAdmin, validateRequest(updateSettingsSchema), updateSettings);

export default router;
