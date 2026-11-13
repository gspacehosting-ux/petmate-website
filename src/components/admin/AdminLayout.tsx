import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User,
} from 'lucide-react';
import { PawIcon } from '../common/PawIcon';
import { useAdmin } from '../../context/AdminContext';

export const AdminLayout: React.FC = () => {
  const { logout, settings, submissions } = useAdmin();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const newSubmissionsCount = submissions.filter((s) => s.status === 'New').length;

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Image Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Blog Management', path: '/admin/blogs', icon: BookOpen },
    {
      name: 'Form Submissions',
      path: '/admin/submissions',
      icon: Inbox,
      badge: newSubmissionsCount > 0 ? newSubmissionsCount : null,
    },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row text-[#171717]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#14532D] text-white shrink-0 border-r border-[#0e3a1f]">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <PawIcon size={28} color="#F4770B" />
            <div>
              <span className="text-xl font-black text-white tracking-tight leading-none block">
                Petmate
              </span>
              <span className="text-[10px] font-bold text-[#EDF4E5]/80 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#26752C] text-white shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="bg-[#F4770B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#F4770B]" />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-300 hover:text-red-200 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#14532D] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <PawIcon size={24} color="#F4770B" />
          <span className="text-lg font-black text-white">Petmate Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white"
          aria-label="Toggle Menu"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-[#14532D] text-white border-b border-white/15 p-4 space-y-2 z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-[#26752C] text-white' : 'text-white/80 hover:bg-white/10'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="bg-[#F4770B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
            <Link to="/" className="text-white/80 hover:text-white flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </Link>
            <button onClick={handleLogout} className="text-red-300 font-bold">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-[#26752C]" />
            <span>Petmate Management Console</span>
            <span>•</span>
            <span className="text-[#14532D] font-bold">{settings.websiteName} Bangalore</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-semibold text-[#14532D] bg-[#EDF4E5] hover:bg-[#26752C] hover:text-white px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#14532D] text-white flex items-center justify-center text-xs font-bold">
                PM
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="font-bold text-[#171717] block">Staff Manager</span>
                <span className="text-gray-400 text-[10px]">admin@petmate.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nested Sub-route Outlet */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
