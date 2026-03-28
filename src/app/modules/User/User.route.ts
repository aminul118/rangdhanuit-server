import express from 'express';
import { UserController } from './User.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-user', UserController.createUser);

router.get('/me', auth('ADMIN', 'USER', 'SUPER_ADMIN'), UserController.getMe);

router.get(
  '/statistics',
  auth('ADMIN', 'SUPER_ADMIN'),
  UserController.getStatistics,
);

router.get('/', auth('ADMIN', 'SUPER_ADMIN', 'USER'), UserController.getAllUsers);

router.patch(
  '/:id/status',
  auth('ADMIN', 'SUPER_ADMIN'),
  UserController.updateUserStatus,
);

router.patch(
  '/:id/role',
  auth('ADMIN', 'SUPER_ADMIN'),
  UserController.updateUserRole,
);

router.delete('/:id', auth('ADMIN', 'SUPER_ADMIN'), UserController.deleteUser);

router.patch(
  '/update-profile',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  UserController.updateProfile,
);

export const UserRoutes = router;
