import express from 'express';
import { PortfolioController } from './Portfolio.controller';

const router = express.Router();

router.post('/create-portfolio', PortfolioController.createPortfolio);
router.get('/', PortfolioController.getAllPortfolios);

export const PortfolioRoutes = router;
