import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Search, User, ShoppingBag, Menu, X, ShieldAlert } from 'lucide-react';
import { PawIcon } from './PawIcon';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';

export const Header: React.FC = () => {
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useShop();
  const { settings, isAuthenticated } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0] border-b border-[#F0EAE1] shadow-xs">
      {/* Top utility contact & social bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#171717]">
          {/* Logo Brand on top-left (visible or aligned) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="transition-transform group-hover:scale-105">
              <PawIcon size={34} color="#F4770B" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14532D] leading-none">
                Petmate
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#666666] tracking-wide mt-0.5">
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Quick contact and social icons */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {/* Location */}
            <div className="hidden md:flex items-center gap-1.5 text-[#171717] font-medium">
              <MapPin className="w-4 h-4 text-[#26752C]" />
              <span>{settings.location}</span>
            </div>

            {/* Phone */}
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-[#171717] font-semibold hover:text-[#26752C] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#26752C]" />
              <span>{settings.phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}`}
              className="hidden lg:flex items-center gap-1.5 text-[#171717] font-medium hover:text-[#26752C] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#26752C]" />
              <span>{settings.email}</span>
            </a>

            {/* Social media icons */}
            <div className="flex items-center gap-2">
              {/* Instagram */}
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] flex items-center justify-center text-white shadow-xs hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={settings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                title="YouTube"
                className="w-7 h-7 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-xs hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Navigation links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? 'bg-[#26752C] text-white font-semibold px-4 py-1.5 rounded-full text-sm transition-all duration-200 shadow-xs'
                    : 'text-[#171717] hover:text-[#26752C] font-medium px-3.5 py-1.5 rounded-full text-sm hover:bg-[#EDF4E5]/50 transition-colors'
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons on right */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="p-2 text-[#171717] hover:text-[#26752C] hover:bg-[#EDF4E5] rounded-full transition-colors"
              title="Search Petmate"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / Admin Portal */}
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              aria-label="Admin Portal"
              className="p-2 text-[#171717] hover:text-[#26752C] hover:bg-[#EDF4E5] rounded-full transition-colors relative group"
              title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            >
              <User className="w-5 h-5" />
              {isAuthenticated && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#26752C] border-2 border-white rounded-full"></span>
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2 text-[#171717] hover:text-[#26752C] hover:bg-[#EDF4E5] rounded-full transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#F4770B] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#171717] hover:bg-[#EDF4E5] rounded-lg transition-colors ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F0EAE1] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'bg-[#26752C] text-white font-semibold px-4 py-2.5 rounded-xl text-base'
                    : 'text-[#171717] hover:bg-[#EDF4E5] font-medium px-4 py-2.5 rounded-xl text-base'
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#14532D] bg-[#EDF4E5] px-4 py-2.5 rounded-xl"
              >
                <ShieldAlert className="w-4 h-4 text-[#26752C]" />
                {isAuthenticated ? 'Admin Dashboard' : 'Admin Login (Staff)'}
              </Link>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 bg-[#F4770B] text-white font-bold py-2.5 rounded-xl text-sm shadow-xs"
              >
                <Phone className="w-4 h-4" />
                Call {settings.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
