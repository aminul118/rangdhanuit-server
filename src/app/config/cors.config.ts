import { CorsOptions } from 'cors';
import envVars from './env';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

if (envVars.FRONTEND_URL) {
  const envOrigins = envVars.FRONTEND_URL.split(',').map((url) => url.trim());
  envOrigins.forEach((url) => {
    if (url && !allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

export default corsOptions;
