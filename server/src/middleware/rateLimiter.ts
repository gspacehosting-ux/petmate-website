import rateLimit from 'express-rate-limit';

// Rate limit for authentication attempts (10 tries per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 'fail',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for public form submissions (Contact, Grooming, Newsletter: 20 submissions per 15 minutes)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: 'fail',
    message: 'Too many submissions received from this IP. Please wait before submitting again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General public API rate limiter (300 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
