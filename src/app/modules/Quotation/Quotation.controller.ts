import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { QuotationService } from './Quotation.service';

const createQuotation = catchAsync(async (req, res) => {
  const result = await QuotationService.createQuotation(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Quotation created successfully',
    data: result,
  });
});

const getAllQuotations = catchAsync(async (req, res) => {
  const { data, meta } = await QuotationService.getAllQuotations(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotations retrieved successfully',
    meta,
    data,
  });
});

const getQuotationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuotationService.getQuotationById(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotation retrieved successfully',
    data: result,
  });
});

const updateQuotation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuotationService.updateQuotation(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotation updated successfully',
    data: result,
  });
});

const deleteQuotation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuotationService.deleteQuotation(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotation deleted successfully',
    data: result,
  });
});

export const QuotationController = {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
};
