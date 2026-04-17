import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Invoice } from './Invoice.model';
import { IInvoice } from './Invoice.interface';
import { generateInvoicePDF, deleteInvoicePDF } from './Invoice.utils';

const createInvoice = async (payload: IInvoice) => {
  // 1. Create the invoice (triggers sequential number generation)
  const result = await Invoice.create(payload);

  // 2. Generate and upload PDF
  const pdfUrl = await generateInvoicePDF(result);

  // 3. Update with the PDF URL
  const updatedResult = await Invoice.findByIdAndUpdate(
    result._id,
    { pdfUrl },
    { new: true },
  );

  return updatedResult;
};

const getAllInvoices = async (query: Record<string, unknown>) => {
  const { data, meta } = await new QueryBuilder(
    Invoice.find({ isDeleted: { $ne: true } }).populate('quotationId'),
    query,
  )
    .search(['clientName', 'invoiceNumber', 'clientEmail'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  return { data, meta };
};

const getInvoiceById = async (id: string) => {
  const result = await Invoice.findById(id).populate('quotationId');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  return result;
};

const updateInvoice = async (id: string, payload: Partial<IInvoice>) => {
  // 1. Update the document
  const result = await Invoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  // 2. Regenerate PDF with updated data
  const pdfUrl = await generateInvoicePDF(result);

  // 3. Update with new URL
  const finalResult = await Invoice.findByIdAndUpdate(
    id,
    { pdfUrl },
    { new: true },
  );

  return finalResult;
};

const deleteInvoice = async (id: string) => {
  // 1. Mark as deleted in DB
  const result = await Invoice.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (result && result.invoiceNumber) {
    // 2. Clear from Cloudinary
    await deleteInvoicePDF(result.invoiceNumber);
  }

  return result;
};

export const InvoiceService = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
