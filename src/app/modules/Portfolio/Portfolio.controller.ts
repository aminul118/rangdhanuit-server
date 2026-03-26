import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { PortfolioService } from "./Portfolio.service";
import { Portfolio } from "./Portfolio.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createPortfolio = catchAsync(async (req: Request, res: Response) => {
  const result = await PortfolioService.createPortfolioIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Portfolio created successfully",
    data: result,
  });
});

const getAllPortfolios = catchAsync(async (req: Request, res: Response) => {
  const portfolioQuery = new QueryBuilder(Portfolio.find(), req.query)
    .search(["title", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await portfolioQuery.modelQuery;
  const meta = await portfolioQuery.countTotal();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Portfolios retrieved successfully",
    meta,
    data: result,
  });
});

export const PortfolioController = {
  createPortfolio,
  getAllPortfolios,
};
