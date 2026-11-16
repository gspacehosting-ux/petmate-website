import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from process.cwd(), server directory, or root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().default('petmate_default_jwt_secret_dev'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('[Petmate Config] Notice: using environment defaults or missing variables:', parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : {
      PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/petmate_db',
      JWT_SECRET: process.env.JWT_SECRET || 'petmate_default_jwt_secret_dev',
      CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    };
