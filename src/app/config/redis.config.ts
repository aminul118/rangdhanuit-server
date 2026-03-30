import { createClient } from 'redis';
import envVars from './env';
import logger from '../utils/logger';

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } =
  envVars.REDIS;
const redisUrl = `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err: unknown) => {
  logger.error('Redis Client Error:', err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.log('✅ Redis Connected');
  }
};

export { redisClient };
