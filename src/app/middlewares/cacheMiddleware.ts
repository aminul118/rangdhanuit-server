import { Request, Response, NextFunction } from 'express';
import { redisClient } from '@config/redis.config';
import logger from '@utils/logger';

/**
 * Express middleware to cache GET requests in Redis.
 * @param keyPrefix - Prefix for the Redis key (e.g., 'services')
 * @param ttl - Time to live in seconds (default: 3600)
 */
export const cacheMiddleware = (keyPrefix: string, ttl = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // We only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate a unique cache key based on the full URL (including query params)
    const cacheKey = `cache:${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      // If Redis is not connected, skip caching
      if (!redisClient.isOpen) {
        return next();
      }

      // Try to fetch from Redis
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        // Cache hit: return the stored JSON
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Cache miss: override res.json to intercept and store the response body
      const originalJson = res.json;
      res.json = function (body) {
        // Store only successful GET responses
        if (res.statusCode === 200 && body && body.success !== false) {
          redisClient
            .setEx(cacheKey, ttl, JSON.stringify(body))
            .catch((err) => {
              logger.error(`[Redis] Failed to set cache for ${cacheKey}:`, err);
            });
        }
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      // In case of any error with Redis, proceed to the next middleware (database)
      logger.error(`[Redis] Cache middleware error for ${cacheKey}:`, error);
      next();
    }
  };
};

/**
 * Utility to clear cache for a specific prefix.
 * @param keyPrefix - The prefix to clear (e.g., 'services')
 */
export const clearCache = async (keyPrefix: string) => {
  try {
    if (!redisClient.isOpen) return;

    // Find all keys with the given prefix
    const keys = await redisClient.keys(`cache:${keyPrefix}:*`);

    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.log(
        `[Redis] Cleared ${keys.length} cache keys for prefix: ${keyPrefix}`,
      );
    }
  } catch (error) {
    logger.error(`[Redis] Clear cache error for prefix ${keyPrefix}:`, error);
  }
};
