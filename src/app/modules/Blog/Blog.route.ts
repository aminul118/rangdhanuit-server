import { Router } from 'express';
import { BlogController } from './Blog.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './Blog.validation';

const router = Router();

// Public routes
router.get('/', BlogController.getAllBlogs);
router.get('/:slug', BlogController.getSingleBlogBySlug);

// Admin/Super Admin protected routes
router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(BlogValidation.createBlogValidationSchema),
  BlogController.createBlog,
);

router.patch(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(BlogValidation.updateBlogValidationSchema),
  BlogController.updateBlog,
);

router.delete(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  BlogController.deleteBlog,
);

export const BlogRoutes = router;

