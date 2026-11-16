import { Request, Response, NextFunction } from 'express';
import { verifyToken, AdminJwtPayload } from '../utils/jwt';
import { AppError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  admin?: AdminJwtPayload;
}

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.auth_token) {
    // 2. Fallback to secure HTTP-only cookie
    token = req.cookies.auth_token;
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in to access this resource.', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token. Please log in again.', 401));
  }
};
