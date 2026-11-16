import { z } from 'zod';

export const createSubmissionSchema = z.object({
  body: z.object({
    formType: z.enum(['ContactForm', 'ServiceEnquiryForm', 'Newsletter', 'Contact Form', 'Service Enquiry Form']).transform((val) => {
      if (val === 'Contact Form') return 'ContactForm';
      if (val === 'Service Enquiry Form') return 'ServiceEnquiryForm';
      return val;
    }),
    email: z.string().email('Please enter a valid email address'),
    customerName: z.string().optional().default('Newsletter Subscriber'),
    phone: z.string().optional(),
    subject: z.string().optional(),
    petType: z.string().optional(),
    serviceRequired: z.string().optional(),
    preferredDate: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const updateSubmissionStatusSchema = z.object({
  body: z.object({
    status: z.enum(['New', 'Contacted', 'Resolved']),
  }),
});
