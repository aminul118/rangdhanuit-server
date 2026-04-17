import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { PortfolioService } from './Portfolio.service';
import { ImageHandler } from '../../utils/imageHandler';
import { clearCache } from '../../middlewares/cacheMiddleware';

const createPortfolio = catchAsync(async (req: Request, res: Response) => {
  const portfolioData = { ...req.body };

  if (req.file) {
    portfolioData.thumbnail = await ImageHandler.uploadImage(
      req.file as Express.Multer.File,
      'portfolios',
    );
  }

  if (typeof portfolioData.technologies === 'string') {
    portfolioData.technologies = portfolioData.technologies
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  // Normalize isFeatured to Boolean
  portfolioData.isFeatured =
    portfolioData.isFeatured === 'on' ||
    portfolioData.isFeatured === 'true' ||
    portfolioData.isFeatured === true;

  const result = await PortfolioService.createPortfolioIntoDB(portfolioData);

  await clearCache('portfolios');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio created successfully',
    data: result,
  });
});

const getAllPortfolios = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await PortfolioService.getAllPortfoliosFromDB(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolios retrieved successfully',
    meta,
    data,
  });
});

const getPortfolioBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await PortfolioService.getSinglePortfolioBySlugFromDB(
    req.params.slug as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio retrieved successfully',
    data: result,
  });
});

const updatePortfolioBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const portfolioData = { ...req.body };

    if (req.file) {
      portfolioData.thumbnail = await ImageHandler.uploadImage(
        req.file as Express.Multer.File,
        'portfolios',
      );
    }

    if (typeof portfolioData.technologies === 'string') {
      portfolioData.technologies = portfolioData.technologies
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    // Normalize isFeatured to Boolean
    portfolioData.isFeatured =
      portfolioData.isFeatured === 'on' ||
      portfolioData.isFeatured === 'true' ||
      portfolioData.isFeatured === true;

    const result = await PortfolioService.updatePortfolioBySlugFromDB(
      req.params.slug as string,
      portfolioData,
    );

    await clearCache('portfolios');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Portfolio updated successfully',
      data: result,
    });
  },
);

const deletePortfolioBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PortfolioService.deletePortfolioBySlugFromDB(
      req.params.slug as string,
    );

    await clearCache('portfolios');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Portfolio deleted successfully',
      data: result,
    });
  },
);

export const PortfolioController = {
  createPortfolio,
  getAllPortfolios,
  getPortfolioBySlug,
  updatePortfolioBySlug,
  deletePortfolioBySlug,
};
