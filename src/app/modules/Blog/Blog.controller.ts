import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './Blog.service';
import { JwtPayload } from 'jsonwebtoken';
import { ImageHandler } from '../../utils/imageHandler';

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
  const payload = req.body;

  if (req.file) {
    payload.featuredImage = await ImageHandler.uploadImage(req.file);
  }

  const result = await BlogService.createBlogInDB(
    payload,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getBlogBySlugForAdmin = catchAsync(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const result = await BlogService.getBlogBySlugForAdminFromDB(slug);

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

const updateBlogBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const payload = req.body;

  if (req.file) {
    payload.featuredImage = await ImageHandler.uploadImage(req.file);
  }

  const result = await BlogService.updateBlogBySlugFromDB(
    slug as string,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlogBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await BlogService.deleteBlogBySlugFromDB(slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

const incrementBlogView = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await BlogService.incrementBlogViewInDB(slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog view incremented successfully',
    data: result,
  });
});

export const BlogController = {
  getAllBlogs,
  getSingleBlogBySlug,
  getBlogBySlugForAdmin,
  createBlog,
  updateBlogBySlug,
  deleteBlogBySlug,
  incrementBlogView,
};
