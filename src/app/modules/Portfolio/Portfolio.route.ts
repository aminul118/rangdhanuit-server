import { Router } from 'express';
import { PortfolioController } from './Portfolio.controller';
import { multerUpload } from '../../config/multer.config';
import { cacheMiddleware } from '../../middlewares/cacheMiddleware';

const router = Router();

router.post(
  '/create-portfolio',
  multerUpload.single('thumbnail'),
  PortfolioController.createPortfolio,
);
router.get(
  '/',
  cacheMiddleware('portfolios', 3600),
  PortfolioController.getAllPortfolios,
);
// Standardized slug-based retrieval
router.get(
  '/:slug',
  cacheMiddleware('portfolios', 3600),
  PortfolioController.getPortfolioBySlug,
);
router.patch(
  '/:slug',
  multerUpload.single('thumbnail'),
  PortfolioController.updatePortfolioBySlug,
);
router.delete('/:slug', PortfolioController.deletePortfolioBySlug);

export const PortfolioRoutes = router;
