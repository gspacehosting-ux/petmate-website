import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env';
import apiRoutes from './routes';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/errors';

export const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.CLIENT_URL.split(',').map((url) => url.trim());
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or allowed frontend
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked request from origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static asset serving for uploaded media
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoints (exempt from strict rate limits)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Petmate Backend API',
    nodeVersion: process.version,
    env: env.NODE_ENV,
  });
});

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: 'v1',
    timestamp: new Date().toISOString(),
    service: 'Petmate REST API',
  });
});

// Apply rate limiting to all public API routes
app.use('/api', apiLimiter);

// Mount master REST API version 1
app.use('/api/v1', apiRoutes);

// Catch-all route for unhandled API requests
app.all('/api/*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} on Petmate API`, 404));
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`[Petmate Server] Running on http://localhost:${env.PORT}`);
    console.log(`[Petmate Server] Health check available at http://localhost:${env.PORT}/api/health`);
  });
}

export default app;
