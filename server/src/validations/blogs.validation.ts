import { z } from 'zod';

const blogCategories = [
  'DogCare',
  'CatCare',
  'PetNutrition',
  'PetGrooming',
  'PetTraining',
  'PetLifestyle',
] as const;

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Blog title must be at least 5 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    category: z.enum(blogCategories, { errorMap: () => ({ message: 'Invalid blog category' }) }),
    status: z.enum(['Published', 'Draft']).default('Draft'),
    author: z.string().default('Petmate Team'),
    image: z.string().url('Cover image must be a valid URL'),
    readTime: z.string().default('4 min read'),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    slug: z.string().min(3).optional(),
    shortDescription: z.string().min(10).optional(),
    content: z.string().min(20).optional(),
    category: z.enum(blogCategories).optional(),
    status: z.enum(['Published', 'Draft']).optional(),
    author: z.string().optional(),
    image: z.string().url().optional(),
    readTime: z.string().optional(),
  }),
});
