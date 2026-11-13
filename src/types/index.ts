export type PetType = 'Dog' | 'Cat' | 'Bird' | 'Small Pet' | 'All Pets';

export type ProductCategory = 'Food' | 'Accessories' | 'Toys' | 'Health Care' | 'Grooming';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: ProductCategory;
  petType: PetType;
  price: number;
  originalPrice: number;
  discount: number; // percentage
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  isFeatured?: boolean;
  description: string;
  weightOrSize?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type BlogCategory =
  | 'Dog Care'
  | 'Cat Care'
  | 'Pet Nutrition'
  | 'Pet Grooming'
  | 'Pet Training'
  | 'Pet Lifestyle';

export type BlogStatus = 'Published' | 'Draft';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  category: BlogCategory;
  status: BlogStatus;
  author: string;
  publishedDate: string;
  image: string;
  readTime?: string;
}

export type FormType = 'Contact Form' | 'Service Enquiry Form' | 'Newsletter';
export type SubmissionStatus = 'New' | 'Contacted' | 'Resolved';

export interface FormSubmission {
  id: string;
  formType: FormType;
  customerName: string;
  phone: string;
  email: string;
  subject?: string;
  petType?: string;
  serviceRequired?: string;
  preferredDate?: string;
  message: string;
  submissionDate: string;
  status: SubmissionStatus;
}

export type GalleryCategory =
  | 'Homepage'
  | 'Products'
  | 'Dogs'
  | 'Cats'
  | 'Birds'
  | 'Small Pets'
  | 'Services'
  | 'Blog'
  | 'General';

export interface GalleryImage {
  id: string;
  filename: string;
  category: GalleryCategory;
  dataUrl: string;
  fileSize: string;
  dimensions?: string;
  uploadDate: string;
  mimeType?: string;
}

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  businessHours: {
    weekdays: string;
    weekends: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    whatsapp: string;
  };
  footerAbout: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}
