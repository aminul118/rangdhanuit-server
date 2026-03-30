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
  // Update view count and fetch
  const result = await Blog.findOneAndUpdate(
    { slug, status: 'PUBLISHED', isDeleted: false },
    { $inc: { views: 1 } },
    { new: true },
  ).populate('author', 'name email picture designation');

  return result;
};



const createBlogInDB = async (payload: IBlog, user: JwtPayload) => {
  // Assign current user as author
  payload.author = user._id; // _id is typically used in the project
  return await Blog.create(payload);
};

const updateBlogInDB = async (id: string, payload: Partial<IBlog>) => {
  return await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteBlogFromDB = async (id: string) => {
  // Soft deletion
  return await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};

export const BlogService = {
  getAllBlogsFromDB,
  getSingleBlogBySlugFromDB,
  createBlogInDB,
  updateBlogInDB,
  deleteBlogFromDB,
};

