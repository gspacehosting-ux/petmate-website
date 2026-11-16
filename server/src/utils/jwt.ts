import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AdminJwtPayload {
  id: string;
  email: string;
  role: string;
}

export const signToken = (payload: AdminJwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): AdminJwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload;
};
