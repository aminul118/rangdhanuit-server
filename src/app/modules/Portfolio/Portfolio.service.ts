import { Portfolio } from './Portfolio.model';
import { IPortfolio } from './Portfolio.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createPortfolioIntoDB = async (payload: IPortfolio) => {
  const result = await Portfolio.create(payload);
  return result;
};

const getAllPortfoliosFromDB = async (query: Record<string, unknown>) => {
  const portfolioQuery = new QueryBuilder(
    Portfolio.find({ isDeleted: false }),
    query,
  )
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await portfolioQuery.modelQuery;
  const meta = await portfolioQuery.countTotal();

  return { result, meta };
};

export const PortfolioService = {
  createPortfolioIntoDB,
  getAllPortfoliosFromDB,
};
