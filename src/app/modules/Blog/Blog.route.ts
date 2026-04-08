import { Router } from 'express';
import { BlogController } from './Blog.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './Blog.validation';
import { multerUpload } from '../../config/multer.config';
import { cacheMiddleware } from '../../middlewares/cacheMiddleware';

const router = Router();

// Public routes
router.get('/', cacheMiddleware('blogs', 3600), BlogController.getAllBlogs);
router.get(
  '/:slug',
  cacheMiddleware('blogs', 3600),
  BlogController.getSingleBlogBySlug,
);
router.patch('/view/:slug', BlogController.incrementBlogView);

// Admin/Super Admin protected routes
router.get(
  '/slug/admin/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  BlogController.getBlogBySlugForAdmin,
);
router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  multerUpload.single('image'),
  validateRequest(BlogValidation.createBlogValidationSchema),
  BlogController.createBlog,
);

router.patch(
  '/slug/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  multerUpload.single('image'),
  validateRequest(BlogValidation.updateBlogValidationSchema),
  BlogController.updateBlogBySlug,
);

router.delete(
  '/slug/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  BlogController.deleteBlogBySlug,
);

export const BlogRoutes = router;
