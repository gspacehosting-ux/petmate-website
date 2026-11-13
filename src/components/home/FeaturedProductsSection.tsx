import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { ProductCategory, Product } from '../../types';

export const FeaturedProductsSection: React.FC = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Food', 'Accessories', 'Toys', 'Health Care'];

  // Ensure the 5 master reference products are prioritized
  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory !== 'All') {
      list = products.filter((p) => p.category === activeCategory);
    } else {
      // Prioritize the 5 featured products from master reference
      list = products.slice(0, 5);
    }
    return list;
  }, [products, activeCategory]);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Featured Products
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'bg-white text-[#666666] hover:bg-[#EDF4E5] hover:text-[#14532D] border border-gray-100'
                  }`}
                >
                  {cat === 'All' ? 'All Products' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {filteredProducts.map((product: Product) => {
            const inWishlist = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                onClick={() => setQuickViewProduct(product)}
                className="bg-white rounded-3xl p-4 border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
              >
                {/* Wishlist Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  aria-label="Wishlist"
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-xs transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      inWishlist ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div className="w-full h-36 sm:h-44 rounded-2xl bg-[#FFF9F0] overflow-hidden mb-3 flex items-center justify-center p-2 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="bg-white text-[#14532D] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Quick View
                    </span>
                  </div>
                </div>

                {/* Title & Info */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-bold text-[#171717] line-clamp-1 leading-snug group-hover:text-[#26752C] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#666666] line-clamp-1">
                    {product.subtitle || product.category}
                  </p>
                </div>

                {/* Price, Discount & Add to Cart button */}
                <div className="pt-3 mt-1 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base font-extrabold text-[#F4770B]">
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.discount > 0 && (
                      <span className="text-[10px] font-extrabold text-[#F4770B] bg-[#FFF3DC] px-1.5 py-0.5 rounded-md inline-block w-fit mt-0.5">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Dark green circular Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    title="Add to Cart"
                    aria-label={`Add ${product.name} to cart`}
                    className="w-9 h-9 rounded-full bg-[#14532D] hover:bg-[#26752C] text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
