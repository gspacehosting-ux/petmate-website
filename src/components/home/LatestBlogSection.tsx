import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { PawIcon } from '../common/PawIcon';
import { useAdmin } from '../../context/AdminContext';

export const LatestBlogSection: React.FC = () => {
  const { blogs } = useAdmin();

  // Pick published blogs
  const publishedBlogs = blogs.filter((b) => b.status === 'Published').slice(0, 3);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <PawIcon size={24} color="#F4770B" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Latest from Our Blog
            </h2>
          </div>

          <Link
            to="/blog"
            className="text-sm font-bold text-[#14532D] hover:text-[#26752C] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Blogs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Blog Image with Category Badge */}
              <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-gray-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-3 left-3 bg-[#F4770B] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {blog.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#171717] group-hover:text-[#26752C] transition-colors leading-snug line-clamp-2">
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h3>
                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {blog.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
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

      </div>
    </section>
  );
};
