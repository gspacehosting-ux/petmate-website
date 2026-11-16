import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller';
import { requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validations/products.validation';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', requireAdmin, validateRequest(createProductSchema), createProduct);
router.put('/:id', requireAdmin, validateRequest(updateProductSchema), updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
