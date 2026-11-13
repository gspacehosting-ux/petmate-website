import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';
import { Search, X, ShoppingBag, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, addToCart, setQuickViewProduct } = useShop();
  const { blogs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.subtitle?.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.petType.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term) ||
        b.shortDescription.toLowerCase().includes(term)
    );
  }, [blogs, searchTerm]);

  if (!isSearchOpen) return null;

  const handleSelectBlog = (blogId: string) => {
    setIsSearchOpen(false);
    navigate(`/blog/${blogId}`);
  };

  const handleSelectProduct = (prod: any) => {
    setIsSearchOpen(false);
    setQuickViewProduct(prod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-[#F0EAE1] animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#F0EAE1] flex items-center gap-3 bg-[#FFF9F0]">
          <Search className="w-5 h-5 text-[#26752C] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dog food, toys, grooming, blogs..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-[#171717] focus:outline-hidden font-medium placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!searchTerm.trim() ? (
            <div className="text-center py-8 text-xs text-gray-400 space-y-2">
              <p>Type to search products, pet essentials, or pet care guides.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                <span className="text-gray-500 font-medium">Trending:</span>
                {['Dog Food', 'Cat Harness', 'Bird Seed', 'Grooming', 'Rope Toy'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="bg-[#EDF4E5] hover:bg-[#26752C] hover:text-white text-[#14532D] px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Product Results */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#26752C]" />
                    Products ({filteredProducts.length})
                  </h4>
                  {filteredProducts.length > 0 && (
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                      }}
                      className="text-xs font-semibold text-[#26752C] hover:underline"
                    >
                      View in Shop
                    </button>
                  )}
                </div>

                {filteredProducts.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3">No matching products found.</p>
                ) : (
                  <div className="divide-y divide-gray-100 mt-2">
                    {filteredProducts.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 px-2 rounded-xl cursor-pointer transition-colors"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 bg-[#FFF9F0]"
                          />
                          <div>
                            <div className="text-sm font-bold text-[#171717]">{product.name}</div>
                            <div className="text-xs text-gray-500">
                              {product.subtitle || product.category} • <span className="font-bold text-[#14532D]">₹{product.price}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-[#26752C] hover:bg-[#14532D] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Blog Results */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
                  <BookOpen className="w-3.5 h-3.5 text-[#F4770B]" />
                  Blog & Pet Guides ({filteredBlogs.length})
                </h4>

                {filteredBlogs.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3">No matching articles found.</p>
                ) : (
                  <div className="divide-y divide-gray-100 mt-2">
                    {filteredBlogs.slice(0, 3).map((blog) => (
                      <div
                        key={blog.id}
                        onClick={() => handleSelectBlog(blog.id)}
                        className="py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 px-2 rounded-xl cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-sm font-bold text-[#171717] hover:text-[#26752C]">
                            {blog.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            <span className="text-[#F4770B] font-semibold">{blog.category}</span> • {blog.publishedDate}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
