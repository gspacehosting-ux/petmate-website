import React, { useState, useMemo, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Eye,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  HardDrive,
  Maximize2,
  RotateCw,
} from 'lucide-react';
import { GalleryCategory, GalleryImage } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const { galleryImages, addGalleryImage, uploadGalleryFile, deleteGalleryImage, isLoadingGallery, refreshGallery } = useAdmin();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUploadCategory, setActiveUploadCategory] = useState<GalleryCategory>('General');
  const [viewingImage, setViewingImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: GalleryCategory[] = [
    'Homepage',
    'Products',
    'Dogs',
    'Cats',
    'Birds',
    'Small Pets',
    'Services',
    'Blog',
    'General',
  ];

  // Filtered images
  const filteredImages = useMemo(() => {
    let list = galleryImages;

    if (selectedCategory !== 'All') {
      list = list.filter((img) => img.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((img) => img.filename.toLowerCase().includes(q));
    }

    return list;
  }, [galleryImages, selectedCategory, searchQuery]);

  // Handle Multi-file Upload to Railway Backend
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Format validation
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        showToast('Invalid Format', `${file.name} is not a supported image format.`, 'error');
        continue;
      }

      // Size validation (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File Too Large', `${file.name} exceeds 5 MB limit.`, 'error');
        continue;
      }

      try {
        // Read dimensions first for metadata
        const dimensions = await new Promise<string>((resolve) => {
          const img = new Image();
          const objUrl = URL.createObjectURL(file);
          img.onload = () => {
            resolve(`${img.naturalWidth} x ${img.naturalHeight}`);
            URL.revokeObjectURL(objUrl);
          };
          img.onerror = () => {
            resolve('Auto');
            URL.revokeObjectURL(objUrl);
          };
          img.src = objUrl;
        });

        if (uploadGalleryFile) {
          await uploadGalleryFile(file, activeUploadCategory, dimensions);
        } else {
          // Fallback to base64 addGalleryImage
          await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const dataUrl = e.target?.result as string;
              const fileSizeKB = (file.size / 1024).toFixed(1) + ' KB';
              const now = new Date();
              const uploadDate = now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              await addGalleryImage({
                id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                filename: file.name,
                category: activeUploadCategory,
                dataUrl,
                fileSize: fileSizeKB,
                dimensions,
                uploadDate,
                mimeType: file.type,
              });
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
        uploadedCount++;
      } catch (err) {
        console.error('File upload error:', err);
        showToast('Upload Failed', `Could not upload ${file.name}.`, 'error');
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from the gallery?`)) {
      await deleteGalleryImage(id);
      if (viewingImage?.id === id) {
        setViewingImage(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14532D]">
            Image Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Upload, preview, organize, and store high-resolution images securely on Railway MySQL and storage.
          </p>
        </div>

        {/* Upload & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => refreshGallery?.()}
            disabled={isLoadingGallery}
            className="bg-[#EDF4E5] hover:bg-[#dbe7cf] text-[#14532D] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Gallery from Railway"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingGallery ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <select
            value={activeUploadCategory}
            onChange={(e) => setActiveUploadCategory(e.target.value as GalleryCategory)}
            className="bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:ring-2 focus:ring-[#26752C]"
            title="Category for new uploads"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Save to: {c}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFilesUpload(e.target.files)}
            className="hidden"
            id="multi-image-upload-input"
          />
          <label
            htmlFor="multi-image-upload-input"
            className="inline-flex items-center gap-2 bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading to Railway...' : 'Upload Images'}</span>
          </label>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesUpload(e.dataTransfer.files);
        }}
        className="bg-[#FFFDF9] rounded-3xl p-6 border-2 border-dashed border-[#26752C]/30 text-center hover:border-[#26752C] transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 bg-[#EDF4E5] text-[#26752C] rounded-2xl flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">
            Drag &amp; Drop Pet Photos Here, or Click to Browse
          </h3>
          <p className="text-[11px] text-[#666666]">
            Supports JPG, PNG, WEBP, GIF, SVG up to 5MB. Stored securely on Railway MySQL and media storage.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#F0EAE1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#14532D] text-white shadow-xs'
                : 'bg-[#FFF9F0] text-[#666666] hover:bg-[#EDF4E5]'
            }`}
          >
            All Images ({galleryImages.length})
          </button>
          {categories.map((cat) => {
            const count = galleryImages.filter((i) => i.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'bg-[#FFF9F0] text-[#666666] hover:bg-[#EDF4E5]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename..."
            className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
          />
        </div>
      </div>

      {/* Images Grid */}
      {isLoadingGallery ? (
        <div className="text-center py-16 text-xs text-gray-500">
          Loading gallery assets from IndexedDB...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#F0EAE1] space-y-3">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-base font-bold text-[#171717]">No images found in this filter</h4>
          <p className="text-xs text-[#666666]">
            Upload new photos or select another category above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative h-36 bg-[#FFF9F0] overflow-hidden">
                <img
                  src={img.dataUrl}
                  alt={img.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {img.category}
                </span>

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setViewingImage(img)}
                    className="p-2 bg-white text-[#14532D] hover:bg-[#EDF4E5] rounded-full shadow-md transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, img.filename)}
                    className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-full shadow-md transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3 space-y-1">
                <h4 className="text-xs font-bold text-[#171717] truncate" title={img.filename}>
                  {img.filename}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>{img.fileSize}</span>
                  <span>{img.uploadDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Details Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setViewingImage(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-[#F0EAE1] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F0]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#26752C]" />
                <h3 className="text-sm font-bold text-[#14532D] truncate max-w-md">
                  {viewingImage.filename}
                </h3>
              </div>
              <button
                onClick={() => setViewingImage(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image Preview */}
              <div className="max-h-80 w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                <img
                  src={viewingImage.dataUrl}
                  alt={viewingImage.filename}
                  className="max-h-80 max-w-full object-contain"
                />
              </div>

              {/* Metadata Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFF9F0] p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-extrabold text-[#14532D]">{viewingImage.category}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Dimensions</span>
                  <span className="font-bold text-[#171717]">{viewingImage.dimensions || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">File Size</span>
                  <span className="font-bold text-[#171717]">{viewingImage.fileSize}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Upload Date</span>
                  <span className="font-bold text-[#171717]">{viewingImage.uploadDate}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleDelete(viewingImage.id, viewingImage.filename)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete from IndexedDB</span>
                </button>
                <button
                  onClick={() => setViewingImage(null)}
                  className="bg-[#14532D] text-white text-xs font-bold px-6 py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
