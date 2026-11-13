import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  BookOpen,
  Image as ImageIcon,
  Inbox,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PawIcon } from '../../components/common/PawIcon';

export const AdminDashboardPage: React.FC = () => {
  const { blogs, submissions, galleryImages, updateSubmissionStatus } = useAdmin();

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.status === 'Published').length;
  const totalImages = galleryImages.length;
  const totalSubmissions = submissions.length;
  const newSubmissions = submissions.filter((s) => s.status === 'New').length;

  const recentSubmissions = submissions.slice(0, 4);
  const recentBlogs = blogs.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-[#EDF4E5] text-[#14532D] text-xs font-bold px-3 py-1 rounded-full">
            <PawIcon size={14} color="#26752C" />
            <span>Bangalore Operations Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14532D]">
            Welcome to Petmate Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Here is a live summary of your pet shop inventory, blog stories, gallery assets, and client enquiries.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-1.5 bg-[#EDF4E5] hover:bg-[#26752C] hover:text-white text-[#14532D] font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </Link>
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-1.5 bg-[#14532D] hover:bg-[#26752C] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Blog Post</span>
          </Link>
        </div>
      </div>

      {/* 5 Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Blog Posts */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0EAE1] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Blogs</span>
            <div className="w-8 h-8 rounded-xl bg-[#EDF4E5] text-[#26752C] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#14532D]">{totalBlogs}</div>
          <div className="text-[11px] text-[#666666]">Articles in system</div>
        </div>

        {/* Published Blogs */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0EAE1] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Published</span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-green-700">{publishedBlogs}</div>
          <div className="text-[11px] text-[#666666]">Live on website</div>
        </div>

        {/* Total Images */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0EAE1] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gallery</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF3DC] text-[#F4770B] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F4770B]">{totalImages}</div>
          <div className="text-[11px] text-[#666666]">IndexedDB photos</div>
        </div>

        {/* Total Form Submissions */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0EAE1] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700">{totalSubmissions}</div>
          <div className="text-[11px] text-[#666666]">Forms captured</div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0EAE1] shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{newSubmissions}</div>
          <div className="text-[11px] text-[#666666]">Needs response</div>
        </div>
      </div>

      {/* Main Grid: Recent Submissions & Recent Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Submissions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#26752C]" />
              <h3 className="text-base font-bold text-[#14532D]">Recent Customer Submissions</h3>
            </div>
            <Link
              to="/admin/submissions"
              className="text-xs font-bold text-[#26752C] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#171717]">{sub.customerName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sub.status === 'New'
                          ? 'bg-amber-100 text-amber-800'
                          : sub.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-[#14532D]">{sub.formType}</span> • {sub.phone}
                  </div>
                  <p className="text-xs text-[#666666] line-clamp-1 italic">"{sub.message}"</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-gray-400 block">{sub.submissionDate}</span>
                  {sub.status === 'New' && (
                    <button
                      onClick={() => updateSubmissionStatus(sub.id, 'Contacted')}
                      className="mt-1 text-[11px] text-[#26752C] hover:underline font-bold"
                    >
                      Mark Contacted
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blogs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#F4770B]" />
              <h3 className="text-base font-bold text-[#14532D]">Recent Blog Posts</h3>
            </div>
            <Link
              to="/admin/blogs"
              className="text-xs font-bold text-[#26752C] hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentBlogs.map((b) => (
              <div key={b.id} className="py-3 flex items-center gap-3">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#171717] truncate leading-tight">
                    {b.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                    <span className="font-semibold text-[#F4770B]">{b.category}</span>
                    <span>•</span>
                    <span
                      className={`font-bold ${
                        b.status === 'Published' ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/blog/${b.id}`}
                  target="_blank"
                  className="text-gray-400 hover:text-[#14532D] p-1.5"
                  title="View on site"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Links & Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/gallery"
          className="bg-white rounded-3xl p-5 border border-[#F0EAE1] hover:border-[#26752C] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3DC] text-[#F4770B] flex items-center justify-center mb-3">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#26752C] transition-colors">
            IndexedDB Image Gallery
          </h4>
          <p className="text-xs text-[#666666] mt-1">
            Upload and categorize high-res photos.
          </p>
        </Link>

        <Link
          to="/admin/blogs"
          className="bg-white rounded-3xl p-5 border border-[#F0EAE1] hover:border-[#26752C] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#EDF4E5] text-[#26752C] flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#26752C] transition-colors">
            Write &amp; Edit Articles
          </h4>
          <p className="text-xs text-[#666666] mt-1">
            Create dog &amp; cat wellness articles.
          </p>
        </Link>

        <Link
          to="/admin/submissions"
          className="bg-white rounded-3xl p-5 border border-[#F0EAE1] hover:border-[#26752C] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Inbox className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#26752C] transition-colors">
            Service &amp; Contact Enquiries
          </h4>
          <p className="text-xs text-[#666666] mt-1">
            Follow up with Bangalore pet owners.
          </p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white rounded-3xl p-5 border border-[#F0EAE1] hover:border-[#26752C] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#26752C] transition-colors">
            Website Info &amp; Branding
          </h4>
          <p className="text-xs text-[#666666] mt-1">
            Update phone, hours, and Bangalore location.
          </p>
        </Link>
      </div>
    </div>
  );
};
