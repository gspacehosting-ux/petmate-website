import { Router } from 'express';
import {
  getAllBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogs.controller';
import { requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createBlogSchema, updateBlogSchema } from '../validations/blogs.validation';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:idOrSlug', getBlogByIdOrSlug);

router.post('/', requireAdmin, validateRequest(createBlogSchema), createBlog);
router.put('/:id', requireAdmin, validateRequest(updateBlogSchema), updateBlog);
router.delete('/:id', requireAdmin, deleteBlog);

export default router;
