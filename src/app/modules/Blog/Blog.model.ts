import generateSlug from '../../utils/generateSlug';
import { Schema, model } from 'mongoose';
import { IBlog } from './Blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    featuredImage: { type: String, required: true },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED'],
      default: 'PUBLISHED',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

generateSlug<IBlog>(blogSchema, 'title', 'slug');

export const Blog = model<IBlog>('Blog', blogSchema);
