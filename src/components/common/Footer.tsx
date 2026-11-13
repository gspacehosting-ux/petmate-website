import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Heart } from 'lucide-react';
import { PawIcon } from './PawIcon';
import { useAdmin } from '../../context/AdminContext';

export const Footer: React.FC = () => {
  const { settings, addSubmission } = useAdmin();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;

    addSubmission({
      formType: 'Newsletter',
      customerName: 'Newsletter Subscriber',
      email: newsletterEmail.trim(),
      phone: 'Not provided',
      message: `Subscribed to Petmate Bangalore VIP Pet Parent newsletter from website footer.`
    });

    setNewsletterEmail('');
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#14532D] text-[#FFF9F0] pt-14 pb-8 border-t border-[#14532D]/40 relative overflow-hidden">
      {/* Decorative paw background watermarks */}
      <div className="absolute top-6 right-8 opacity-5 pointer-events-none">
        <PawIcon size={180} color="#FFFFFF" />
      </div>
      <div className="absolute bottom-10 left-6 opacity-5 pointer-events-none">
        <PawIcon size={140} color="#FFFFFF" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/15">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <PawIcon size={36} color="#F4770B" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">Petmate</span>
                <span className="text-xs font-semibold text-[#FFF9F0]/80">{settings.tagline}</span>
              </div>
            </Link>
            <p className="text-sm text-[#FFF9F0]/80 leading-relaxed pr-4">
              {settings.footerAbout}
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-[#26752C] px-3.5 py-1.5 rounded-full text-xs font-medium text-white shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#F4770B]" />
                <span>Bangalore's Trusted Pet Care Destination</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-[#F4770B] pb-1 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF9F0]/80">
              <li>
                <Link to="/" className="hover:text-[#F4770B] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F4770B] transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F4770B] transition-colors">About Petmate</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F4770B] transition-colors">Grooming & Services</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#F4770B] transition-colors">Pet Care Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F4770B] transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#F4770B] transition-colors opacity-75">Staff Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-[#F4770B] pb-1 inline-block">
              Shop by Pet
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF9F0]/80">
              <li>
                <Link to="/shop?pet=Dog" className="hover:text-[#F4770B] transition-colors">For Dogs</Link>
              </li>
              <li>
                <Link to="/shop?pet=Cat" className="hover:text-[#F4770B] transition-colors">For Cats</Link>
              </li>
              <li>
                <Link to="/shop?pet=Bird" className="hover:text-[#F4770B] transition-colors">For Birds</Link>
              </li>
              <li>
                <Link to="/shop?pet=Small+Pet" className="hover:text-[#F4770B] transition-colors">For Small Pets</Link>
              </li>
              <li>
                <Link to="/shop?category=Food" className="hover:text-[#F4770B] transition-colors">Pet Nutrition & Food</Link>
              </li>
              <li>
                <Link to="/shop?category=Toys" className="hover:text-[#F4770B] transition-colors">Toys & Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-[#F4770B] pb-1 inline-block">
              Stay Connected
            </h4>
            <p className="text-xs text-[#FFF9F0]/80">
              Subscribe for exclusive Bangalore pet discounts and weekly grooming tips.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/10 text-white placeholder-white/60 px-3.5 py-2.5 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#F4770B] border border-white/20"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bg-[#F4770B] hover:bg-[#e06c09] text-white p-1.5 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <span className="text-xs text-green-300 font-medium">
                  ✓ Thank you for subscribing!
                </span>
              )}
            </form>

            <div className="pt-2 text-xs text-[#FFF9F0]/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F4770B] shrink-0" />
                <span>{settings.location}, Karnataka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F4770B] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:underline">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F4770B] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F4770B] shrink-0" />
                <span>{settings.businessHours.weekdays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF9F0]/70">
          <p>© {new Date().getFullYear()} Petmate. All rights reserved. Bangalore, India.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#F4770B] fill-[#F4770B]" />
            <span>for pet parents across Bangalore</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={settings.socialLinks.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="hidden sm:inline-block font-bold text-sm pr-1">Chat with Petmate</span>
      </a>
    </footer>
  );
};
