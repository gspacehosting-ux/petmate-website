import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items } = req.body;

    const productIds = items.map((i: { productId: string }) => i.productId);

    // 1. Fetch real product data from the database (DO NOT trust client prices!)
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (dbProducts.length !== productIds.length) {
      return next(new AppError('One or more selected products are invalid or no longer available.', 400));
    }

    // 2. Validate stock & compute exact totals on the server
    let subtotalNumber = 0;
    const preparedOrderItems: { productId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) {
        return next(new AppError(`Product not found: ${item.productId}`, 400));
      }

      if (!dbProduct.inStock || dbProduct.stockQuantity < item.quantity) {
        return next(
          new AppError(
            `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stockQuantity}, requested: ${item.quantity}`,
            400
          )
        );
      }

      const unitPrice = Number(dbProduct.price);
      subtotalNumber += unitPrice * item.quantity;

      preparedOrderItems.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        unitPrice,
      });
    }

    // 3. Server-computed delivery fee (Free for orders >= 499, otherwise Rs. 49)
    const deliveryFeeNumber = subtotalNumber >= 499 || subtotalNumber === 0 ? 0 : 49;
    const grandTotalNumber = subtotalNumber + deliveryFeeNumber;

    // 4. Atomically persist order, line items, and adjust stock in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: shippingAddress || null,
          subtotal: subtotalNumber,
          deliveryFee: deliveryFeeNumber,
          total: grandTotalNumber,
          paymentMethod: paymentMethod || 'Cash on Delivery',
          paymentStatus: PaymentStatus.pending,
          status: OrderStatus.pending,
          items: {
            create: preparedOrderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, image: true, category: true },
              },
            },
          },
        },
      });

      // Decrement product inventory safely
      for (const item of preparedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      return createdOrder;
    });

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, image: true, subtitle: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { status, paymentStatus } = req.body;

    const data: any = {};
    if (status) data.status = status as OrderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus as PaymentStatus;

    const updated = await prisma.order.update({
      where: { id },
      data,
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
