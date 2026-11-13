import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ShopProvider } from './context/ShopContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/common/CartDrawer';
import { ProductModal } from './components/common/ProductModal';
import { SearchModal } from './components/common/SearchModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminBlogsPage } from './pages/admin/AdminBlogsPage';
import { AdminSubmissionsPage } from './pages/admin/AdminSubmissionsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F0] text-[#171717]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Overlays & Modals */}
      <CartDrawer />
      <ProductModal />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout />;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AdminProvider>
        <ShopProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin Login Route */}
              <Route
                path="/admin/login"
                element={
                  <>
                    <AdminLoginPage />
                    <ToastContainer />
                  </>
                }
              />

              {/* Admin Protected Dashboard Routes */}
              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="blogs" element={<AdminBlogsPage />} />
                <Route path="submissions" element={<AdminSubmissionsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ShopProvider>
      </AdminProvider>
    </ToastProvider>
  );
};

export default App;
