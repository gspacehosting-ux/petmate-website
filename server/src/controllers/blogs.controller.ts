import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { BlogCategory, BlogStatus, Prisma } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getAllBlogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, status } = req.query;

    const where: Prisma.BlogPostWhereInput = {};

    // Only administrators can see drafts; public sees published only
    if (!req.admin) {
      where.status = BlogStatus.Published;
    } else if (status && (status === 'Draft' || status === 'Published')) {
      where.status = status as BlogStatus;
    }

    if (category && typeof category === 'string' && category !== 'All') {
      where.category = category as BlogCategory;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { shortDescription: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogByIdOrSlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idOrSlug = (Array.isArray(req.params.idOrSlug) ? req.params.idOrSlug[0] : req.params.idOrSlug) as string;

    const blog = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!blog) {
      return next(new AppError('Blog article not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, slug, shortDescription, content, category, status, author, image, readTime } = req.body;

    const generatedSlug = slug ? slugify(slug) : slugify(title);

    // Verify slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug: generatedSlug },
    });

    const finalSlug = existing ? `${generatedSlug}-${Date.now().toString().slice(-4)}` : generatedSlug;

    const newBlog = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        shortDescription,
        content,
        category: category as BlogCategory,
        status: (status as BlogStatus) || BlogStatus.Draft,
        author: author || 'Petmate Team',
        image,
        readTime: readTime || '4 min read',
        publishedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    });

    res.status(201).json({
      status: 'success',
      data: newBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    if (req.body.slug) {
      req.body.slug = slugify(req.body.slug);
    }

    const updated = await prisma.blogPost.update({
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

export const deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    await prisma.blogPost.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
