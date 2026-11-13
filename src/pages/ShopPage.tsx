import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Product, ProductCategory, PetType } from '../types';
import { ContactCtaBar } from '../components/home/ContactCtaBar';

export const ShopPage: React.FC = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const initialPet = searchParams.get('pet') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  // Local Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>(
    initialPet ? [initialPet] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params if they change
  useEffect(() => {
    if (initialPet && !selectedPetTypes.includes(initialPet)) {
      setSelectedPetTypes([initialPet]);
    }
    if (initialCategory && !selectedCategories.includes(initialCategory)) {
      setSelectedCategories([initialCategory]);
    }
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialPet, initialCategory, initialSearch]);

  const allPetTypes: PetType[] = ['Dog', 'Cat', 'Bird', 'Small Pet'];
  const allCategories: ProductCategory[] = ['Food', 'Accessories', 'Toys', 'Health Care', 'Grooming'];

  // Toggle filter helpers
  const handlePetTypeChange = (pet: string) => {
    setSelectedPetTypes((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleResetFilters = () => {
    setSelectedPetTypes([]);
    setSelectedCategories([]);
    setMaxPrice(3000);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.petType.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Pet Types
    if (selectedPetTypes.length > 0) {
      result = result.filter((p) =>
        selectedPetTypes.includes(p.petType) || p.petType === 'All Pets'
      );
    }

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price
    result = result.filter((p) => p.price <= maxPrice);

    // In Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'featured':
      default:
        // Featured items first
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedPetTypes, selectedCategories, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Page Banner & Breadcrumb */}
      <section className="bg-[#EDF4E5]/50 border-b border-[#F0EAE1] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#666666] mb-3">
            <Link to="/" className="hover:text-[#26752C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#14532D]">Shop Pet Essentials</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#14532D] tracking-tight">
                Shop Pet Essentials
              </h1>
              <p className="text-sm sm:text-base text-[#666666] max-w-xl mt-2">
                Discover nutritious food, engaging toys, comfortable accessories, and grooming essentials for dogs, cats, birds, and small pets in Bangalore.
              </p>
            </div>

            {/* Quick stats or guarantee badge */}
            <div className="bg-white px-4 py-2 rounded-2xl border border-[#F0EAE1] shadow-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#F4770B]" />
              <div className="text-xs">
                <span className="font-bold text-[#171717] block">100% Genuine Brands</span>
                <span className="text-[#666666]">Verified Bangalore Inventory</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sidebar & Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Controls: Search Bar, Mobile Filter Trigger, Sort By */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border border-[#F0EAE1] shadow-xs">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-[#EDF4E5] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#26752C] hover:text-white transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters ({selectedPetTypes.length + selectedCategories.length})</span>
            </button>

            {/* Showing Count */}
            <span className="text-xs text-[#666666] hidden md:inline-block">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#666666] font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFF9F0] border border-[#F0EAE1] rounded-full px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Filters (Desktop & Collapsible Mobile) */}
          <aside
            className={`lg:col-span-1 bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs space-y-6 ${
              mobileFilterOpen ? 'block mb-6' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-base font-bold text-[#14532D]">
                <SlidersHorizontal className="w-4 h-4 text-[#26752C]" />
                <span>Filter Products</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#F4770B] hover:text-[#e06c09] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Filter 1: Pet Type */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                Pet Type
              </h4>
              <div className="space-y-2">
                {allPetTypes.map((pet) => {
                  const isChecked = selectedPetTypes.includes(pet);
                  return (
                    <label
                      key={pet}
                      className="flex items-center justify-between text-xs text-[#444444] cursor-pointer hover:text-[#14532D] group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePetTypeChange(pet)}
                          className="w-4 h-4 rounded text-[#26752C] focus:ring-[#26752C] border-gray-300 rounded-xs"
                        />
                        <span className={isChecked ? 'font-bold text-[#14532D]' : ''}>
                          {pet === 'Small Pet' ? 'Small Pets (Rabbits/Hamsters)' : `${pet}s`}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Category */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                Category
              </h4>
              <div className="space-y-2">
                {allCategories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center justify-between text-xs text-[#444444] cursor-pointer hover:text-[#14532D] group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryChange(cat)}
                          className="w-4 h-4 rounded text-[#26752C] focus:ring-[#26752C] border-gray-300 rounded-xs"
                        />
                        <span className={isChecked ? 'font-bold text-[#14532D]' : ''}>
                          {cat}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Price Range Slider */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#171717] uppercase tracking-wider">Max Price</span>
                <span className="font-extrabold text-[#14532D] bg-[#EDF4E5] px-2.5 py-0.5 rounded-full">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#26752C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>₹200</span>
                <span>₹3,000+</span>
              </div>
            </div>

            {/* Filter 4: Stock Availability */}
            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-center gap-2.5 text-xs text-[#444444] cursor-pointer hover:text-[#14532D]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#26752C] focus:ring-[#26752C] border-gray-300 rounded-xs"
                />
                <span className="font-semibold">In Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Grid (3 Columns) */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F0EAE1] shadow-xs space-y-4">
                <div className="w-16 h-16 bg-[#FFF9F0] text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#171717]">No pet products found</h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  We could not find any items matching your selected criteria. Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#26752C] hover:bg-[#14532D] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => {
                  const inWishlist = isInWishlist(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-white rounded-3xl p-4 border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                    >
                      {/* Wishlist Button */}
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

                      {/* Image container */}
                      <div className="w-full h-44 rounded-2xl bg-[#FFF9F0] overflow-hidden mb-3 flex items-center justify-center p-2 relative">
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

                      {/* Product Details */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-0.5">
                          <span className="text-[#26752C] font-semibold">{product.petType}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[#171717] line-clamp-1 leading-snug group-hover:text-[#26752C] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#666666] line-clamp-1">
                          {product.subtitle || product.description}
                        </p>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 pt-1 text-[11px] text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold text-[#171717]">{product.rating}</span>
                          <span className="text-gray-400">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Price, Discount & Add to Cart button */}
                      <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
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

                        {/* Green Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          title="Add to Cart"
                          aria-label={`Add ${product.name} to basket`}
                          className="w-9 h-9 rounded-full bg-[#14532D] hover:bg-[#26752C] text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      <ContactCtaBar />
    </div>
  );
};
