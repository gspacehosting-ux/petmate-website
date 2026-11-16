import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { GalleryCategory } from '@prisma/client';

export const getAllGalleryImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'All' && category !== 'All Images') {
      where.category = category as GalleryCategory;
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

export const createGalleryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { filename, category, fileUrl, fileSize, dimensions, mimeType } = req.body;

    if (!fileUrl) {
      return next(new AppError('Image file or URL is required', 400));
    }

    const image = await prisma.galleryImage.create({
      data: {
        filename: filename || 'gallery-image.jpg',
        category: (category as GalleryCategory) || GalleryCategory.General,
        fileUrl,
        fileSize: fileSize || '150 KB',
        dimensions: dimensions || '800x600',
        mimeType: mimeType || 'image/jpeg',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    });

    res.status(201).json({
      status: 'success',
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadGalleryFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      return next(new AppError('No image file uploaded', 400));
    }

    const { category, dimensions } = req.body;
    const fileUrl = `/uploads/gallery/${req.file.filename}`;
    const fileSizeFormatted = `${(req.file.size / 1024).toFixed(1)} KB`;

    const newImage = await prisma.galleryImage.create({
      data: {
        filename: req.file.originalname,
        category: (category as GalleryCategory) || GalleryCategory.General,
        fileUrl,
        fileSize: fileSizeFormatted,
        dimensions: dimensions || 'Auto',
        mimeType: req.file.mimetype,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Image uploaded and cataloged successfully',
      data: newImage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    await prisma.galleryImage.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Gallery image removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
