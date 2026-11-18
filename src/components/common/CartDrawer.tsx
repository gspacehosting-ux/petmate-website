import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  MapPin,
  Banknote,
  RotateCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi, ApiError } from '../../services/api';
import { AdminOrder } from '../../types';

type DrawerStep = 'cart' | 'checkout' | 'success';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartSubtotal, clearCart } = useShop();
  const { showToast } = useToast();

  const [step, setStep] = useState<DrawerStep>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<AdminOrder | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 49;
  const grandTotal = cartSubtotal + deliveryFee;

  const resetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setAddress('');
    setCity('Bangalore');
    setState('Karnataka');
    setPincode('');
    setPaymentMethod('Cash on Delivery');
    setFormErrors({});
    setPlacedOrder(null);
    setStep('cart');
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (step === 'success') {
      resetForm();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      errors.customerEmail = 'Please enter a valid email address';
    }

    const phoneClean = customerPhone.replace(/\D/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errors.customerPhone = 'Please enter a valid 10-digit mobile number';
    }

    if (!address.trim() || address.trim().length < 5) {
      errors.address = 'Please enter your complete street / house address';
    }

    if (!city.trim()) {
      errors.city = 'City is required';
    }

    if (!state.trim()) {
      errors.state = 'State is required';
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pincode.trim() || !pinRegex.test(pincode.trim())) {
      errors.pincode = 'Please enter a valid 6-digit PIN code (e.g. 560001)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Empty Basket', 'Please add pet essentials to your basket before checkout.', 'error');
      setStep('cart');
      return;
    }

    if (!validateForm()) {
      showToast('Validation Error', 'Please complete all required fields correctly.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullShippingAddress = `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`;
      const orderItems = cart.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

      const newOrder = await ordersApi.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: fullShippingAddress,
        paymentMethod,
        items: orderItems,
      });

      setPlacedOrder(newOrder);
      clearCart();
      setStep('success');
      showToast(
        'Order Confirmed!',
        `Thank you! Order #${newOrder.id.slice(0, 8).toUpperCase()} has been placed.`,
        'success'
      );
    } catch (err) {
      const errorMsg =
        err instanceof ApiError
          ? err.message
          : 'Unable to connect to Railway store service. Please try again.';
      showToast('Order Placement Failed', errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FFF9F0]">
            <div className="flex items-center gap-2">
              {step === 'checkout' ? (
                <button
                  onClick={() => setStep('cart')}
                  className="p-1 rounded-lg text-[#14532D] hover:bg-white/80 transition-colors mr-1 cursor-pointer"
                  title="Back to Basket"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <ShoppingBag className="w-5 h-5 text-[#26752C]" />
              )}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#14532D]">
                  {step === 'cart'
                    ? 'Your Shopping Basket'
                    : step === 'checkout'
                    ? 'Delivery & Checkout'
                    : 'Order Status'}
                </h3>
                {step === 'checkout' && (
                  <span className="text-[11px] text-[#666666] block">
                    Cash on Delivery • Bangalore Doorstep
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {step === 'cart' && (
                <span className="text-xs bg-[#26752C] text-white font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* STEP 1: CART BASKET */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
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
                      className="inline-flex items-center gap-2 bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-xs transition-colors cursor-pointer"
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
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="p-1 hover:bg-gray-200 rounded-l-md transition-colors text-gray-700 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#171717]">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="p-1 hover:bg-gray-200 rounded-r-md transition-colors text-gray-700 cursor-pointer"
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
              </>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <form id="petmate-checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                {/* Order Mini Summary Header */}
                <div className="bg-[#FFF9F0] border border-[#F0EAE1] p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#14532D] font-bold">
                    <ShoppingBag className="w-4 h-4 text-[#26752C]" />
                    <span>{cart.reduce((s, i) => s + i.quantity, 0)} Items in Order</span>
                  </div>
                  <div className="font-extrabold text-[#14532D]">
                    Total: ₹{grandTotal}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#14532D] uppercase tracking-wider">
                    Customer Information
                  </h4>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#171717] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.customerName) {
                          setFormErrors((prev) => ({ ...prev, customerName: '' }));
                        }
                      }}
                      placeholder="e.g. Ramesh Kumar"
                      className={`w-full bg-[#FFFDF9] border rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C] ${
                        formErrors.customerName ? 'border-red-400 bg-red-50/20' : 'border-[#F0EAE1]'
                      }`}
                    />
                    {formErrors.customerName && (
                      <p className="text-[10px] text-red-500 mt-1">{formErrors.customerName}</p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#171717] mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          if (formErrors.customerEmail) {
                            setFormErrors((prev) => ({ ...prev, customerEmail: '' }));
                          }
                        }}
                        placeholder="you@email.com"
                        className={`w-full bg-[#FFFDF9] border rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C] ${
                          formErrors.customerEmail ? 'border-red-400 bg-red-50/20' : 'border-[#F0EAE1]'
                        }`}
                      />
                      {formErrors.customerEmail && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.customerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#171717] mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (formErrors.customerPhone) {
                            setFormErrors((prev) => ({ ...prev, customerPhone: '' }));
                          }
                        }}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className={`w-full bg-[#FFFDF9] border rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C] ${
                          formErrors.customerPhone ? 'border-red-400 bg-red-50/20' : 'border-[#F0EAE1]'
                        }`}
                      />
                      {formErrors.customerPhone && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.customerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#14532D] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#26752C]" />
                    <span>Delivery Address</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#171717] mb-1">
                      Complete Street Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address) {
                          setFormErrors((prev) => ({ ...prev, address: '' }));
                        }
                      }}
                      placeholder="Flat / House No., Building, Street, Landmark"
                      className={`w-full bg-[#FFFDF9] border rounded-xl p-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C] resize-none ${
                        formErrors.address ? 'border-red-400 bg-red-50/20' : 'border-[#F0EAE1]'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[10px] text-red-500 mt-0.5">{formErrors.address}</p>
                    )}
                  </div>

                  {/* City, State, PIN */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#171717] mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#FFFDF9] border border-[#F0EAE1] rounded-xl px-2.5 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#171717] mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-[#FFFDF9] border border-[#F0EAE1] rounded-xl px-2.5 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#171717] mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          if (formErrors.pincode) {
                            setFormErrors((prev) => ({ ...prev, pincode: '' }));
                          }
                        }}
                        placeholder="560001"
                        maxLength={6}
                        className={`w-full bg-[#FFFDF9] border rounded-xl px-2.5 py-2 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C] ${
                          formErrors.pincode ? 'border-red-400 bg-red-50/20' : 'border-[#F0EAE1]'
                        }`}
                      />
                      {formErrors.pincode && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method Option */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#14532D] uppercase tracking-wider">
                    <Banknote className="w-3.5 h-3.5 text-[#26752C]" />
                    <span>Payment Method</span>
                  </div>

                  <div className="bg-[#EDF4E5] border-2 border-[#26752C] rounded-2xl p-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        id="payment-cod"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="mt-1 text-[#26752C] focus:ring-[#26752C]"
                      />
                      <label htmlFor="payment-cod" className="cursor-pointer">
                        <span className="block text-xs font-extrabold text-[#14532D]">
                          Cash on Delivery (Pay at Doorstep)
                        </span>
                        <span className="block text-[11px] text-[#26752C] mt-0.5">
                          Pay via cash or UPI to the delivery executive when received.
                        </span>
                      </label>
                    </div>
                    <span className="bg-[#26752C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER SUCCESS */}
            {step === 'success' && placedOrder && (
              <div className="text-center py-6 px-1 space-y-4">
                <div className="w-16 h-16 bg-[#EDF4E5] text-[#26752C] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-[#14532D]">Order Confirmed!</h4>
                  <p className="text-xs text-[#666666] mt-1">
                    Your order has been recorded in the Petmate system.
                  </p>
                </div>

                {/* Order ID Tag */}
                <div className="bg-[#FFF9F0] border border-[#F0EAE1] p-3.5 rounded-2xl space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Order Reference</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                      {placedOrder.status}
                    </span>
                  </div>
                  <div className="text-sm font-black font-mono text-[#14532D]">
                    #{placedOrder.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100 flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-bold text-[#171717]">{placedOrder.paymentMethod}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-bold text-amber-600 uppercase text-[10px]">{placedOrder.paymentStatus}</span>
                  </div>
                </div>

                {/* Customer Delivery Confirmation */}
                <div className="bg-gray-50 rounded-2xl p-3.5 text-left text-xs space-y-2 border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Deliver To</span>
                  <div className="font-bold text-[#171717]">{placedOrder.customerName}</div>
                  <div className="text-gray-500 text-[11px]">{placedOrder.customerPhone} • {placedOrder.customerEmail}</div>
                  {placedOrder.shippingAddress && (
                    <div className="text-gray-600 text-[11px] leading-relaxed">{placedOrder.shippingAddress}</div>
                  )}
                </div>

                {/* Ordered Items Summary */}
                {placedOrder.items && placedOrder.items.length > 0 && (
                  <div className="bg-[#FFFDF9] border border-[#F0EAE1] rounded-2xl p-3.5 text-left text-xs space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Items Ordered</span>
                    <div className="space-y-1.5 divide-y divide-gray-100">
                      {placedOrder.items.map((it, idx) => (
                        <div key={idx} className="pt-1.5 first:pt-0 flex justify-between items-center text-[11px]">
                          <span className="text-[#171717] truncate max-w-[200px]">
                            {it.quantity}x {it.product?.name || `Product #${it.productId.slice(0, 6)}`}
                          </span>
                          <span className="font-bold text-[#14532D]">₹{it.unitPrice * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-xs text-[#14532D]">
                      <span>Grand Total</span>
                      <span>₹{placedOrder.total}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={resetForm}
                  className="w-full bg-[#26752C] hover:bg-[#14532D] text-white font-bold py-3 px-6 rounded-full text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer for Cart and Checkout */}
          {cart.length > 0 && step !== 'success' && (
            <div className="p-4 sm:p-5 border-t border-[#F0EAE1] bg-[#FFF9F0] space-y-3">
              <div className="space-y-1.5 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171717]">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bangalore Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-[#26752C]">FREE</strong>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#14532D] pt-1 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold py-3 px-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="petmate-checkout-form"
                  disabled={isSubmitting}
                  className="w-full bg-[#14532D] hover:bg-[#26752C] text-white font-bold py-3.5 px-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Placing Order on Railway...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Place Order (Cash on Delivery) • ₹{grandTotal}</span>
                    </>
                  )}
                </button>
              )}

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
