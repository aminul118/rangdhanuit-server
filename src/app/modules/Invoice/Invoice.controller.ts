import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { InvoiceService } from './Invoice.service';

const createInvoice = catchAsync(async (req, res) => {
  const result = await InvoiceService.createInvoice(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Invoice created successfully',
    data: result,
  });
});

const getAllInvoices = catchAsync(async (req, res) => {
  const { data, meta } = await InvoiceService.getAllInvoices(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoices retrieved successfully',
    meta,
    data,
  });
});

const getInvoiceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceService.getInvoiceById(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice retrieved successfully',
    data: result,
  });
});

const updateInvoice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceService.updateInvoice(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice updated successfully',
    data: result,
  });
});

const deleteInvoice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceService.deleteInvoice(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice deleted successfully',
    data: result,
  });
});

export const InvoiceController = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
