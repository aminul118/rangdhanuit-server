import express from 'express';
import auth from '../../middlewares/auth';
import { NotificationController } from './Notification.controller';

const router = express.Router();

router.get(
  '/',
  auth('ADMIN', 'USER', 'SUPER_ADMIN'),
  NotificationController.getMyNotifications,
);
router.patch(
  '/mark-all-as-read',
  auth('ADMIN', 'USER', 'SUPER_ADMIN'),
  NotificationController.markAllAsRead,
);
router.patch(
  '/:id/read',
  auth('ADMIN', 'USER', 'SUPER_ADMIN'),
  NotificationController.markSpecificAsRead,
);
router.delete(
  '/',
  auth('ADMIN', 'USER', 'SUPER_ADMIN'),
  NotificationController.deleteAllNotifications,
);
router.delete(
  '/:id',
  auth('ADMIN', 'USER', 'SUPER_ADMIN'),
  NotificationController.deleteSpecificNotification,
);

export const NotificationRoutes = router;
