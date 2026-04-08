import { Router } from 'express';
import { PartnerController } from './Partner.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PartnerValidation } from './Partner.validation';
import { multerUpload } from '../../config/multer.config';
import { cacheMiddleware } from '../../middlewares/cacheMiddleware';

const router = Router();

// Public routes
router.get(
  '/',
  cacheMiddleware('partners', 3600),
  PartnerController.getAllPartners,
);
router.get(
  '/:slug',
  cacheMiddleware('partners', 3600),
  PartnerController.getPartnerBySlug,
);

// Admin/Super Admin protected routes
router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  multerUpload.single('image'),
  validateRequest(PartnerValidation.createPartnerValidationSchema),
  PartnerController.createPartner,
);

router.patch(
  '/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  multerUpload.single('image'),
  validateRequest(PartnerValidation.updatePartnerValidationSchema),
  PartnerController.updatePartnerBySlug,
);

router.delete(
  '/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  PartnerController.deletePartnerBySlug,
);

export const PartnerRoutes = router;
