/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from 'mongoose';
import { redis } from '../config/redis.config';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm || this.query?.search;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as any,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      'searchTerm',
      'search',
      'sort',
      'limit',
      'page',
      'fields',
    ];

    // Filter out excluded fields to avoid dynamic deletion (bad for performance/linting)
    const filteredQuery = Object.fromEntries(
      Object.entries(queryObj).filter(([key]) => !excludeFields.includes(key)),
    );

    this.modelQuery = this.modelQuery.find(filteredQuery as any);

    return this;
  }

  sort() {
    const sort =
      (this.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  /**
   * Caching layer using Redis
   * @param key Cache key
   * @param ttl Time to live in seconds
   */
  async cache(key: string, ttl = 3600) {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const result = await this.modelQuery;
    if (ttl > 0) {
      await redis.set(key, JSON.stringify(result), 'EX', ttl);
    } else {
      await redis.set(key, JSON.stringify(result));
    }

    return result;
  }
  async execute() {
    const data = await this.modelQuery;
    const meta = await this.countTotal();
    return { data, meta };
  }
}
