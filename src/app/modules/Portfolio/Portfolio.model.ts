import { Schema, model } from 'mongoose';
import { IPortfolio } from './Portfolio.interface';

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    liveLink: { type: String },
    github: { type: String },
    technologies: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

import generateSlug from '../../utils/generateSlug';

generateSlug<IPortfolio>(portfolioSchema, 'title', 'slug');

export const Portfolio = model<IPortfolio>('Portfolio', portfolioSchema);
