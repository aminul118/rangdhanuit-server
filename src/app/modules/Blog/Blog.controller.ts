import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './Blog.service';
import { JwtPayload } from 'jsonwebtoken';


const getAllBlogs = catchAsync(async (req, res) => {
  const { result, meta } = await BlogService.getAllBlogsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs fetched successfully',
    meta,
    data: result,
  });
});


const getSingleBlogBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const result = await BlogService.getSingleBlogBySlugFromDB(slug);

  
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Blog not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog details fetched successfully',
    data: result,
  });
});



const createBlog = catchAsync(async (req, res) => {
  const result = await BlogService.createBlogInDB(req.body, req.user as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogService.updateBlogInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogService.deleteBlogFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});


export const BlogController = {
  getAllBlogs,
  getSingleBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};

