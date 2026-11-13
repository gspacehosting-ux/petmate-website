import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, Heart, Plus, Minus, ShoppingBag, ShieldCheck, Check } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-gray-600 hover:text-black p-2 rounded-full shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="bg-[#FFF9F0] p-6 flex items-center justify-center relative min-h-[260px] md:min-h-[380px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-full object-cover rounded-2xl shadow-sm"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#F4770B] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#EDF4E5] text-[#14532D] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {product.petType}
                </span>
                <span className="text-xs text-[#666666] font-medium">
                  {product.category}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#14532D] leading-snug">
                {product.name}
              </h3>
              {product.subtitle && (
                <p className="text-xs font-semibold text-[#666666] -mt-1">
                  {product.subtitle}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-[#666666]">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-[#171717]">{product.rating}</span>
                <span>({product.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 pt-1">
                <span className="text-2xl font-black text-[#14532D]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                {product.weightOrSize && (
                  <span className="text-xs text-[#666666] font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                    {product.weightOrSize}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed pt-1">
                {product.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#26752C] pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Pet Product • In Stock</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#14532D] text-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-[#171717]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#14532D] text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#26752C] hover:bg-[#14532D] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
