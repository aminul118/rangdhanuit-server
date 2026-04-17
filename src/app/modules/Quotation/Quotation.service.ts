import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IQuotation } from './Quotation.interface';
import { Quotation } from './Quotation.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createQuotation = async (payload: IQuotation) => {
  const result = await Quotation.create(payload);
  return result;
};

const getAllQuotations = async (query: Record<string, unknown>) => {
  const { data, meta } = await new QueryBuilder(
    Quotation.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search(['clientName', 'projectName', 'clientEmail'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  return { data, meta };
};

const getQuotationById = async (id: string) => {
  const result = await Quotation.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Quotation not found');
  }
  return result;
};

const updateQuotation = async (id: string, payload: Partial<IQuotation>) => {
  const result = await Quotation.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteQuotation = async (id: string) => {
  const result = await Quotation.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const QuotationService = {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
};
