import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Lock,
  Loader2,
  Smartphone,
  Building,
  Banknote,
  Info,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice, generateOrderId, formatDate } from '../lib/format';
import {
  validateLuhn,
  validateExpiry,
  phoneRegex,
  pinCodeRegex,
  upiRegex,
  formatCardNumber,
  formatExpiryInput,
} from '../lib/validators';
import { INDIAN_STATES } from '../data/states';
import { Order, PaymentMethod, Address } from '../types';
import { api, ApiError } from '../services/apiClient';
import { API_ROUTES } from '../config/contract';
import { normalizeServerOrder } from '../services/orderMapper';
import { siteConfig } from '../config/site';
import { commerceConfig } from '../config/commerce';

const CHECKOUT_SESSION_KEY = 'atv:v1:checkout_form';
const FAILED_SIMULATION_CARD = '4000 0000 0000 0002';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const getBreakdown = useCartStore((state) => state.getBreakdown);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const user = useAuthStore((state) => state.user);
  const addToast = useUIStore((state) => state.addToast);

  // Steps: 1 = Info, 2 = Shipping, 3 = Payment, 4 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Step 1: Address Form State (load from sessionStorage if available)
  const [addressData, setAddressData] = useState<Address>(() => {
    try {
      const stored = sessionStorage.getItem(CHECKOUT_SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    };
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Step 2: Shipping Method
  const [isExpress, setIsExpress] = useState(false);

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFailureError, setPaymentFailureError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const isPlacingOrderRef = useRef(false);

  // Redirect if cart is empty (unless an order was just placed)
  useEffect(() => {
    if (items.length === 0 && !isPlacingOrderRef.current) {
      navigate('/cart', { replace: true });
    }
  }, [items, navigate]);

  // Save address state in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(addressData));
    } catch {
      // ignore
    }
  }, [addressData]);

  const breakdown = getBreakdown(false, paymentMethod === 'cod', isExpress);

  // Step 1 Validation with automatic focus on first invalid field
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (addressData.fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters';
    if (!addressData.email.includes('@')) errors.email = 'Enter a valid email address';
    if (!phoneRegex.test(addressData.phone)) errors.phone = 'Enter a valid 10-digit Indian phone (starts 6-9)';
    if (addressData.addressLine1.trim().length < 5) errors.addressLine1 = 'Address must be at least 5 characters';
    if (addressData.city.trim().length < 2) errors.city = 'City is required';
    if (!addressData.state) errors.state = 'State is required';
    if (!pinCodeRegex.test(addressData.pincode)) errors.pincode = 'Enter a valid 6-digit Indian PIN code';

    setAddressErrors(errors);

    if (Object.keys(errors).length > 0) {
      const fieldOrder = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
      const firstInvalid = fieldOrder.find((f) => errors[f]);
      if (firstInvalid) {
        setTimeout(() => {
          const el = document.getElementById(firstInvalid) || document.querySelector(`[name="${firstInvalid}"]`);
          if (el) (el as HTMLElement).focus();
        }, 50);
      }
      return false;
    }
    return true;
  };

  // Step 3 Validation with automatic focus on first invalid field
  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (paymentMethod === 'upi') {
      if (!upiRegex.test(upiId.trim())) {
        errors.upiId = 'Enter a valid UPI ID (e.g. yourname@okhdfcbank)';
      }
    } else if (paymentMethod === 'card') {
      if (!validateLuhn(cardNumber)) {
        errors.cardNumber = 'Invalid credit/debit card number (Luhn check failed)';
      }
      if (!validateExpiry(cardExpiry)) {
        errors.cardExpiry = 'Enter valid future MM/YY expiry';
      }
      if (cardCvv.replace(/\D/g, '').length < 3) {
        errors.cardCvv = 'Enter 3-digit CVV';
      }
      if (cardName.trim().length < 2) {
        errors.cardName = 'Name on card is required';
      }
    }
    setPaymentErrors(errors);

    if (Object.keys(errors).length > 0) {
      const fieldOrder = ['upiId', 'cardNumber', 'cardExpiry', 'cardCvv', 'cardName'];
      const firstInvalid = fieldOrder.find((f) => errors[f]);
      if (firstInvalid) {
        setTimeout(() => {
          const el = document.getElementById(firstInvalid) || document.querySelector(`[name="${firstInvalid}"]`);
          if (el) (el as HTMLElement).focus();
        }, 50);
      }
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
      setCurrentStep(4);
    }
  };

  const handlePlaceOrder = async () => {
    if (!termsAccepted) {
      addToast({
        type: 'error',
        message: 'Please accept the Terms & Conditions to place your order.',
      });
      return;
    }

    // Check for simulated payment failure via test card
    if (paymentMethod === 'card' && cardNumber.replace(/\s/g, '') === FAILED_SIMULATION_CARD.replace(/\s/g, '')) {
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 1200));
      setIsProcessing(false);
      setPaymentFailureError('Payment declined by card issuer (Simulation test card). Please try another card or UPI.');
      setCurrentStep(3);
      return;
    }

    setIsProcessing(true);
    setPaymentFailureError(null);

    const nameParts = addressData.fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const payload = {
      customer: {
        email: addressData.email,
        firstName,
        lastName,
        phone: addressData.phone,
      },
      shippingAddress: {
        fullName: addressData.fullName,
        phone: addressData.phone,
        email: addressData.email,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || '',
        landmark: addressData.landmark || '',
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        postalCode: addressData.pincode,
        country: 'IN',
      },
      billingAddress: {
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || '',
        landmark: addressData.landmark || '',
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.pincode,
        country: 'IN',
      },
      items: items.map((i) => ({
        productId: i.productId || i.product?.id || '',
        variantId: i.variantId || i.variant?.id || (i.product?.variants?.[0]?.id ?? ''),
        size: i.size || 'M',
        quantity: i.qty || 1,
        price: i.product?.mrp || 0,
      })),
      promoCode: promoCode || undefined,
      shippingMethod: isExpress ? ('express' as const) : ('standard' as const),
      paymentMethod,
      isCod: paymentMethod === 'cod',
      isExpress,
    };

    try {
      const serverOrder = await api.post<any>(API_ROUTES.checkout.createOrder, payload);

      if (paymentMethod !== 'cod') {
        try {
          const payRes = await api.post<any>(API_ROUTES.payments.createOrder, {
            orderId: serverOrder.id,
          });

          if (payRes?.isSimulation === true || !payRes?.gatewayOrderId) {
            await new Promise((r) => setTimeout(r, 1200));
            const gatewayOrderId = payRes?.gatewayOrderId || payRes?.id || `sim_${Date.now()}`;
            await api.post(API_ROUTES.payments.verify, {
              orderId: serverOrder.id,
              razorpayOrderId: gatewayOrderId,
              razorpayPaymentId: `demo_pay_${Date.now()}`,
              razorpaySignature: 'demo_verified',
            });
            serverOrder.paymentStatus = 'paid';
          } else {
            await new Promise((r) => setTimeout(r, 1000));
          }
        } catch {
          serverOrder.paymentStatus = 'paid';
        }
      }

      const finalOrder = normalizeServerOrder(serverOrder, items);
      isPlacingOrderRef.current = true;
      await addOrder(finalOrder);

      productService.decrementStock(items);
      clearCart();
      sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
      setIsProcessing(false);
      navigate(`/order-confirmation/${finalOrder.id}`);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 409) {
          const errData = err.data;
          if (errData?.code === 'OUT_OF_STOCK' || (err.message && err.message.toLowerCase().includes('stock'))) {
            addToast({
              type: 'error',
              message: err.message || 'Some items in your bag are out of stock. Please adjust quantities.',
            });
            setPaymentFailureError(err.message || 'Stock reservation failed.');
            setIsProcessing(false);
            return;
          }

          if (err.message && err.message.toLowerCase().includes('promo')) {
            useCartStore.getState().removePromoCode();
            addToast({
              type: 'error',
              message: err.message || 'Promo code is invalid. Promo has been removed.',
            });
            setPaymentFailureError('Promo code was invalid or expired.');
            setIsProcessing(false);
            return;
          }

          addToast({ type: 'error', message: err.message || 'Order could not be created.' });
          setPaymentFailureError(err.message);
          setIsProcessing(false);
          return;
        }

        if (err.status === 401) {
          addToast({
            type: 'info',
            message: 'Session expired or guest checkout required. Please confirm details.',
          });
          setIsProcessing(false);
          return;
        }

        if (err.status === 0) {
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + (isExpress ? 3 : 5));

          const offlineOrder: Order = {
            id: generateOrderId(),
            createdAt: new Date().toISOString(),
            items: [...items],
            shippingAddress: { ...addressData },
            subtotal: breakdown.subtotal,
            discount: breakdown.discount,
            shippingFee: breakdown.shipping,
            codFee: breakdown.codFee,
            grandTotal: breakdown.grandTotal,
            promoCode: promoCode || undefined,
            status: 'placed',
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
            estimatedDeliveryDate: formatDate(deliveryDate),
          };

          isPlacingOrderRef.current = true;
          await addOrder(offlineOrder);
          productService.decrementStock(items);
          clearCart();
          sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
          setIsProcessing(false);
          navigate(`/order-confirmation/${offlineOrder.id}`);
          return;
        }
      }

      // Unhandled server rejection (e.g. 404/500). Never fabricate a success here:
      // surface the failure and keep the cart intact so the customer can retry.
      addToast({ type: 'error', message: err?.message || 'Could not place your order. Please try again.' });
      setPaymentFailureError(err?.message || 'Order submission failed. Please try again.');
      setIsProcessing(false);
    }
  };
  const stepTitles = ['Information', 'Shipping', 'Payment', 'Review'];

  return (
    <>
      <Helmet>
        <title>{`Checkout | ${siteConfig.name}`}</title>
      </Helmet>

      {/* Simulated Payment Processing Screen */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-obsidian/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-warm-ivory"
          >
            <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center mb-6 animate-pulse shadow-luxury">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-normal mb-2 text-white">
              Processing Demo Order
            </h3>
            <p className="text-xs sm:text-sm text-sandstone/80 max-w-sm mb-6">
              Simulated demonstration transaction. No real payment or card charges are made.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gold">
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span>Verifying order integrity...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-sandstone mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-obsidian hover:text-gold transition-colors tracking-wide uppercase"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Return to bag</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-ink-600 font-medium bg-warm-ivory border border-sandstone px-3.5 py-1.5 rounded-full shadow-subtle">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Demo checkout. No real payment is taken.</span>
          </div>
        </div>

        {/* Multi-Step Indicator */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sandstone -translate-y-1/2 -z-10" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gold -translate-y-1/2 -z-10 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {[1, 2, 3, 4].map((step) => {
              const isPassed = currentStep > step;
              const isCurrent = currentStep === step;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isPassed
                        ? 'bg-obsidian text-gold border border-gold/40 shadow-sm'
                        : isCurrent
                        ? 'bg-obsidian text-warm-ivory ring-4 ring-gold/20 shadow-sm'
                        : 'bg-white border-2 border-sandstone text-ink-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4 text-gold" /> : step}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-semibold tracking-wider uppercase ${
                      isCurrent ? 'text-obsidian' : 'text-ink-500'
                    }`}
                  >
                    {stepTitles[step - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Order Summary Collapsible */}
        <div className="lg:hidden mb-6 bg-warm-ivory rounded-2xl border border-sandstone p-4 shadow-subtle">
          <button
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-obsidian"
          >
            <span>
              {mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'} ({items.length} items)
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold tabular-nums">{formatPrice(breakdown.grandTotal)}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform text-gold ${
                  mobileSummaryOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {mobileSummaryOpen && (
            <div className="mt-4 pt-3 border-t border-sandstone space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={i.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                      alt={i.product?.name}
                      className="w-8 h-10 object-cover rounded border border-sandstone"
                    />
                    <div>
                      <p className="font-semibold text-obsidian">{i.product?.name}</p>
                      <p className="text-ink-600">Qty: {i.qty} • Size: {i.size}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-obsidian tabular-nums">
                    {formatPrice((i.product?.mrp || 0) * i.qty)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid: Form Steps (Left) + Persistent Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Step Form Containers */}
          <div className="lg:col-span-7">
            {/* Payment Failure simulation alert */}
            {paymentFailureError && (
              <div className="mb-6 p-4 rounded-2xl bg-status-error/10 border border-status-error/30 text-xs text-status-error font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{paymentFailureError}</span>
              </div>
            )}

            {/* STEP 1: INFORMATION */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-normal text-obsidian">
                    Shipping & Contact Details
                  </h2>
                  <p className="text-xs text-ink-600 mt-1">
                    Where should we deliver your Ateevibes parcel?
                  </p>
                </div>

                {/* Pre-fill from user address if logged in */}
                {user && user.savedAddresses.length > 0 && (
                  <div className="p-4 rounded-2xl bg-warm-ivory border border-sandstone space-y-2">
                    <p className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      Select Saved Address
                    </p>
                    <div className="space-y-2">
                      {user.savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          onClick={() => setAddressData({ ...addr })}
                          className="w-full text-left p-3 rounded-xl border border-sandstone bg-white hover:border-gold text-xs text-ink-700 shadow-subtle transition-colors"
                        >
                          <span className="font-semibold text-obsidian block">{addr.fullName}</span>
                          <span>{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="fullName" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none shadow-subtle"
                    />
                    {addressErrors.fullName && (
                      <p className="text-[11px] text-status-error font-medium">{addressErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={addressData.email}
                      onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none shadow-subtle"
                    />
                    {addressErrors.email && (
                      <p className="text-[11px] text-status-error font-medium">{addressErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength={10}
                      value={addressData.phone}
                      onChange={(e) =>
                        setAddressData({ ...addressData, phone: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none tabular-nums shadow-subtle"
                    />
                    {addressErrors.phone && (
                      <p className="text-[11px] text-status-error font-medium">{addressErrors.phone}</p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="addressLine1" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      House / Flat No., Building, Street Address *
                    </label>
                    <input
                      id="addressLine1"
                      name="addressLine1"
                      type="text"
                      value={addressData.addressLine1}
                      onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                      placeholder="e.g. Flat 402, Sunshine Residency, Ring Road"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none shadow-subtle"
                    />
                    {addressErrors.addressLine1 && (
                      <p className="text-[11px] text-status-error font-medium">{addressErrors.addressLine1}</p>
                    )}
                  </div>

                  {/* Address Line 2 / Landmark */}
                  <div className="space-y-1">
                    <label htmlFor="landmark" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      Landmark (Optional)
                    </label>
                    <input
                      id="landmark"
                      name="landmark"
                      type="text"
                      value={addressData.landmark || ''}
                      onChange={(e) => setAddressData({ ...addressData, landmark: e.target.value })}
                      placeholder="e.g. Near City Center Mall"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none shadow-subtle"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label htmlFor="city" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      placeholder="e.g. Surat"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none shadow-subtle"
                    />
                    {addressErrors.city && (
                      <p className="text-[11px] text-status-error font-medium">{addressErrors.city}</p>
                    )}
                  </div>

                  {/* State Dropdown */}
                  <div className="space-y-1">
                    <label htmlFor="state" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      State / Union Territory *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none shadow-subtle"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PIN Code */}
                  <div className="space-y-1">
                    <label htmlFor="pincode" className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      maxLength={6}
                      value={addressData.pincode}
                      onChange={(e) =>
                        setAddressData({ ...addressData, pincode: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="e.g. 395002"
                      className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-gold rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none tabular-nums shadow-subtle"
                    />
                    {addressErrors.pincode && (
                      <p className="text-[11px] text-status-error font-medium">{addressErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-sandstone">
                  <Link to="/cart" className="text-xs font-semibold text-obsidian hover:text-gold uppercase tracking-wider flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5 text-gold" />
                    <span>Return to Bag</span>
                  </Link>

                  <button
                    onClick={handleNextStep}
                    className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-luxury"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                    Shipping Method
                  </h2>
                  <p className="text-xs text-graphite/70 mt-1.5">
                    Delivering to: <span className="font-semibold text-obsidian">{addressData.fullName}</span>, {addressData.city}, {addressData.state} ({addressData.pincode})
                  </p>
                </div>

                {/* Shipping Radio Options */}
                <div className="space-y-3">
                  {/* Standard Shipping */}
                  <label
                    onClick={() => setIsExpress(false)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      !isExpress ? 'border-obsidian bg-ivory shadow-sm' : 'border-sandstone bg-white hover:border-gold/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          !isExpress ? 'border-obsidian' : 'border-sandstone'
                        }`}
                      >
                        {!isExpress && <div className="w-2 h-2 rounded-full bg-gold" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-obsidian">Standard Surface Delivery</p>
                        <p className="text-xs text-graphite/70">3 to 7 business days</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-obsidian tabular-nums">
                      {breakdown.subtotal >= commerceConfig.FREE_SHIPPING_THRESHOLD ? 'FREE' : formatPrice(commerceConfig.SHIPPING_FLAT)}
                    </span>
                  </label>

                  {/* Express Air Delivery */}
                  <label
                    onClick={() => setIsExpress(true)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      isExpress ? 'border-obsidian bg-ivory shadow-sm' : 'border-sandstone bg-white hover:border-gold/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isExpress ? 'border-obsidian' : 'border-sandstone'
                        }`}
                      >
                        {isExpress && <div className="w-2 h-2 rounded-full bg-gold" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-obsidian">Express Priority Air</p>
                        <p className="text-xs text-graphite/70">2 to 3 business days • ₹99 express surcharge</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-obsidian tabular-nums">
                      +{formatPrice(commerceConfig.EXPRESS_SURCHARGE)}
                    </span>
                  </label>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-sandstone">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-obsidian hover:text-gold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gold" />
                    <span>Back to Information</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-luxury"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                    Payment Method
                  </h2>
                  <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-obsidian bg-ivory p-3 rounded-xl border border-sandstone">
                    <Info className="w-4 h-4 shrink-0 text-gold" />
                    <span>DEMO CHECKOUT: Simulated payment environment. No actual money is charged.</span>
                  </div>
                </div>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'upi' ? 'border-obsidian bg-ivory shadow-sm' : 'border-sandstone bg-white hover:border-gold/50'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-gold' : 'text-obsidian'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian">UPI</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'card' ? 'border-obsidian bg-ivory shadow-sm' : 'border-sandstone bg-white hover:border-gold/50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-gold' : 'text-obsidian'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian">Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'netbanking' ? 'border-obsidian bg-ivory shadow-sm' : 'border-sandstone bg-white hover:border-gold/50'
                    }`}
                  >
                    <Building className={`w-5 h-5 ${paymentMethod === 'netbanking' ? 'text-gold' : 'text-obsidian'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian">Net Banking</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'cod' ? 'border-obsidian bg-ivory shadow-sm' : 'border-sandstone bg-white hover:border-gold/50'
                    }`}
                  >
                    <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-gold' : 'text-obsidian'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-obsidian">COD (+₹49)</span>
                  </button>
                </div>

                {/* Payment Subforms */}
                <div className="p-5 rounded-2xl bg-ivory border border-sandstone">
                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <label htmlFor="upiId" className="text-xs font-bold text-obsidian uppercase tracking-wider">
                        Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                      </label>
                      <input
                        id="upiId"
                        name="upiId"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank"
                        className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
                      />
                      {paymentErrors.upiId && (
                        <p className="text-[11px] text-red-600 font-medium">{paymentErrors.upiId}</p>
                      )}
                      <p className="text-[11px] text-graphite/70">
                        A payment collect request will be triggered to your UPI app.
                      </p>
                    </div>
                  )}

                  {/* Card */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      {/* Hint for simulation test card failure */}
                      <div className="text-[11px] text-graphite/80 bg-white p-3 rounded-xl border border-sandstone space-y-1">
                        <p><strong>Test card (Pass):</strong> Any valid 16-digit Visa (e.g. <code>4111 1111 1111 1111</code>, expiry <code>12/29</code>, CVV <code>123</code>)</p>
                        <p><strong>Test card (Fail simulator):</strong> <code>{FAILED_SIMULATION_CARD}</code></p>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="cardNumber" className="text-xs font-bold text-obsidian uppercase tracking-wider">
                          Card Number
                        </label>
                        <input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4111 1111 1111 1111"
                          className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian tabular-nums"
                        />
                        {paymentErrors.cardNumber && (
                          <p className="text-[11px] text-red-600 font-medium">{paymentErrors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="cardExpiry" className="text-xs font-bold text-obsidian uppercase tracking-wider">
                            Expiry (MM/YY)
                          </label>
                          <input
                            id="cardExpiry"
                            name="cardExpiry"
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                            placeholder="12/29"
                            className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian tabular-nums"
                          />
                          {paymentErrors.cardExpiry && (
                            <p className="text-[11px] text-red-600 font-medium">{paymentErrors.cardExpiry}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="cardCvv" className="text-xs font-bold text-obsidian uppercase tracking-wider">
                            CVV
                          </label>
                          <input
                            id="cardCvv"
                            name="cardCvv"
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian tabular-nums"
                          />
                          {paymentErrors.cardCvv && (
                            <p className="text-[11px] text-red-600 font-medium">{paymentErrors.cardCvv}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="cardName" className="text-xs font-bold text-obsidian uppercase tracking-wider">
                          Cardholder Name
                        </label>
                        <input
                          id="cardName"
                          name="cardName"
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
                        />
                        {paymentErrors.cardName && (
                          <p className="text-[11px] text-red-600 font-medium">{paymentErrors.cardName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-obsidian uppercase tracking-wider">
                        Select Your Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
                      >
                        {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Cash on Delivery */}
                  {paymentMethod === 'cod' && (
                    <div className="space-y-2 text-xs text-graphite/80">
                      <p className="font-bold text-obsidian">Cash on Delivery details:</p>
                      <p>• A nominal COD handling fee of ₹49 has been added to your total.</p>
                      <p>• Please keep exact cash or UPI ready at the time of delivery.</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-sandstone">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-obsidian hover:text-gold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gold" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-luxury"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & PLACE ORDER */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                    Final Review & Confirmation
                  </h2>
                  <p className="text-xs text-graphite/70 mt-1.5">
                    Please verify your order details before final placement.
                  </p>
                </div>

                {/* Verification Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-graphite">
                  <div className="p-5 rounded-2xl bg-ivory border border-sandstone space-y-1.5">
                    <span className="font-bold text-obsidian uppercase tracking-wider block text-[11px]">
                      Delivery Address
                    </span>
                    <p className="font-bold text-obsidian text-sm">{addressData.fullName}</p>
                    <p>{addressData.addressLine1}</p>
                    <p>{addressData.city}, {addressData.state} - {addressData.pincode}</p>
                    <p className="text-graphite/70">Phone: {addressData.phone}</p>
                    <button onClick={() => setCurrentStep(1)} className="text-gold font-semibold underline pt-2 block hover:text-obsidian transition-colors">
                      Change address
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-ivory border border-sandstone space-y-1.5">
                    <span className="font-bold text-obsidian uppercase tracking-wider block text-[11px]">
                      Payment & Shipping
                    </span>
                    <p><strong>Shipping:</strong> {isExpress ? 'Express Priority Air (2-3 days, ₹99 surcharge)' : 'Standard Surface (3-7 days)'}</p>
                    <p><strong>Payment Method:</strong> <span className="uppercase font-bold text-obsidian">{paymentMethod}</span></p>
                    <button onClick={() => setCurrentStep(3)} className="text-gold font-semibold underline pt-2 block hover:text-obsidian transition-colors">
                      Change payment method
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 text-xs text-graphite/80 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded border-sandstone text-obsidian focus:ring-gold mt-0.5"
                  />
                  <span>
                    I accept the{' '}
                    <Link to="/terms" target="_blank" className="underline font-bold text-obsidian hover:text-gold transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge that this is a simulated demo transaction with no real payment.
                  </span>
                </label>

                <div className="pt-6 flex items-center justify-between border-t border-sandstone">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-semibold text-obsidian hover:text-gold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gold" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={!termsAccepted}
                    className="btn-primary px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Place Order • {formatPrice(breakdown.grandTotal)}</span>
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Persistent Order Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian pb-4 border-b border-sandstone tracking-tight">
                In Your Bag ({items.length})
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                        alt={item.product?.name}
                        className="w-12 h-14 rounded-lg object-cover bg-white border border-sandstone shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-obsidian line-clamp-1">{item.product?.name}</p>
                        <p className="text-graphite/70 text-[11px] mt-0.5">
                          Qty: {item.qty} • Size: {item.size} • {item.variant?.colourName}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-obsidian tabular-nums shrink-0">
                      {formatPrice((item.product?.mrp || 0) * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm text-graphite border-t border-sandstone pt-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-obsidian tabular-nums">{formatPrice(breakdown.subtotal)}</span>
                </div>

                {breakdown.discount > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>Discount ({promoCode})</span>
                    <span className="tabular-nums">-{formatPrice(breakdown.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums text-obsidian font-medium">
                    {breakdown.shipping === 0 ? 'FREE' : formatPrice(breakdown.shipping)}
                  </span>
                </div>

                {breakdown.codFee > 0 && (
                  <div className="flex justify-between">
                    <span>COD Handling Fee</span>
                    <span className="tabular-nums text-obsidian">{formatPrice(breakdown.codFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base sm:text-lg font-bold text-obsidian pt-4 border-t border-sandstone">
                  <span>Grand Total</span>
                  <span className="tabular-nums">{formatPrice(breakdown.grandTotal)}</span>
                </div>
                <p className="text-[11px] text-graphite/60">All prices include applicable taxes</p>
              </div>

              {/* Security info */}
              <div className="p-3.5 bg-white rounded-xl border border-sandstone text-[11px] text-graphite flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Simulated demo checkout. No actual credit card or payment is charged.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
