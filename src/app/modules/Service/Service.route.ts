import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceValidations } from './Service.validation';
import { ServiceControllers } from './Service.controller';
import auth from '../../middlewares/auth';
import { multerUpload } from '../../config/multer.config';
import { cacheMiddleware } from '../../middlewares/cacheMiddleware';

const router = Router();

router.get(
  '/',
  cacheMiddleware('services', 3600),
  ServiceControllers.getAllServices,
);

router.get(
  '/slug/:slug',
  cacheMiddleware('services', 3600),
  ServiceControllers.getSingleServiceBySlug,
);

router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService,
);

router.patch(
  '/slug/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateServiceBySlug,
);

router.delete(
  '/slug/:slug',
  auth('ADMIN', 'SUPER_ADMIN'),
  ServiceControllers.deleteServiceBySlug,
);

export const ServiceRoutes = router;
