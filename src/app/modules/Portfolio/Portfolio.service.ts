import { Portfolio } from './Portfolio.model';
import { IPortfolio } from './Portfolio.interface';

const createPortfolioIntoDB = async (payload: IPortfolio) => {
  const result = await Portfolio.create(payload);
  return result;
};

const getAllPortfoliosFromDB = async () => {
  const result = await Portfolio.find({ isDeleted: false });
  return result;
};

export const PortfolioService = {
  createPortfolioIntoDB,
  getAllPortfoliosFromDB,
};
