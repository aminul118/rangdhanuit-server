import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './Notification.service';

const getMyNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getMyNotifications((req.user as JwtPayload).userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAllAsRead((req.user as JwtPayload).userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
    data: result,
  });
});

const markSpecificAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markSpecificAsRead(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const deleteSpecificNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.deleteSpecificNotification(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

const deleteAllNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.deleteAllNotifications((req.user as JwtPayload).userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications cleared',
    data: result,
  });
});

export const NotificationController = {
  getMyNotifications,
  markAllAsRead,
  markSpecificAsRead,
  deleteSpecificNotification,
  deleteAllNotifications,
};
