import { IBlog } from './Blog.interface';
import { JwtPayload } from 'jsonwebtoken';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Blog } from './Blog.model';

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(
    Blog.find({ isDeleted: false }).populate(
      'author',
      'name email picture designation',
    ),
    query,
  )
    .search(['title', 'category', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();

  return { result, meta };
};

const getSingleBlogBySlugFromDB = async (slug: string) => {
  return await Blog.findOne({
    slug,
    status: 'PUBLISHED',
    isDeleted: false,
  }).populate('author', 'name email picture designation');
};

const incrementBlogViewInDB = async (slug: string) => {
  return await Blog.findOneAndUpdate(
    { slug, status: 'PUBLISHED', isDeleted: false },
    { $inc: { views: 1 } },
    { new: true },
  );
};

const getBlogBySlugForAdminFromDB = async (slug: string) => {
  return await Blog.findOne({ slug, isDeleted: false }).populate(
    'author',
    'name email picture designation',
  );
};

const createBlogInDB = async (payload: IBlog, user: JwtPayload) => {
  // Assign current user as author
  payload.author = user._id; // _id is typically used in the project
  return await Blog.create(payload);
};

const updateBlogBySlugFromDB = async (
  slug: string,
  payload: Partial<IBlog>,
) => {
  return await Blog.findOneAndUpdate({ slug, isDeleted: false }, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteBlogBySlugFromDB = async (slug: string) => {
  // Soft deletion
  return await Blog.findOneAndUpdate(
    { slug, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );
};

export const BlogService = {
  getAllBlogsFromDB,
  getSingleBlogBySlugFromDB,
  getBlogBySlugForAdminFromDB,
  createBlogInDB,
  updateBlogBySlugFromDB,
  deleteBlogBySlugFromDB,
  incrementBlogViewInDB,
};
