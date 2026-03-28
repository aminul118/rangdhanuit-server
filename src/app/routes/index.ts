import express, { Router } from 'express';

import { AuthRoutes } from '../modules/Auth/Auth.route';
import { UserRoutes } from '../modules/User/User.route';
import { ConversationRoutes } from '../modules/Conversation/Conversation.route';

const router = express.Router();

import { PortfolioRoutes } from '../modules/Portfolio/Portfolio.route';
import { NotificationRoutes } from '../modules/Notification/Notification.route';

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/portfolios',
    route: PortfolioRoutes,
  },
  {
    path: '/conversations',
    route: ConversationRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
