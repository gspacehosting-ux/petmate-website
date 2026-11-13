import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  BookOpen,
  ChevronRight,
  Sparkles,
  Send,
  Clock,
} from 'lucide-react';
import { PawIcon } from '../components/common/PawIcon';
import { BlogCategory, BlogPost } from '../types';
import { ContactCtaBar } from '../components/home/ContactCtaBar';

export const BlogPage: React.FC = () => {
  const { blogs, addSubmission } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Newsletter local state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories: string[] = [
    'All',
    'Dog Care',
    'Cat Care',
    'Pet Nutrition',
    'Pet Grooming',
    'Pet Training',
    'Pet Lifestyle',
  ];

  // Filter only Published blogs for public view
  const publishedBlogs = useMemo(() => {
    return blogs.filter((b) => b.status === 'Published');
  }, [blogs]);

  // Featured blog (first published or specific highlight)
  const featuredBlog = publishedBlogs[0] || null;

  // Filter remaining blogs
  const filteredBlogs = useMemo(() => {
    let list = publishedBlogs;

    if (selectedCategory !== 'All') {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.shortDescription.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [publishedBlogs, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;

    addSubmission({
      formType: 'Newsletter',
      customerName: 'Blog Reader',
      email: newsletterEmail.trim(),
      phone: 'Not provided',
      message: 'Subscribed to Petmate Blog Newsletter for pet care tips.',
    });

    setNewsletterEmail('');
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#EDF4E5]/50 border-b border-[#F0EAE1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <nav className="flex items-center justify-center gap-2 text-xs text-[#666666] mb-4">
            <Link to="/" className="hover:text-[#26752C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#14532D]">Blog</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-[#14532D] shadow-xs border border-[#F0EAE1] mb-3">
            <PawIcon size={16} color="#F4770B" />
            <span>Expert Guidance for Pet Parents</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#14532D] tracking-tight">
            Pet Care Tips &amp; Stories
          </h1>
          <p className="text-sm sm:text-base text-[#666666] mt-3">
            Read practical tips on animal behavior, nutrition, seasonal coat care, and heartwarming pet stories from our Bangalore care team.
          </p>
        </div>
      </section>

      {/* Featured Blog Section */}
      {featuredBlog && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F0EAE1] shadow-md grid grid-cols-1 lg:grid-cols-12 items-center">
              
              <div className="lg:col-span-7 h-72 sm:h-96 overflow-hidden bg-gray-100">
                <img
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F4770B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    Featured Article
                  </span>
                  <span className="text-xs font-semibold text-[#26752C] bg-[#EDF4E5] px-2.5 py-1 rounded-full">
                    {featuredBlog.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#171717] hover:text-[#26752C] transition-colors leading-tight">
                  <Link to={`/blog/${featuredBlog.id}`}>{featuredBlog.title}</Link>
                </h2>

                <p className="text-sm text-[#666666] leading-relaxed line-clamp-3">
                  {featuredBlog.shortDescription}
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F4770B]" />
                    <span>{featuredBlog.publishedDate}</span>
                  </div>
                  {featuredBlog.readTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#26752C]" />
                      <span>{featuredBlog.readTime}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    to={`/blog/${featuredBlog.id}`}
                    className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#26752C] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-xs transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Categories & Search Controls */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#F0EAE1] shadow-xs">
            
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'bg-[#FFF9F0] text-[#666666] hover:bg-[#EDF4E5] hover:text-[#14532D] border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Blog search input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search blog topics..."
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-full pl-10 pr-4 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Latest Articles Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedBlogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F0EAE1] shadow-xs space-y-3">
              <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-[#171717]">No articles found</h3>
              <p className="text-xs text-[#666666]">
                Try choosing another topic category or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="bg-[#26752C] text-white text-xs font-bold px-4 py-2 rounded-full mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Blog Image */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#F4770B] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {blog.category}
                    </span>
                  </div>

                  {/* Blog Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#171717] group-hover:text-[#26752C] transition-colors leading-snug line-clamp-2">
                        <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                      </h3>
                      <p className="text-xs text-[#666666] line-clamp-3 leading-relaxed">
                        {blog.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#F4770B]" />
                        <span>{blog.publishedDate}</span>
                      </div>

                      <Link
                        to={`/blog/${blog.id}`}
                        className="font-bold text-[#F4770B] hover:text-[#e06c09] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'bg-white text-[#171717] hover:bg-[#EDF4E5] border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription Banner */}
      <section className="py-12 bg-white border-t border-[#F0EAE1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#FFF9F0] rounded-3xl p-8 sm:p-12 border border-[#F0EAE1] shadow-xs">
            <PawIcon size={32} color="#F4770B" className="mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14532D]">
              Get Weekly Pet Wellness Tips in Your Inbox
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto mt-2">
              Join 3,000+ Bangalore pet parents receiving our vet-reviewed guides and special in-store promotions.
            </p>

            <form onSubmit={handleNewsletter} className="max-w-md mx-auto mt-6 flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-[#F0EAE1] rounded-full px-4 py-3 text-xs sm:text-sm text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
              />
              <button
                type="submit"
                className="bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs font-semibold text-[#26752C] mt-3">
                ✓ Thank you for subscribing to Petmate Blog!
              </p>
            )}
          </div>
        </div>
      </section>

      <ContactCtaBar />
    </div>
  );
};
