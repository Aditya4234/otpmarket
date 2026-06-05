import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { env } from '@/config/env';

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ _id: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  } as jwt.SignOptions);
}

export function generateRefreshToken(userId: string, role: string): string {
  return jwt.sign({ _id: userId, role }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  } as jwt.SignOptions);
}

export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}

export function generateWithdrawalId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
  return `WDR-${timestamp}-${random}`;
}

export function generatePaymentId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
  return `PAY-${timestamp}-${random}`;
}

interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  [key: string]: unknown;
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export function buildPaginationQuery(query: PaginationQuery): {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
} {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(Math.max(1, query.limit || 10), 100);
  const skip = (page - 1) * limit;

  let sort: Record<string, 1 | -1> = { createdAt: -1 };
  if (query.sort) {
    const sortFields = query.sort.split(',');
    sort = {};
    for (const field of sortFields) {
      if (field.startsWith('-')) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    }
  }

  return { page, limit, skip, sort };
}

export async function paginate<T>(
  model: {
    countDocuments: (filter: Record<string, unknown>) => Promise<number>;
    find: (filter: Record<string, unknown>) => {
      sort: (sort: Record<string, 1 | -1>) => {
        skip: (skip: number) => {
          limit: (limit: number) => Promise<T[]>;
        };
      };
    };
  },
  filter: Record<string, unknown>,
  query: PaginationQuery,
): Promise<PaginationResult<T>> {
  const { page, limit, skip, sort } = buildPaginationQuery(query);

  const [total, data] = await Promise.all([
    model.countDocuments(filter),
    model.find(filter).sort(sort).skip(skip).limit(limit) as Promise<T[]>,
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
}
