import { Request, Response, NextFunction } from 'express';
import { cacheService } from '@utils/CacheService';
import logger from '@utils/logger';

interface ICacheOptions {
  onlyDefault?: boolean;
}

/**
 * Express middleware to cache GET requests in Redis.
 * @param keyPrefix - Prefix for the Redis key (e.g., 'services')
 * @param ttl - Time to live in seconds (0 for infinite)
 * @param options - Additional options for caching
 */
export const cacheMiddleware = (
  keyPrefix: string,
  ttl = 3600,
  options: ICacheOptions = {},
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // We only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Check for targeted caching (only default requests)
    if (options.onlyDefault) {
      const queryKeys = Object.keys(req.query);
      // Filter out common "default" parameters if any, but usually a clean query is default
      // We allow empty query or query with only page/limit if they are default values
      const isNotDefault = queryKeys.some(
        (key) => !['page', 'limit', 'sort'].includes(key),
      );

      // If it's a complex query and we only want defaults, skip caching
      if (isNotDefault) {
        return next();
      }

      // Check if page/limit/sort are explicitly set to non-default?
      // For now, any search/filter will have other keys, so this is a good professional check.
    }

    // Generate a unique cache key based on the full URL (including query params)
    const cacheKey = `cache:${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      // Try to fetch from Redis using service
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        // Cache hit: return the stored JSON
        return res.status(200).json(cachedData);
      }

      // Cache miss: override res.json to intercept and store the response body
      const originalJson = res.json;
      res.json = function (body) {
        // Store only successful GET responses
        if (
          (res.statusCode === 200 || res.statusCode === 201) &&
          body &&
          body.success !== false
        ) {
          cacheService.set(cacheKey, body, ttl).catch((err) => {
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
  await cacheService.deleteByPrefix(keyPrefix);
};
