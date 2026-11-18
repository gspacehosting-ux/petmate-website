import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BlogPost, FormSubmission, WebsiteSettings, GalleryImage, SubmissionStatus, AdminOrder } from '../types';
import { initialBlogs } from '../data/initialBlogs';
import { defaultSettings } from '../data/defaultSettings';
import { initialGallery } from '../data/initialGallery';
import { getAllImagesFromDB, saveMultipleImagesToDB, saveImageToDB, deleteImageFromDB } from '../services/db';
import { useToast } from './ToastContext';
import {
  authApi,
  blogsApi,
  settingsApi,
  submissionsApi,
  galleryApi,
  ordersApi,
  toApiGalleryCategory,
  ApiError,
} from '../services/api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  blogs: BlogPost[];
  submissions: FormSubmission[];
  settings: WebsiteSettings;
  galleryImages: GalleryImage[];
  orders: AdminOrder[];
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  adminUser: AdminUser | null;
  isLoadingGallery: boolean;
  isLoadingBlogs: boolean;
  refreshBlogs: () => Promise<void>;
  isLoadingSettings: boolean;
  refreshSettings: () => Promise<void>;
  isLoadingSubmissions: boolean;
  refreshSubmissions: () => Promise<void>;
  isLoadingOrders: boolean;
  refreshOrders: () => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addBlog: (blog: Omit<BlogPost, 'id'>) => Promise<BlogPost>;
  updateBlog: (blog: BlogPost) => Promise<BlogPost>;
  deleteBlog: (id: string) => Promise<void>;
  addSubmission: (sub: Omit<FormSubmission, 'id' | 'submissionDate' | 'status'>) => Promise<FormSubmission>;
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => Promise<FormSubmission>;
  deleteSubmission: (id: string) => Promise<void>;
  updateSettings: (newSettings: WebsiteSettings) => Promise<WebsiteSettings>;
  addGalleryImage: (image: GalleryImage) => Promise<void>;
  uploadGalleryFile: (file: File, category: GalleryImage['category'], dimensions?: string) => Promise<GalleryImage>;
  deleteGalleryImage: (id: string) => Promise<void>;
  refreshGallery: () => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Verify existing admin session on initial application load (via HTTP-only cookie)
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const admin = await authApi.getMe();
        if (isMounted && admin) {
          setAdminUser(admin);
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('petmate_blogs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialBlogs;
      }
    }
    return initialBlogs;
  });

  const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(false);

  // Fetch blogs from Railway backend on mount
  const refreshBlogs = useCallback(async () => {
    try {
      setIsLoadingBlogs(true);
      const fetchedBlogs = await blogsApi.getAll();
      if (fetchedBlogs && fetchedBlogs.length > 0) {
        setBlogs(fetchedBlogs);
        try {
          localStorage.setItem('petmate_blogs', JSON.stringify(fetchedBlogs));
        } catch (storageErr) {
          console.warn('[AdminContext] Failed to cache blogs in localStorage:', storageErr);
        }
      }
    } catch (err) {
      console.warn('[AdminContext] Backend blogs fetch failed; using cached fallback:', err);
    } finally {
      setIsLoadingBlogs(false);
    }
  }, []);

  useEffect(() => {
    refreshBlogs();
  }, [refreshBlogs]);

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState<boolean>(false);

  // Fetch form submissions from Railway backend
  const refreshSubmissions = useCallback(async () => {
    try {
      setIsLoadingSubmissions(true);
      const fetched = await submissionsApi.getAll();
      setSubmissions(fetched || []);
    } catch (err) {
      console.warn('[AdminContext] Submissions fetch notice:', err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // Fetch orders from Railway backend
  const refreshOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const fetched = await ordersApi.getAll();
      setOrders(fetched);
    } catch (err) {
      console.warn('[AdminContext] Orders fetch notice:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // When admin session is active, refresh submissions & orders
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubmissions();
      refreshOrders();
    }
  }, [isAuthenticated, refreshSubmissions, refreshOrders]);

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('petmate_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(false);

  // Fetch website settings from Railway backend on mount
  const refreshSettings = useCallback(async () => {
    try {
      setIsLoadingSettings(true);
      const fetched = await settingsApi.get();
      if (fetched) {
        setSettings(fetched);
        try {
          localStorage.setItem('petmate_settings', JSON.stringify(fetched));
        } catch (storageErr) {
          console.warn('[AdminContext] Failed to cache settings in localStorage:', storageErr);
        }
      }
    } catch (err) {
      console.warn('[AdminContext] Backend settings fetch failed; using cached fallback:', err);
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  // Sync blogs to localStorage
  useEffect(() => {
    localStorage.setItem('petmate_blogs', JSON.stringify(blogs));
  }, [blogs]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('petmate_settings', JSON.stringify(settings));
  }, [settings]);

  // Load gallery from Railway backend (with IndexedDB as resilient cache/fallback)
  const refreshGallery = useCallback(async () => {
    try {
      setIsLoadingGallery(true);
      const apiImages = await galleryApi.getAll();
      if (apiImages && apiImages.length > 0) {
        setGalleryImages(apiImages);
        try {
          await saveMultipleImagesToDB(apiImages);
        } catch (dbErr) {
          console.warn('[AdminContext] IndexedDB sync notice:', dbErr);
        }
        return;
      }
    } catch (err) {
      console.warn('[AdminContext] Backend gallery fetch notice; trying IndexedDB fallback:', err);
    } finally {
      setIsLoadingGallery(false);
    }

    // Fallback: load from IndexedDB
    try {
      const dbImages = await getAllImagesFromDB();
      if (!dbImages || dbImages.length === 0) {
        await saveMultipleImagesToDB(initialGallery);
        setGalleryImages(initialGallery);
      } else {
        setGalleryImages(dbImages);
      }
    } catch (err) {
      console.error('Error loading images from IndexedDB:', err);
      setGalleryImages(initialGallery);
    }
  }, []);

  useEffect(() => {
    refreshGallery();
  }, [refreshGallery]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await authApi.login(email.trim(), pass);
      if (res.admin) {
        setAdminUser(res.admin);
        setIsAuthenticated(true);
        showToast(
          'Welcome Back',
          `Logged in successfully as ${res.admin.name || res.admin.email}.`,
          'success'
        );
        return true;
      }
      return false;
    } catch (err) {
      const errorMsg =
        err instanceof ApiError
          ? err.message
          : 'Invalid admin credentials. Please verify your email and password.';
      showToast('Login Failed', errorMsg, 'error');
      throw new Error(errorMsg);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('[AdminContext] Backend logout request notice:', err);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setSubmissions([]);
      setOrders([]);
      try {
        localStorage.removeItem('petmate_submissions');
      } catch (storageErr) {
        console.warn('[AdminContext] Failed to remove cached submissions:', storageErr);
      }
      showToast('Logged Out', 'You have been safely signed out.', 'info');
    }
  };

  const addBlog = async (blogData: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    try {
      const created = await blogsApi.create(blogData);
      setBlogs((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
      showToast('Blog Created', `"${created.title}" published successfully.`, 'success');
      return created;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to publish blog post.';
      showToast('Create Failed', msg, 'error');
      throw err;
    }
  };

  const updateBlog = async (updated: BlogPost): Promise<BlogPost> => {
    try {
      const saved = await blogsApi.update(updated.id, updated);
      setBlogs((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
      showToast('Blog Updated', `"${saved.title}" changes saved.`, 'success');
      return saved;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update blog post.';
      showToast('Update Failed', msg, 'error');
      throw err;
    }
  };

  const deleteBlog = async (id: string): Promise<void> => {
    try {
      await blogsApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showToast('Blog Deleted', 'Article removed successfully.', 'info');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete blog post.';
      showToast('Delete Failed', msg, 'error');
      throw err;
    }
  };

  const addSubmission = async (
    subData: Omit<FormSubmission, 'id' | 'submissionDate' | 'status'>
  ): Promise<FormSubmission> => {
    try {
      const created = await submissionsApi.submit(subData);
      setSubmissions((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
      showToast('Message Received', 'Thank you! Your submission has been saved to Petmate.', 'success');
      return created;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to send message. Please check your connection and try again.';
      console.error('[AdminContext] Backend submission error:', err);
      showToast('Submission Failed', msg, 'error');
      throw err;
    }
  };

  const updateSubmissionStatus = async (
    id: string,
    status: SubmissionStatus
  ): Promise<FormSubmission> => {
    try {
      const updated = await submissionsApi.updateStatus(id, status);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      showToast('Status Updated', `Submission marked as ${status}.`, 'success');
      return updated;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update submission status.';
      console.error('[AdminContext] Backend status update notice:', err);
      showToast('Update Failed', msg, 'error');
      throw err;
    }
  };

  const deleteSubmission = async (id: string): Promise<void> => {
    try {
      await submissionsApi.delete(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      showToast('Submission Deleted', 'Record permanently removed.', 'info');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete submission.';
      console.error('[AdminContext] Backend submission delete notice:', err);
      showToast('Delete Failed', msg, 'error');
      throw err;
    }
  };

  const updateSettings = async (newSettings: WebsiteSettings): Promise<WebsiteSettings> => {
    try {
      const saved = await settingsApi.update(newSettings);
      setSettings(saved);
      try {
        localStorage.setItem('petmate_settings', JSON.stringify(saved));
      } catch (storageErr) {
        console.warn('[AdminContext] Failed to cache settings in localStorage:', storageErr);
      }
      showToast('Settings Saved', 'Petmate website settings updated on Railway.', 'success');
      return saved;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update website settings.';
      showToast('Save Failed', msg, 'error');
      throw err;
    }
  };

  const uploadGalleryFile = async (
    file: File,
    category: GalleryImage['category'],
    dimensions?: string
  ): Promise<GalleryImage> => {
    const formData = new FormData();
    formData.append('image', file);
    const apiCategory = toApiGalleryCategory(category) || 'General';
    formData.append('category', apiCategory);
    if (dimensions) {
      formData.append('dimensions', dimensions);
    }

    const created = await galleryApi.uploadFile(formData);
    setGalleryImages((prev) => [created, ...prev.filter((i) => i.id !== created.id)]);
    try {
      await saveImageToDB(created);
    } catch (dbErr) {
      console.warn('[AdminContext] IndexedDB sync notice:', dbErr);
    }
    showToast('Image Uploaded', `${created.filename} saved to Railway gallery.`, 'success');
    return created;
  };

  const addGalleryImage = async (image: GalleryImage): Promise<void> => {
    try {
      if (image.dataUrl && !image.dataUrl.startsWith('data:')) {
        const created = await galleryApi.create({
          filename: image.filename,
          category: image.category,
          fileUrl: image.dataUrl,
          fileSize: image.fileSize,
          dimensions: image.dimensions,
          mimeType: image.mimeType,
          uploadDate: image.uploadDate,
        });
        setGalleryImages((prev) => [created, ...prev.filter((img) => img.id !== created.id)]);
      } else {
        setGalleryImages((prev) => [image, ...prev.filter((img) => img.id !== image.id)]);
      }
    } catch (err) {
      console.warn('[AdminContext] Backend gallery create notice:', err);
      setGalleryImages((prev) => [image, ...prev.filter((img) => img.id !== image.id)]);
    }
    try {
      await saveImageToDB(image);
    } catch (err) {
      console.error(err);
    }
    showToast('Image Uploaded', `${image.filename} saved.`, 'success');
  };

  const deleteGalleryImage = async (id: string): Promise<void> => {
    try {
      await galleryApi.delete(id);
    } catch (err) {
      console.warn('[AdminContext] Backend gallery delete notice:', err);
    }
    try {
      await deleteImageFromDB(id);
    } catch (dbErr) {
      console.warn('[AdminContext] IndexedDB delete notice:', dbErr);
    }
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    showToast('Image Deleted', 'Image removed from gallery.', 'info');
  };

  const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    try {
      const updated = await ordersApi.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showToast('Order Updated', `Order status changed to ${status}.`, 'success');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update order status.';
      showToast('Update Failed', msg, 'error');
      throw err;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        blogs,
        submissions,
        settings,
        galleryImages,
        orders,
        isAuthenticated,
        isLoadingAuth,
        adminUser,
        isLoadingGallery,
        isLoadingBlogs,
        refreshBlogs,
        isLoadingSettings,
        refreshSettings,
        isLoadingSubmissions,
        refreshSubmissions,
        isLoadingOrders,
        refreshOrders,
        login,
        logout,
        addBlog,
        updateBlog,
        deleteBlog,
        addSubmission,
        updateSubmissionStatus,
        deleteSubmission,
        updateSettings,
        addGalleryImage,
        uploadGalleryFile,
        deleteGalleryImage,
        refreshGallery,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
