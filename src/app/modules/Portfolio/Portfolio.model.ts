import { Schema, model } from 'mongoose';
import { IPortfolio } from './Portfolio.interface';

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    technologies: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

import generateSlug from '../../utils/generateSlug';

generateSlug<IPortfolio>(portfolioSchema, 'title', 'slug');

export const Portfolio = model<IPortfolio>('Portfolio', portfolioSchema);
