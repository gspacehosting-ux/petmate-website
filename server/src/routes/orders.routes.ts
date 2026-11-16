import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orders.controller';
import { requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createOrderSchema } from '../validations/orders.validation';

const router = Router();

router.post('/', validateRequest(createOrderSchema), createOrder);

router.get('/', requireAdmin, getAllOrders);
router.get('/:id', requireAdmin, getOrderById);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

export default router;
