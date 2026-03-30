import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
    category: z.string({
      required_error: 'Category is required',
    }),
    tags: z.array(z.string()).optional(),
    featuredImage: z.string({
      required_error: 'Featured image is required',
    }),
    status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featuredImage: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
});

export const BlogValidation = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
