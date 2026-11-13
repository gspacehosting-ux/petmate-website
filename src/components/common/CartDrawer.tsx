import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartSubtotal, clearCart } = useShop();
  const { showToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 49;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      clearCart();
      showToast('Order Placed!', 'Thank you! Your Petmate Bangalore order has been received.', 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setOrderPlaced(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FFF9F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#26752C]" />
              <h3 className="text-lg font-bold text-[#14532D]">Your Shopping Basket</h3>
              <span className="text-xs bg-[#26752C] text-white font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderPlaced(false);
              }}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {orderPlaced ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 bg-[#EDF4E5] text-[#26752C] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-xl font-extrabold text-[#14532D]">Order Confirmed!</h4>
                <p className="text-sm text-[#666666]">
                  Our Bangalore team is preparing your pet essentials. We will contact you for fast doorstep delivery.
                </p>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    setIsCartOpen(false);
                  }}
                  className="bg-[#26752C] hover:bg-[#14532D] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#FFF9F0] text-[#666666] rounded-full flex items-center justify-center mx-auto border border-[#F0EAE1]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="text-base font-bold text-[#171717]">Your basket is empty</h4>
                <p className="text-xs text-[#666666] max-w-xs mx-auto">
                  Browse our curated healthy pet foods, interactive toys, and grooming essentials.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-xs transition-colors"
                >
                  <Link to="/shop">Shop Pet Essentials</Link>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery progress banner */}
                <div className="bg-[#EDF4E5] p-3 rounded-xl text-xs text-[#14532D]">
                  {cartSubtotal >= 499 ? (
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#26752C]" />
                      You qualify for <strong>FREE Fast Bangalore Delivery!</strong>
                    </span>
                  ) : (
                    <span>
                      Add <strong>₹{499 - cartSubtotal}</strong> more to get Free Delivery across Bangalore!
                    </span>
                  )}
                </div>

                {/* Cart items */}
                <div className="space-y-3 divide-y divide-gray-100">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="pt-3 flex gap-3 items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0 bg-[#FFF9F0]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#171717] truncate leading-tight">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#666666] truncate mt-0.5">
                          {product.subtitle || product.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-sm font-extrabold text-[#14532D]">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded-l-md transition-colors text-gray-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#171717]">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded-r-md transition-colors text-gray-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer totals */}
          {cart.length > 0 && !orderPlaced && (
            <div className="p-4 sm:p-5 border-t border-[#F0EAE1] bg-[#FFF9F0] space-y-3">
              <div className="space-y-1.5 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171717]">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bangalore Delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-[#26752C]">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#14532D] pt-1 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold py-3 px-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isCheckingOut ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-400">
                Safe &amp; contactless payment available on delivery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
