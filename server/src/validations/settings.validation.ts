import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    websiteName: z.string().min(2).optional(),
    tagline: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional(),
    location: z.string().min(2).optional(),
    weekdayHours: z.string().min(2).optional(),
    weekendHours: z.string().min(2).optional(),
    instagramUrl: z.string().url().optional(),
    facebookUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    whatsappUrl: z.string().url().optional(),
    footerAbout: z.string().min(10).optional(),
  }),
});
