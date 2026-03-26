import 'module-alias/register';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import router from './app/routes';
import { globalErrorHandler } from '@middleware/globalErrorHandler';
import notFound from '@middleware/notFound';
import corsOptions from '@config/cors.config';

const app: Application = express();

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Application Routes
app.use('/api/v1', router);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: 'Rangdhanu IT Server is running!' });
});

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
