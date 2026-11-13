import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  X,
  ExternalLink,
  Calendar,
  User,
  Sparkles,
} from 'lucide-react';
import { BlogPost, BlogCategory, BlogStatus } from '../../types';

export const AdminBlogsPage: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdmin();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<BlogCategory>('Dog Care');
  const [formStatus, setFormStatus] = useState<BlogStatus>('Published');
  const [formAuthor, setFormAuthor] = useState('Petmate Team');
  const [formDate, setFormDate] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formReadTime, setFormReadTime] = useState('4 min read');

  // Preview Modal
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);

  const categories: BlogCategory[] = [
    'Dog Care',
    'Cat Care',
    'Pet Nutrition',
    'Pet Grooming',
    'Pet Training',
    'Pet Lifestyle',
  ];

  // Open Create Mode
  const handleOpenCreate = () => {
    setEditingBlogId(null);
    setFormTitle('');
    setFormCategory('Dog Care');
    setFormStatus('Published');
    setFormAuthor('Petmate Bangalore Care Team');
    const now = new Date();
    setFormDate(
      now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    );
    setFormImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80');
    setFormShortDesc('');
    setFormContent('');
    setFormReadTime('4 min read');
    setIsEditorOpen(true);
  };

  // Open Edit Mode
  const handleOpenEdit = (b: BlogPost) => {
    setEditingBlogId(b.id);
    setFormTitle(b.title);
    setFormCategory(b.category);
    setFormStatus(b.status);
    setFormAuthor(b.author);
    setFormDate(b.publishedDate);
    setFormImage(b.image);
    setFormShortDesc(b.shortDescription);
    setFormContent(b.content);
    setFormReadTime(b.readTime || '4 min read');
    setIsEditorOpen(true);
  };

  // Save Blog
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formShortDesc.trim() || !formContent.trim()) {
      showToast('Missing Fields', 'Please complete title, summary, and article content.', 'error');
      return;
    }

    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingBlogId) {
      updateBlog({
        id: editingBlogId,
        title: formTitle.trim(),
        slug,
        category: formCategory,
        status: formStatus,
        author: formAuthor.trim(),
        publishedDate: formDate,
        image: formImage.trim() || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        shortDescription: formShortDesc.trim(),
        content: formContent.trim(),
        readTime: formReadTime,
      });
    } else {
      addBlog({
        title: formTitle.trim(),
        slug,
        category: formCategory,
        status: formStatus,
        author: formAuthor.trim(),
        publishedDate: formDate,
        image: formImage.trim() || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        shortDescription: formShortDesc.trim(),
        content: formContent.trim(),
        readTime: formReadTime,
      });
    }

    setIsEditorOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete blog post "${title}"?`)) {
      deleteBlog(id);
    }
  };

  // Filtered Blogs List
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchQuery =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = filterCategory === 'All' || b.category === filterCategory;
      const matchStatus = filterStatus === 'All' || b.status === filterStatus;

      return matchQuery && matchCategory && matchStatus;
    });
  }, [blogs, searchQuery, filterCategory, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14532D]">
            Blog &amp; Pet Stories Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Write, publish, edit, and organize pet wellness articles for Bangalore pet parents.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#26752C] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Blog Post</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#F0EAE1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#171717] focus:ring-2 focus:ring-[#26752C]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#171717] focus:ring-2 focus:ring-[#26752C]"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <span className="text-xs text-gray-500">
            Total: <strong>{filteredBlogs.length}</strong> posts
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or topic..."
            className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-3xl border border-[#F0EAE1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#F0EAE1] text-gray-500 font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Article</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBlogs.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0 bg-[#FFF9F0]"
                      />
                      <div className="max-w-xs sm:max-w-md">
                        <div className="font-bold text-[#171717] text-sm truncate" title={b.title}>
                          {b.title}
                        </div>
                        <div className="text-gray-400 text-[11px] truncate mt-0.5">
                          {b.shortDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-[#14532D] bg-[#EDF4E5] px-2.5 py-1 rounded-full">
                      {b.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{b.author}</td>
                  <td className="p-4 text-gray-500">{b.publishedDate}</td>
                  <td className="p-4">
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full ${
                        b.status === 'Published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewBlog(b)}
                        className="p-1.5 text-gray-400 hover:text-[#14532D] rounded-lg hover:bg-gray-100 transition-colors"
                        title="Preview Article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Blog Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsEditorOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 border border-[#F0EAE1] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F0]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#26752C]" />
                <h3 className="text-base font-bold text-[#14532D]">
                  {editingBlogId ? 'Edit Blog Article' : 'Create New Blog Article'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBlog} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Essential Summer Care for Bangalore Puppies"
                  className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#171717] focus:ring-2 focus:ring-[#26752C]"
                />
              </div>

              {/* Category, Status, Author Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as BlogCategory)}
                    className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-2 text-xs font-medium text-[#171717]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as BlogStatus)}
                    className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-2 text-xs font-medium text-[#171717]"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Save as Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-2 text-xs font-medium text-[#171717]"
                  />
                </div>
              </div>

              {/* Publication Date & Featured Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Published Date</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Nov 13, 2026"
                    className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-2 text-xs font-medium text-[#171717]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#171717] mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-2 text-xs font-medium text-[#171717]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Short Summary / Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="A concise 2-sentence overview displayed on blog cards..."
                  className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2 text-xs text-[#171717]"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Article Full Content (Markdown / Sections) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write full article here. Use ### for subheadings..."
                  className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-3 text-xs text-[#171717] font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#14532D] hover:bg-[#26752C] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  {formStatus === 'Published' ? 'Publish Article' : 'Save as Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setPreviewBlog(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-[#F0EAE1] max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F0]">
              <span className="text-xs font-bold text-[#14532D]">Blog Article Preview</span>
              <button
                onClick={() => setPreviewBlog(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <img
                src={previewBlog.image}
                alt={previewBlog.title}
                className="w-full h-56 object-cover rounded-2xl"
              />
              <span className="bg-[#F4770B] text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
                {previewBlog.category}
              </span>
              <h2 className="text-2xl font-black text-[#14532D]">{previewBlog.title}</h2>
              <div className="text-xs text-gray-400">
                By {previewBlog.author} • {previewBlog.publishedDate}
              </div>
              <p className="text-sm font-semibold text-[#14532D] bg-[#EDF4E5] p-3 rounded-xl">
                {previewBlog.shortDescription}
              </p>
              <div className="text-xs text-gray-700 space-y-2 whitespace-pre-line leading-relaxed">
                {previewBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
