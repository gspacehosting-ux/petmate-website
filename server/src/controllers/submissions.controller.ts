import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { FormType, SubmissionStatus, Prisma } from '@prisma/client';

export const createSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { formType, customerName, phone, email, subject, petType, serviceRequired, preferredDate, message } =
      req.body;

    const newSubmission = await prisma.formSubmission.create({
      data: {
        formType: formType as FormType,
        customerName: customerName || 'Newsletter Subscriber',
        phone: phone || null,
        email: email.trim().toLowerCase(),
        subject: subject || null,
        petType: petType || null,
        serviceRequired: serviceRequired || null,
        preferredDate: preferredDate || null,
        message: message || null,
        status: SubmissionStatus.New,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Submission received successfully',
      data: newSubmission,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { formType, status, search } = req.query;

    const where: Prisma.FormSubmissionWhereInput = {};

    if (formType && typeof formType === 'string' && formType !== 'All') {
      if (formType === 'Contact Form' || formType === 'ContactForm') where.formType = FormType.ContactForm;
      else if (formType === 'Service Enquiry Form' || formType === 'ServiceEnquiryForm') where.formType = FormType.ServiceEnquiryForm;
      else if (formType === 'Newsletter') where.formType = FormType.Newsletter;
    }

    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status as SubmissionStatus;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { customerName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { subject: { contains: q } },
        { message: { contains: q } },
      ];
    }

    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { status } = req.body;

    const updated = await prisma.formSubmission.update({
      where: { id },
      data: { status: status as SubmissionStatus },
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    await prisma.formSubmission.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Submission removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
