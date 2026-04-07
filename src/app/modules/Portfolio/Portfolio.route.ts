import { Router } from 'express';
import { PortfolioController } from './Portfolio.controller';
import { multerUpload } from '../../config/multer.config';

const router = Router();

router.post(
  '/create-portfolio',
  multerUpload.single('thumbnail'),
  PortfolioController.createPortfolio,
);
router.get('/', PortfolioController.getAllPortfolios);
// Standardized slug-based retrieval
router.get('/:slug', PortfolioController.getPortfolioBySlug);
router.patch(
  '/:slug',
  multerUpload.single('thumbnail'),
  PortfolioController.updatePortfolioBySlug,
);
router.delete('/:slug', PortfolioController.deletePortfolioBySlug);

export const PortfolioRoutes = router;
