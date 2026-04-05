import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PartnerService } from './Partner.service';
import { ImageHandler } from '../../utils/imageHandler';

const createPartner = catchAsync(async (req, res) => {
  const file = req.file;

  if (file) {
    req.body.logo = await ImageHandler.uploadImage(file as Express.Multer.File, 'partners');
  }

  const result = await PartnerService.createPartnerInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Partner created successfully',
    data: result,
  });
});

const getAllPartners = catchAsync(async (req, res) => {
  const result = await PartnerService.getAllPartnersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partners fetched successfully',
    data: result,
  });
});

const getPartnerBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await PartnerService.getSinglePartnerBySlugFromDB(slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner fetched successfully',
    data: result,
  });
});

const updatePartner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (file) {
    req.body.logo = await ImageHandler.uploadImage(file as Express.Multer.File, 'partners');
  }

  const result = await PartnerService.updatePartnerInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner updated successfully',
    data: result,
  });
});

const deletePartner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PartnerService.deletePartnerFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner deleted successfully',
    data: result,
  });
});

export const PartnerController = {
  createPartner,
  getAllPartners,
  getPartnerBySlug,
  updatePartner,
  deletePartner,
};
