import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BlogPost, FormSubmission, WebsiteSettings, GalleryImage, SubmissionStatus } from '../types';
import { initialBlogs } from '../data/initialBlogs';
import { initialSubmissions } from '../data/initialSubmissions';
import { defaultSettings } from '../data/defaultSettings';
import { initialGallery } from '../data/initialGallery';
import { getAllImagesFromDB, saveMultipleImagesToDB, saveImageToDB, deleteImageFromDB } from '../services/db';
import { useToast } from './ToastContext';

interface AdminContextType {
  blogs: BlogPost[];
  submissions: FormSubmission[];
  settings: WebsiteSettings;
  galleryImages: GalleryImage[];
  isAuthenticated: boolean;
  isLoadingGallery: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addBlog: (blog: Omit<BlogPost, 'id'>) => void;
  updateBlog: (blog: BlogPost) => void;
  deleteBlog: (id: string) => void;
  addSubmission: (sub: Omit<FormSubmission, 'id' | 'submissionDate' | 'status'>) => void;
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  deleteSubmission: (id: string) => void;
  updateSettings: (newSettings: WebsiteSettings) => void;
  addGalleryImage: (image: GalleryImage) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  refreshGallery: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('petmate_admin_auth') === 'true';
  });

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

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('petmate_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialSubmissions;
      }
    }
    return initialSubmissions;
  });

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

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  // Sync blogs to localStorage
  useEffect(() => {
    localStorage.setItem('petmate_blogs', JSON.stringify(blogs));
  }, [blogs]);

  // Sync submissions to localStorage
  useEffect(() => {
    localStorage.setItem('petmate_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('petmate_settings', JSON.stringify(settings));
  }, [settings]);

  // Load or seed gallery from IndexedDB
  const refreshGallery = useCallback(async () => {
    try {
      setIsLoadingGallery(true);
      const dbImages = await getAllImagesFromDB();
      if (!dbImages || dbImages.length === 0) {
        // Seed default images to IndexedDB
        await saveMultipleImagesToDB(initialGallery);
        setGalleryImages(initialGallery);
      } else {
        setGalleryImages(dbImages);
      }
    } catch (err) {
      console.error('Error loading images from IndexedDB:', err);
      setGalleryImages(initialGallery);
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);

  useEffect(() => {
    refreshGallery();
  }, [refreshGallery]);

  const login = (email: string, pass: string): boolean => {
    // Demo credentials check (info@Petmate.com or admin@petmate.com / admin123)
    const validEmail = email.trim().toLowerCase();
    if ((validEmail === 'admin@petmate.com' || validEmail === 'info@petmate.com') && pass === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('petmate_admin_auth', 'true');
      showToast('Welcome Back', 'Logged in successfully to Petmate Admin Dashboard.', 'success');
      return true;
    }
    showToast('Login Failed', 'Invalid email or password. Use demo credentials.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('petmate_admin_auth');
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const addBlog = (blogData: Omit<BlogPost, 'id'>) => {
    const id = `blog-${Date.now()}`;
    const newBlog: BlogPost = { ...blogData, id };
    setBlogs((prev) => [newBlog, ...prev]);
    showToast('Blog Created', `"${newBlog.title}" has been saved.`, 'success');
  };

  const updateBlog = (updated: BlogPost) => {
    setBlogs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    showToast('Blog Updated', `"${updated.title}" changes saved.`, 'success');
  };

  const deleteBlog = (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    showToast('Blog Deleted', `"${blog?.title || 'Post'}" removed.`, 'info');
  };

  const addSubmission = (subData: Omit<FormSubmission, 'id' | 'submissionDate' | 'status'>) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newSub: FormSubmission = {
      ...subData,
      id: `sub-${Date.now().toString().slice(-4)}`,
      submissionDate: formattedDate,
      status: 'New'
    };

    setSubmissions((prev) => [newSub, ...prev]);
    showToast('Message Received', 'Thank you! Your submission has been saved to Petmate.', 'success');
  };

  const updateSubmissionStatus = (id: string, status: SubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast('Status Updated', `Submission marked as ${status}.`, 'success');
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    showToast('Submission Deleted', 'Record permanently removed.', 'info');
  };

  const updateSettings = (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
    showToast('Settings Saved', 'Petmate website settings updated successfully.', 'success');
  };

  const addGalleryImage = async (image: GalleryImage) => {
    try {
      await saveImageToDB(image);
      setGalleryImages((prev) => [image, ...prev]);
      showToast('Image Uploaded', `${image.filename} saved to IndexedDB gallery.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Upload Error', 'Could not save image to IndexedDB.', 'error');
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      await deleteImageFromDB(id);
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      showToast('Image Deleted', 'Image removed from gallery.', 'info');
    } catch (err) {
      console.error(err);
      showToast('Delete Error', 'Could not remove image.', 'error');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        blogs,
        submissions,
        settings,
        galleryImages,
        isAuthenticated,
        isLoadingGallery,
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
        deleteGalleryImage,
        refreshGallery,
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
