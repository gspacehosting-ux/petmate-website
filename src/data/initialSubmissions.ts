import { FormSubmission } from '../types';

export const initialSubmissions: FormSubmission[] = [
  {
    id: 'sub-101',
    formType: 'Service Enquiry Form',
    customerName: 'Ananya Deshmukh',
    phone: '9845123456',
    email: 'ananya.d@example.com',
    petType: 'Golden Retriever Dog',
    serviceRequired: 'Full Grooming & Spa Bath',
    preferredDate: '2026-11-16',
    message: 'Looking for a de-shedding spa bath and gentle nail trimming for our 2-year-old golden retriever Leo. He is friendly but a bit shy with hair dryers.',
    submissionDate: '13 Nov 2026, 09:15 AM',
    status: 'New'
  },
  {
    id: 'sub-102',
    formType: 'Contact Form',
    customerName: 'Karthik Raman',
    phone: '9880198765',
    email: 'karthik.raman@example.com',
    petType: 'Cat',
    subject: 'Urgent cat food stock enquiry',
    message: 'Do you carry prescription gastrointestinal cat food in Bangalore store or can you arrange same-day delivery to Indiranagar?',
    submissionDate: '12 Nov 2026, 04:30 PM',
    status: 'Contacted'
  },
  {
    id: 'sub-103',
    formType: 'Service Enquiry Form',
    customerName: 'Sunita Menon',
    phone: '9448011223',
    email: 'sunita.m@example.com',
    petType: 'Persian Cat',
    serviceRequired: 'Knot Removal & Coat Detangling',
    preferredDate: '2026-11-18',
    message: 'Need specialized gentle combing and matting removal for our white Persian cat. Looking for a weekend morning appointment.',
    submissionDate: '11 Nov 2026, 02:20 PM',
    status: 'New'
  },
  {
    id: 'sub-104',
    formType: 'Newsletter',
    customerName: 'Rohan Mehra',
    phone: '9740556677',
    email: 'rohan.mehra@example.com',
    message: 'Subscribed to Petmate Bangalore VIP Pet Parent newsletter for discounts and weekly pet care tips.',
    submissionDate: '10 Nov 2026, 11:05 AM',
    status: 'Resolved'
  },
  {
    id: 'sub-105',
    formType: 'Contact Form',
    customerName: 'Megha Kulkarni',
    phone: '9820033445',
    email: 'megha.k@example.com',
    petType: 'Budgie Bird',
    subject: 'Inquiry about natural perches & cage accessories',
    message: 'Wanted to check if you have natural fruitwood perches and chew toys in stock suitable for a pair of budgies.',
    submissionDate: '09 Nov 2026, 06:12 PM',
    status: 'Resolved'
  }
];
