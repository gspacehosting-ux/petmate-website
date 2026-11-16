import { z } from 'zod';

const productCategories = ['Food', 'Accessories', 'Toys', 'HealthCare', 'Grooming'] as const;
const petTypes = ['Dog', 'Cat', 'Bird', 'SmallPet', 'AllPets'] as const;

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    subtitle: z.string().optional(),
    category: z.enum(productCategories, { errorMap: () => ({ message: 'Invalid product category' }) }),
    petType: z.enum(petTypes, { errorMap: () => ({ message: 'Invalid pet type' }) }),
    price: z.number().positive('Price must be greater than 0'),
    originalPrice: z.number().positive('Original price must be greater than 0'),
    discount: z.number().min(0).max(100).default(0),
    rating: z.number().min(0).max(5).default(5),
    reviewCount: z.number().min(0).default(0),
    image: z.string().url('Product image must be a valid URL'),
    inStock: z.boolean().default(true),
    stockQuantity: z.number().int().min(0).default(50),
    isFeatured: z.boolean().default(false),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    weightOrSize: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    subtitle: z.string().optional(),
    category: z.enum(productCategories).optional(),
    petType: z.enum(petTypes).optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().positive().optional(),
    discount: z.number().min(0).max(100).optional(),
    rating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().min(0).optional(),
    image: z.string().url().optional(),
    inStock: z.boolean().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
    description: z.string().min(10).optional(),
    weightOrSize: z.string().optional(),
  }),
});
