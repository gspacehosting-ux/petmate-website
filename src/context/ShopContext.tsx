import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { initialProducts } from '../data/initialProducts';
import { useToast } from './ToastContext';
import { productsApi } from '../services/api';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  quickViewProduct: Product | null;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isLoadingProducts?: boolean;
  refreshProducts?: () => Promise<void>;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  setQuickViewProduct: (product: Product | null) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('petmate_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch products from Railway backend on initial mount
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const fetchedProducts = await productsApi.getAll();
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        try {
          localStorage.setItem('petmate_products', JSON.stringify(fetchedProducts));
        } catch (storageErr) {
          console.warn('[ShopContext] Failed to cache products in localStorage:', storageErr);
        }
      }
    } catch (err) {
      console.warn('[ShopContext] Backend products fetch failed; using cached/fallback catalog:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('petmate_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('petmate_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('petmate_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('petmate_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast('Added to Cart', `${product.name} (${quantity}) added to your basket!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      showToast('Removed from Cart', `${item.product.name} removed.`, 'info');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast('Wishlist', `${product.name} removed from your wishlist.`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast('Wishlist', `${product.name} saved to your wishlist!`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        quickViewProduct,
        isCartOpen,
        isSearchOpen,
        isLoadingProducts,
        refreshProducts,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setQuickViewProduct,
        setIsCartOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
