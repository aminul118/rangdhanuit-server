import { Schema, model } from 'mongoose';
import { IPortfolio } from './Portfolio.interface';
import { slugPlugin } from '../../utils/slugPlugin';


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

// Apply slug plugin
portfolioSchema.plugin(slugPlugin, { sourceField: 'title' });

export const Portfolio = model<IPortfolio>('Portfolio', portfolioSchema);

