import { Types } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  category: string;
  tags?: string[];
  featuredImage: string;
  views: number;
  status: 'DRAFT' | 'PUBLISHED';
  isDeleted: boolean;
  isFeatured: boolean;
}
