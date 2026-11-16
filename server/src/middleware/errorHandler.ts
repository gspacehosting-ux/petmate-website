import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected internal error occurred.';

  // Handle Prisma Database Connection or Query Errors cleanly without leaking DB URLs
  if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    statusCode = 503;
    message = 'Database service is currently unavailable or busy. Please try again shortly.';
    console.error('[Prisma Error Code]:', err.code);
  }

  // Handle JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token signature.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  const responsePayload: {
    status: 'fail' | 'error';
    message: string;
    stack?: string;
  } = {
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message,
  };

  // Only include stack trace during local non-production debugging
  if (env.NODE_ENV === 'development' && statusCode === 500) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
