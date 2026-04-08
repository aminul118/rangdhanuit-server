import { Request, Response } from 'express';
import { ServiceServices } from './Service.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ImageHandler } from '../../utils/imageHandler';
import { clearCache } from '../../middlewares/cacheMiddleware';

const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // Optimized image processing
  if (req.files) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    if (files.image?.[0]) {
      payload.image = await ImageHandler.uploadImage(files.image[0]);
    }
    if (files.icon?.[0]) {
      payload.icon = await ImageHandler.uploadImage(files.icon[0]);
    }
  }

  const result = await ServiceServices.createServiceIntoDB(payload);

  // Clear cache for services
  clearCache('services');

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const { meta, result } = await ServiceServices.getAllServicesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Services fetched successfully',
    meta,
    data: result,
  });
});

const getSingleServiceBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await ServiceServices.getSingleServiceBySlugFromDB(
      slug as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Service fetched successfully',
      data: result,
    });
  },
);

const updateServiceBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const payload = req.body;

  // Optimized image processing
  if (req.files) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    if (files.image?.[0]) {
      payload.image = await ImageHandler.uploadImage(files.image[0]);
    }
    if (files.icon?.[0]) {
      payload.icon = await ImageHandler.uploadImage(files.icon[0]);
    }
  }

  const result = await ServiceServices.updateServiceBySlugFromDB(
    slug as string,
    payload,
  );

  // Clear cache for services
  clearCache('services');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteServiceBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await ServiceServices.deleteServiceBySlugFromDB(
    slug as string,
  );

  // Clear cache for services
  clearCache('services');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const ServiceControllers = {
  createService,
  getAllServices,
  getSingleServiceBySlug,
  updateServiceBySlug,
  deleteServiceBySlug,
};
