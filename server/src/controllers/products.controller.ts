import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { ProductCategory, PetType, Prisma } from '@prisma/client';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, petType, isFeatured, search, sort } = req.query;

    const where: Prisma.ProductWhereInput = {};

    if (category && typeof category === 'string' && category !== 'All') {
      where.category = category as ProductCategory;
    }

    if (petType && typeof petType === 'string' && petType !== 'All') {
      where.petType = petType as PetType;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim() } },
        { subtitle: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'discount') orderBy = { discount: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return next(new AppError('Product not found with specified ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newProduct = await prisma.product.create({
      data: req.body,
    });

    res.status(201).json({
      status: 'success',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    // Check if the product has associated order history
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      return next(
        new AppError(
          'Cannot delete product because it exists in past customer orders. You may mark it out of stock instead.',
          400
        )
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
