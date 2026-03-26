import { Schema, model } from 'mongoose';
import { IPortfolio } from './Portfolio.interface';

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    technologies: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Portfolio = model<IPortfolio>('Portfolio', portfolioSchema);
