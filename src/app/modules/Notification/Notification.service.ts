import { Notification } from './Notification.model';
import { INotification } from './Notification.interface';

const createNotification = async (payload: Partial<INotification>) => {
  const result = await Notification.create(payload);
  return result;
};

const getMyNotifications = async (userId: string) => {
  const result = await Notification.find({
    recipient: userId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email picture role')
    .limit(50);

  return result;
};

const markAllAsRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true },
  );
  return result;
};

const markSpecificAsRead = async (notificationId: string) => {
  const result = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true },
  );
  return result;
};

const deleteSpecificNotification = async (notificationId: string) => {
  const result = await Notification.findByIdAndUpdate(
    notificationId,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const deleteAllNotifications = async (userId: string) => {
  const result = await Notification.updateMany(
    { recipient: userId, isDeleted: false },
    { isDeleted: true },
  );
  return result;
};

export const NotificationService = {
  createNotification,
  getMyNotifications,
  markAllAsRead,
  markSpecificAsRead,
  deleteSpecificNotification,
  deleteAllNotifications,
};
