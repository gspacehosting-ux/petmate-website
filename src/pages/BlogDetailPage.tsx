import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { PawIcon } from '../components/common/PawIcon';
import { ContactCtaBar } from '../components/home/ContactCtaBar';

export const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs } = useAdmin();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Find blog
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#F0EAE1] shadow-xs space-y-4">
          <BookOpen className="w-12 h-12 text-[#F4770B] mx-auto" />
          <h2 className="text-xl font-bold text-[#171717]">Blog Post Not Found</h2>
          <p className="text-xs text-[#666666]">
            The requested pet care guide may have been moved or removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#26752C] hover:bg-[#14532D] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related articles
  const relatedBlogs = blogs
    .filter((b) => b.id !== blog.id && b.status === 'Published')
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`Read "${blog.title}" on Petmate: `);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link Copied', 'Article link copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Header */}
      <section className="bg-[#EDF4E5]/50 border-b border-[#F0EAE1] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D] hover:text-[#26752C] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Pet Care Blog</span>
            </Link>

            <span className="bg-[#F4770B] text-white text-xs font-bold px-3 py-1 rounded-full">
              {blog.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#14532D] tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666] mt-4 pt-3 border-t border-[#F0EAE1]">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#26752C]" />
              <span className="font-semibold text-[#171717]">{blog.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F4770B]" />
              <span>{blog.publishedDate}</span>
            </div>
            {blog.readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#26752C]" />
                <span>{blog.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Article Body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-md mb-8 max-h-[460px] bg-gray-100">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Short Description Lead */}
        <p className="text-base sm:text-lg font-medium text-[#14532D] bg-[#EDF4E5] p-5 sm:p-6 rounded-2xl mb-8 leading-relaxed border border-[#26752C]/10">
          {blog.shortDescription}
        </p>

        {/* Formatted Content */}
        <div className="prose prose-sm sm:prose-base max-w-none text-[#333333] space-y-4 leading-relaxed">
          {blog.content.split('\n\n').map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-black text-[#14532D] pt-4 mb-2">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-2xl sm:text-3xl font-black text-[#14532D] pt-4 mb-2">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }

            return (
              <p key={idx} className="text-sm sm:text-base text-[#444444] leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Social Share Bar */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
            <Share2 className="w-4 h-4 text-[#F4770B]" />
            <span>Share this Pet Guide:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="bg-[#25D366] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="bg-[#1877F2] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
            >
              Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
            >
              X / Twitter
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : null}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 bg-white border-t border-[#F0EAE1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <PawIcon size={22} color="#F4770B" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
                  Related Pet Articles
                </h3>
              </div>
              <Link
                to="/blog"
                className="text-xs font-bold text-[#14532D] hover:text-[#26752C] flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#F4770B]">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#26752C] transition-colors line-clamp-2 mt-1">
                        <Link to={`/blog/${item.id}`}>{item.title}</Link>
                      </h4>
                    </div>

                    <Link
                      to={`/blog/${item.id}`}
                      className="text-xs font-bold text-[#14532D] hover:text-[#26752C] flex items-center gap-1"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCtaBar />
    </div>
  );
};
