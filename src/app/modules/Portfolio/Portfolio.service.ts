import { Portfolio } from './Portfolio.model';
import { IPortfolio } from './Portfolio.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createPortfolioIntoDB = async (payload: IPortfolio) => {
  const result = await Portfolio.create(payload);
  return result;
};

const getAllPortfoliosFromDB = async (query: Record<string, unknown>) => {
  const { data, meta } = await new QueryBuilder(Portfolio.find(), query)
    .search(['title', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  return { data, meta };
};

const getSinglePortfolioBySlugFromDB = async (slug: string) => {
  const result = await Portfolio.findOne({ slug });
  return result;
};

const updatePortfolioBySlugFromDB = async (
  slug: string,
  payload: Partial<IPortfolio>,
) => {
  const result = await Portfolio.findOneAndUpdate({ slug }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletePortfolioBySlugFromDB = async (slug: string) => {
  const result = await Portfolio.findOneAndDelete({ slug });
  return result;
};

export const PortfolioService = {
  createPortfolioIntoDB,
  getAllPortfoliosFromDB,
  getSinglePortfolioBySlugFromDB,
  updatePortfolioBySlugFromDB,
  deletePortfolioBySlugFromDB,
};
