import {
  Product,
  BlogPost,
  BlogCategory,
  GalleryImage,
  WebsiteSettings,
  FormSubmission,
  FormType,
  SubmissionStatus,
  AdminOrder,
} from '../types';

// ============================================================================
// BASE CONFIGURATION
// ============================================================================

// Base API URL default to Railway deployed backend, with Vite env override support
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://petmate-website-production.up.railway.app/api/v1';

// In-memory token storage (avoids persisting sensitive tokens in localStorage directly)
let inMemoryAuthToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  inMemoryAuthToken = token;
};

export const getAuthToken = (): string | null => inMemoryAuthToken;

// Custom API Error Class
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Request Options Interface
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

// Standard API Response Wrapper
interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  results?: number;
  token?: string;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  data?: T;
  message?: string;
}

// ============================================================================
// CENTRALIZED FETCH CLIENT
// ============================================================================

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...customOptions } = options;

  // Build query string if params are provided
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Setup request headers
  const headers = new Headers(customHeaders);

  // Send Authorization Bearer header if in-memory token is present
  if (inMemoryAuthToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${inMemoryAuthToken}`);
  }

  // Handle FormData vs JSON payload
  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    // FormData: let browser set multipart/form-data boundary automatically
    requestBody = body;
  } else if (body !== undefined && body !== null) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    requestBody = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers,
      body: requestBody,
      // Always include credentials to support secure HTTP-only cookies across CORS
      credentials: 'include',
    });

    // Parse JSON response body
    let responseData: unknown;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errPayload = responseData as { message?: string } | undefined;
      const errorMessage =
        errPayload?.message ||
        `Request failed with status ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : 'Network connection failed. Please check your internet.';
    throw new ApiError(message, 0);
  }
}

// ============================================================================
// NORMALIZATION HELPERS
// ============================================================================

interface RawProductData {
  id: string;
  name: string;
  subtitle?: string | null;
  category: Product['category'];
  petType: Product['petType'];
  price: string | number;
  originalPrice: string | number;
  discount?: number;
  rating?: string | number;
  reviewCount?: number;
  image: string;
  inStock?: boolean;
  stockQuantity?: number;
  isFeatured?: boolean;
  description: string;
  weightOrSize?: string | null;
}

const normalizeProduct = (p: RawProductData): Product => ({
  id: p.id,
  name: p.name,
  subtitle: p.subtitle || undefined,
  category: p.category,
  petType: p.petType,
  price: Number(p.price) || 0,
  originalPrice: Number(p.originalPrice) || Number(p.price) || 0,
  discount: p.discount ?? 0,
  rating: Number(p.rating) || 5.0,
  reviewCount: p.reviewCount ?? 0,
  image: p.image,
  inStock: Boolean(p.inStock ?? true),
  isFeatured: Boolean(p.isFeatured ?? false),
  description: p.description,
  weightOrSize: p.weightOrSize || undefined,
});

interface RawSettingsData {
  websiteName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  weekdayHours: string;
  weekendHours: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
  footerAbout: string;
}

const normalizeSettings = (s: RawSettingsData): WebsiteSettings => ({
  websiteName: s.websiteName || 'Petmate',
  tagline: s.tagline || "Your Pet's Best Friend",
  phone: s.phone || '6363426084',
  email: s.email || 'info@Petmate.com',
  location: s.location || 'Bangalore',
  businessHours: {
    weekdays: s.weekdayHours || 'Mon - Sat: 9:00 AM - 8:30 PM',
    weekends: s.weekendHours || 'Sun: 10:00 AM - 6:00 PM',
  },
  socialLinks: {
    instagram: s.instagramUrl || 'https://instagram.com',
    facebook: s.facebookUrl || 'https://facebook.com',
    youtube: s.youtubeUrl || 'https://youtube.com',
    whatsapp: s.whatsappUrl || 'https://wa.me/916363426084',
  },
  footerAbout: s.footerAbout || '',
});

const denormalizeSettings = (s: WebsiteSettings): RawSettingsData => ({
  websiteName: s.websiteName,
  tagline: s.tagline,
  phone: s.phone,
  email: s.email,
  location: s.location,
  weekdayHours: s.businessHours.weekdays,
  weekendHours: s.businessHours.weekends,
  instagramUrl: s.socialLinks.instagram,
  facebookUrl: s.socialLinks.facebook,
  youtubeUrl: s.socialLinks.youtube,
  whatsappUrl: s.socialLinks.whatsapp,
  footerAbout: s.footerAbout,
});

export const toApiGalleryCategory = (cat?: string): string | undefined => {
  if (!cat || cat === 'All' || cat === 'All Images') return undefined;
  if (cat === 'Small Pets') return 'SmallPets';
  return cat;
};

export const fromApiGalleryCategory = (cat?: string): GalleryImage['category'] => {
  if (cat === 'SmallPets') return 'Small Pets';
  return (cat as GalleryImage['category']) || 'General';
};

interface RawGalleryData {
  id: string;
  filename: string;
  category: string;
  fileUrl: string;
  fileSize: string;
  dimensions?: string | null;
  mimeType?: string;
  uploadDate: string;
}

const normalizeGallery = (g: RawGalleryData): GalleryImage => {
  let dataUrl = g.fileUrl;
  if (dataUrl && dataUrl.startsWith('/')) {
    const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    dataUrl = `${origin}${dataUrl}`;
  }
  return {
    id: g.id,
    filename: g.filename,
    category: fromApiGalleryCategory(g.category),
    dataUrl,
    fileSize: g.fileSize,
    dimensions: g.dimensions || undefined,
    mimeType: g.mimeType || 'image/jpeg',
    uploadDate: g.uploadDate,
  };
};

const fromApiFormType = (ft: string): FormType => {
  if (ft === 'ContactForm' || ft === 'Contact Form') return 'Contact Form';
  if (ft === 'ServiceEnquiryForm' || ft === 'Service Enquiry Form') return 'Service Enquiry Form';
  return 'Newsletter';
};

interface RawSubmissionData {
  id: string;
  formType: string;
  customerName: string;
  phone: string;
  email: string;
  subject?: string | null;
  petType?: string | null;
  serviceRequired?: string | null;
  preferredDate?: string | null;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

const normalizeSubmission = (sub: RawSubmissionData): FormSubmission => ({
  id: sub.id,
  formType: fromApiFormType(sub.formType),
  customerName: sub.customerName || 'Customer',
  phone: sub.phone || '',
  email: sub.email,
  subject: sub.subject || undefined,
  petType: sub.petType || undefined,
  serviceRequired: sub.serviceRequired || undefined,
  preferredDate: sub.preferredDate || undefined,
  message: sub.message,
  status: sub.status,
  submissionDate: new Date(sub.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
});

// ============================================================================
// SERVICE API MODULES
// ============================================================================

// --- Authentication Service ---
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient<ApiResponse<null>>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return {
      admin: res.admin,
      token: res.token,
    };
  },

  getMe: async () => {
    const res = await apiClient<{ status: string; admin: { id: string; email: string; name: string; role: string } }>(
      '/auth/me',
      { method: 'GET' }
    );
    return res.admin;
  },

  logout: async () => {
    try {
      await apiClient<ApiResponse<null>>('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },
};

// --- Products Service ---
export const productsApi = {
  getAll: async (params?: {
    category?: string;
    petType?: string;
    isFeatured?: boolean;
    search?: string;
    sort?: string;
  }): Promise<Product[]> => {
    const res = await apiClient<ApiResponse<RawProductData[]>>('/products', {
      method: 'GET',
      params,
    });
    const items = res.data || [];
    return items.map(normalizeProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const res = await apiClient<ApiResponse<RawProductData>>(`/products/${id}`, {
      method: 'GET',
    });
    if (!res.data) throw new ApiError('Product not found', 404);
    return normalizeProduct(res.data);
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await apiClient<ApiResponse<RawProductData>>('/products', {
      method: 'POST',
      body: data,
    });
    if (!res.data) throw new ApiError('Failed to create product', 500);
    return normalizeProduct(res.data);
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await apiClient<ApiResponse<RawProductData>>(`/products/${id}`, {
      method: 'PUT',
      body: data,
    });
    if (!res.data) throw new ApiError('Failed to update product', 500);
    return normalizeProduct(res.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient<ApiResponse<null>>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Blogs Service ---
const toApiBlogCategory = (cat?: string): string | undefined => {
  if (!cat || cat === 'All') return undefined;
  return cat.replace(/\s+/g, '');
};

const fromApiBlogCategory = (cat?: string): BlogCategory => {
  if (!cat) return 'Dog Care';
  const map: Record<string, BlogCategory> = {
    DogCare: 'Dog Care',
    'Dog Care': 'Dog Care',
    CatCare: 'Cat Care',
    'Cat Care': 'Cat Care',
    PetNutrition: 'Pet Nutrition',
    'Pet Nutrition': 'Pet Nutrition',
    PetGrooming: 'Pet Grooming',
    'Pet Grooming': 'Pet Grooming',
    PetTraining: 'Pet Training',
    'Pet Training': 'Pet Training',
    PetLifestyle: 'Pet Lifestyle',
    'Pet Lifestyle': 'Pet Lifestyle',
  };
  return map[cat] || (cat as BlogCategory);
};

const normalizeBlog = (b: BlogPost): BlogPost => ({
  ...b,
  category: fromApiBlogCategory(b.category),
});

export const blogsApi = {
  getAll: async (params?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<BlogPost[]> => {
    const apiParams = params
      ? { ...params, category: toApiBlogCategory(params.category) }
      : undefined;
    const res = await apiClient<ApiResponse<BlogPost[]>>('/blogs', {
      method: 'GET',
      params: apiParams,
    });
    const items = res.data || [];
    return items.map(normalizeBlog);
  },

  getByIdOrSlug: async (idOrSlug: string): Promise<BlogPost> => {
    const res = await apiClient<ApiResponse<BlogPost>>(`/blogs/${idOrSlug}`, {
      method: 'GET',
    });
    if (!res.data) throw new ApiError('Blog post not found', 404);
    return normalizeBlog(res.data);
  },

  create: async (blogData: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const payload = {
      ...blogData,
      category: toApiBlogCategory(blogData.category),
    };
    const res = await apiClient<ApiResponse<BlogPost>>('/blogs', {
      method: 'POST',
      body: payload,
    });
    if (!res.data) throw new ApiError('Failed to create blog post', 500);
    return normalizeBlog(res.data);
  },

  update: async (id: string, blogData: Partial<BlogPost>): Promise<BlogPost> => {
    const payload = {
      ...blogData,
      ...(blogData.category ? { category: toApiBlogCategory(blogData.category) } : {}),
    };
    const res = await apiClient<ApiResponse<BlogPost>>(`/blogs/${id}`, {
      method: 'PUT',
      body: payload,
    });
    if (!res.data) throw new ApiError('Failed to update blog post', 500);
    return normalizeBlog(res.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient<ApiResponse<null>>(`/blogs/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Website Settings Service ---
export const settingsApi = {
  get: async (): Promise<WebsiteSettings> => {
    const res = await apiClient<ApiResponse<RawSettingsData>>('/settings', {
      method: 'GET',
    });
    if (!res.data) throw new ApiError('Settings not found', 404);
    return normalizeSettings(res.data);
  },

  update: async (settings: WebsiteSettings): Promise<WebsiteSettings> => {
    const payload = denormalizeSettings(settings);
    const res = await apiClient<ApiResponse<RawSettingsData>>('/settings', {
      method: 'PUT',
      body: payload,
    });
    if (!res.data) throw new ApiError('Failed to update settings', 500);
    return normalizeSettings(res.data);
  },
};

// --- Form Submissions Service ---
export const submissionsApi = {
  submit: async (
    data: Omit<FormSubmission, 'id' | 'submissionDate' | 'status'>
  ): Promise<FormSubmission> => {
    const res = await apiClient<ApiResponse<RawSubmissionData>>('/submissions', {
      method: 'POST',
      body: data,
    });
    if (!res.data) throw new ApiError('Failed to record submission', 500);
    return normalizeSubmission(res.data);
  },

  getAll: async (params?: { formType?: string; status?: string }): Promise<FormSubmission[]> => {
    const res = await apiClient<ApiResponse<RawSubmissionData[]>>('/submissions', {
      method: 'GET',
      params,
    });
    const items = res.data || [];
    return items.map(normalizeSubmission);
  },

  updateStatus: async (id: string, status: SubmissionStatus): Promise<FormSubmission> => {
    const res = await apiClient<ApiResponse<RawSubmissionData>>(`/submissions/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    if (!res.data) throw new ApiError('Failed to update submission status', 500);
    return normalizeSubmission(res.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient<ApiResponse<null>>(`/submissions/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Gallery Service ---
export const galleryApi = {
  getAll: async (params?: { category?: string }): Promise<GalleryImage[]> => {
    const apiParams = params?.category
      ? { ...params, category: toApiGalleryCategory(params.category) }
      : undefined;
    const res = await apiClient<ApiResponse<RawGalleryData[]>>('/gallery', {
      method: 'GET',
      params: apiParams,
    });
    const items = res.data || [];
    return items.map(normalizeGallery);
  },

  create: async (data: {
    filename: string;
    category: GalleryImage['category'];
    fileUrl: string;
    fileSize: string;
    dimensions?: string;
    mimeType?: string;
    uploadDate?: string;
  }): Promise<GalleryImage> => {
    const payload = {
      ...data,
      category: toApiGalleryCategory(data.category),
    };
    const res = await apiClient<ApiResponse<RawGalleryData>>('/gallery', {
      method: 'POST',
      body: payload,
    });
    if (!res.data) throw new ApiError('Failed to record gallery image', 500);
    return normalizeGallery(res.data);
  },

  uploadFile: async (formData: FormData): Promise<GalleryImage> => {
    const res = await apiClient<ApiResponse<RawGalleryData>>(
      '/gallery/upload',
      {
        method: 'POST',
        body: formData,
      }
    );
    if (!res.data) throw new ApiError('Failed to upload file', 500);
    return normalizeGallery(res.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient<ApiResponse<null>>(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Orders Service ---
interface RawOrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string | null;
  subtotal: number | string;
  deliveryFee: number | string;
  total: number | string;
  paymentMethod: string;
  paymentStatus: AdminOrder['paymentStatus'];
  status: AdminOrder['status'];
  createdAt: string;
  items?: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number | string;
    product?: {
      id: string;
      name: string;
      image: string;
      price: number | string;
    };
  }>;
}

const normalizeOrder = (o: RawOrderData): AdminOrder => ({
  id: o.id,
  customerName: o.customerName,
  customerEmail: o.customerEmail,
  customerPhone: o.customerPhone,
  shippingAddress: o.shippingAddress || undefined,
  subtotal: Number(o.subtotal) || 0,
  deliveryFee: Number(o.deliveryFee) || 0,
  total: Number(o.total) || 0,
  paymentMethod: o.paymentMethod,
  paymentStatus: o.paymentStatus,
  status: o.status,
  createdAt: o.createdAt,
  items: o.items?.map((item) => ({
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice) || 0,
    product: item.product
      ? {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: Number(item.product.price) || 0,
        }
      : undefined,
  })),
});

export const ordersApi = {
  createOrder: async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress?: string;
    paymentMethod?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<{ status: string; order: unknown }> => {
    return apiClient<{ status: string; order: unknown }>('/orders', {
      method: 'POST',
      body: orderData,
    });
  },

  getAll: async (params?: { status?: string }): Promise<AdminOrder[]> => {
    const res = await apiClient<ApiResponse<RawOrderData[]>>('/orders', {
      method: 'GET',
      params,
    });
    const items = res.data || [];
    return items.map(normalizeOrder);
  },

  updateStatus: async (id: string, status: string): Promise<AdminOrder> => {
    const res = await apiClient<ApiResponse<RawOrderData>>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    if (!res.data) throw new ApiError('Failed to update order status', 500);
    return normalizeOrder(res.data);
  },
};
