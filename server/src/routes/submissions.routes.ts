import { Router } from 'express';
import {
  createSubmission,
  getAllSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} from '../controllers/submissions.controller';
import { requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { submissionLimiter } from '../middleware/rateLimiter';
import {
  createSubmissionSchema,
  updateSubmissionStatusSchema,
} from '../validations/submissions.validation';

const router = Router();

router.post('/', submissionLimiter, validateRequest(createSubmissionSchema), createSubmission);

router.get('/', requireAdmin, getAllSubmissions);
router.patch('/:id/status', requireAdmin, validateRequest(updateSubmissionStatusSchema), updateSubmissionStatus);
router.delete('/:id', requireAdmin, deleteSubmission);

export default router;
