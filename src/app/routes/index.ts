import express from 'express';

import { AuthRoutes } from '../modules/Auth/Auth.route';
import { UserRoutes } from '../modules/User/User.route';

const router = express.Router();

import { PortfolioRoutes } from '../modules/Portfolio/Portfolio.route';

const moduleRoutes: any[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/portfolios', route: PortfolioRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
