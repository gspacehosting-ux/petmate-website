import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/errors';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Set secure HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: 'success',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.admin) {
      return next(new AppError('Unauthorized', 401));
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    if (!admin) {
      return next(new AppError('Admin account not found', 404));
    }

    res.status(200).json({
      status: 'success',
      admin,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};
