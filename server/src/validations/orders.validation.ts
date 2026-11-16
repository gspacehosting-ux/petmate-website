import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    customerEmail: z.string().email('Valid customer email is required'),
    customerPhone: z.string().min(7, 'Valid contact phone number is required'),
    shippingAddress: z.string().optional(),
    paymentMethod: z.string().default('Cash on Delivery'),
    items: z.array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      })
    ).min(1, 'Order must contain at least one item'),
  }),
});
