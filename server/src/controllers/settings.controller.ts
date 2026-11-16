import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await prisma.websiteSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: {
          id: 1,
          websiteName: 'Petmate',
          tagline: "Your Pet's Best Friend",
          phone: '6363426084',
          email: 'info@Petmate.com',
          location: 'Bangalore',
          weekdayHours: 'Mon - Sat: 9:00 AM - 8:30 PM',
          weekendHours: 'Sun: 10:00 AM - 6:00 PM',
          instagramUrl: 'https://instagram.com',
          facebookUrl: 'https://facebook.com',
          youtubeUrl: 'https://youtube.com',
          whatsappUrl: 'https://wa.me/916363426084',
          footerAbout:
            "Bangalore's trusted pet shop dedicated to bringing you 100% genuine pet food, accessories, grooming essentials, and loving care for your furry family members.",
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await prisma.websiteSettings.upsert({
      where: { id: 1 },
      update: req.body,
      create: {
        id: 1,
        ...req.body,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Website settings updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
