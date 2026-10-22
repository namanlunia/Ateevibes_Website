import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Trash2,
  Heart,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Tag,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice } from '../lib/format';
import { PRODUCTS } from '../data/products';
import { siteConfig } from '../config/site';
import { commerceConfig } from '../config/commerce';
import { ProductCard } from '../components/product/ProductCard';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const savedForLater = useCartStore((state) => state.savedForLater);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const undoRemove = useCartStore((state) => state.undoRemove);
  const saveForLater = useCartStore((state) => state.saveForLater);
  const moveToCartFromSaved = useCartStore((state) => state.moveToCartFromSaved);
  const promoCode = useCartStore((state) => state.promoCode);
  const applyPromoCode = useCartStore((state) => state.applyPromoCode);
  const removePromoCode = useCartStore((state) => state.removePromoCode);
  const getBreakdown = useCartStore((state) => state.getBreakdown);

  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addToast = useUIStore((state) => state.addToast);

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const breakdown = getBreakdown();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    applyPromoCode(promoInput);
    const updated = useCartStore.getState().getBreakdown();
    if (updated.promoResult?.valid) {
      setPromoFeedback({ message: updated.promoResult.message, isError: false });
      setPromoInput('');
    } else {
      setPromoFeedback({
        message: updated.promoResult?.message || 'Invalid promo code',
        isError: true,
      });
      removePromoCode();
    }
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    addToast({
      type: 'info',
      message: `Removed ${name} from bag.`,
      actionLabel: 'Undo',
      onAction: () => undoRemove(),
      duration: 5000,
    });
  };

  // Check if any item in cart exceeds current stock or is out of stock
  const stockErrors: { itemId: string; message: string }[] = [];
  items.forEach((item) => {
    const available = item.variant?.stockBySize?.[item.size] ?? 10;
    if (available <= 0) {
      stockErrors.push({ itemId: item.id, message: `${item.product?.name} (${item.size}) is now sold out.` });
    } else if (item.qty > available) {
      stockErrors.push({
        itemId: item.id,
        message: `Only ${available} available for ${item.product?.name} (${item.size}). Quantity adjusted.`,
      });
    }
  });

  const hasStockErrors = stockErrors.length > 0;

  const popularSuggestions = PRODUCTS.filter((p) => p.status === 'active').slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{`Shopping Bag (${items.length}) | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 mb-8">
          Review items, apply promo codes, and proceed to checkout.
        </p>

        {/* Free Shipping Alert Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-brand-green/30 via-brand-cream/50 to-surface-tint border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white text-ink-900">
              <Truck className="w-4 h-4 text-accent-700" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-ink-900">
                {breakdown.isFreeShipping === 0
                  ? '🎉 Free Shipping Unlocked!'
                  : `Add ${formatPrice(breakdown.isFreeShipping)} more to get FREE Standard Delivery`}
              </p>
              <p className="text-[11px] text-ink-600">Standard delivery in 3 to 7 business days</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 bg-surface-tint rounded-3xl border border-border p-8 space-y-6 max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-ink-700 shadow-sm">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-ink-900">
                Your bag is feeling light. Let's fix that.
              </h2>
              <p className="text-xs sm:text-sm text-ink-600 max-w-sm mx-auto">
                Discover our newest arrivals in round-neck matty, China jacquard, and tie-dye patterns.
              </p>
            </div>
            <Link to="/shop" className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-2">
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Popular Items Showcase */}
            <div className="pt-10 border-t border-border/80 text-left space-y-4">
              <h3 className="font-display text-lg font-bold text-ink-900">You Might Like These</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {popularSuggestions.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Main Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Stock error alert banner if any */}
              {hasStockErrors && (
                <div className="p-4 rounded-2xl bg-status-error/10 border border-status-error/30 text-xs text-status-error font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please resolve inventory changes before checkout:</span>
                  </div>
                  {stockErrors.map((err, i) => (
                    <p key={i}>• {err.message}</p>
                  ))}
                </div>
              )}

              {/* Items List */}
              <div className="bg-surface rounded-3xl border border-border divide-y divide-border/60 overflow-hidden shadow-sm">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                        alt={item.product?.name || 'T-shirt'}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl object-cover bg-brand-cream/30 border border-border shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <Link
                          to={`/product/${item.product?.slug}`}
                          className="block font-bold text-sm sm:text-base text-ink-900 hover:text-accent-700 transition-colors line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-xs text-ink-600">
                          Colour: <span className="font-medium text-ink-900">{item.variant?.colourName}</span> • Size:{' '}
                          <span className="font-medium text-ink-900">{item.size}</span>
                        </p>
                        <p className="text-xs text-ink-600">
                          Unit Price:{' '}
                          <span className="font-bold text-ink-900">{formatPrice(item.product?.mrp || 0)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stepper, Line Total, Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-border/40">
                      <span className="text-base sm:text-lg font-bold text-ink-900 tabular-nums">
                        {formatPrice((item.product?.mrp || 0) * item.qty)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-border rounded-full bg-surface-tint p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 text-xs text-ink-600">
                        <button
                          onClick={() => saveForLater(item.id)}
                          className="hover:text-ink-900 underline flex items-center gap-1"
                        >
                          Save for later
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleRemove(item.id, item.product?.name || 'Item')}
                          className="hover:text-status-error flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved For Later Section */}
              {savedForLater.length > 0 && (
                <div className="bg-surface-tint rounded-3xl p-6 border border-border space-y-4">
                  <h3 className="font-display text-lg font-bold text-ink-900">
                    Saved for Later ({savedForLater.length})
                  </h3>
                  <div className="divide-y divide-border/60">
                    {savedForLater.map((saved) => (
                      <div key={saved.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={saved.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                            alt={saved.product?.name}
                            className="w-12 h-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-xs text-ink-900">{saved.product?.name}</p>
                            <p className="text-[11px] text-ink-600">
                              {saved.variant?.colourName} • Size {saved.size} • {formatPrice(saved.product?.mrp || 0)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => moveToCartFromSaved(saved.id)}
                          className="btn-secondary px-3.5 py-1.5 text-xs font-bold"
                        >
                          Move to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Card (Sticky) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="bg-surface-tint rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
                <h3 className="font-display text-xl font-bold text-ink-900 pb-3 border-b border-border">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="text-xs font-bold text-ink-900 uppercase tracking-wide">
                    Promo Code
                  </label>
                  <div className="flex items-center w-full bg-white border border-border focus-within:border-ink-900 rounded-full p-1 shadow-sm transition-colors">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="e.g. ATEE10"
                      className="flex-1 min-w-0 bg-transparent pl-4 pr-2 py-1.5 text-xs font-bold text-ink-900 uppercase focus:outline-none"
                    />
                    <button type="submit" className="btn-secondary shrink-0 px-4 py-1.5 text-xs font-bold rounded-full">
                      Apply
                    </button>
                  </div>

                  {promoFeedback && (
                    <p
                      className={`text-xs font-medium pl-1 ${
                        promoFeedback.isError ? 'text-status-error' : 'text-status-success'
                      }`}
                    >
                      {promoFeedback.message}
                    </p>
                  )}

                  {promoCode && (
                    <div className="flex items-center justify-between text-xs text-status-success font-semibold bg-brand-green/30 px-3 py-1.5 rounded-xl">
                      <span>Promo code {promoCode} applied</span>
                      <button onClick={removePromoCode} className="text-ink-700 hover:text-ink-900 text-xs">
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Price Breakdown Details */}
                <div className="space-y-2.5 text-xs sm:text-sm text-ink-700 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium tabular-nums">{formatPrice(breakdown.subtotal)}</span>
                  </div>

                  {breakdown.discount > 0 && (
                    <div className="flex justify-between text-status-success font-medium">
                      <span>Discount ({promoCode})</span>
                      <span className="tabular-nums">-{formatPrice(breakdown.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {breakdown.shipping === 0 ? 'FREE' : formatPrice(breakdown.shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base sm:text-lg font-bold text-ink-900 pt-3 border-t border-border">
                    <span>Total Amount</span>
                    <span className="tabular-nums">{formatPrice(breakdown.grandTotal)}</span>
                  </div>
                  <p className="text-[11px] text-ink-600">Tax inclusive MRP • No hidden fees</p>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={hasStockErrors}
                  className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges Row */}
              <div className="bg-surface rounded-2xl p-4 border border-border space-y-2 text-xs text-ink-700">
                <div className="flex items-center gap-2 font-bold text-ink-900">
                  <ShieldCheck className="w-4 h-4 text-accent-700" />
                  <span>Guaranteed Safe & Secure Checkout</span>
                </div>
                <p className="text-[11px] text-ink-600 leading-relaxed">
                  Support for UPI, Net Banking, Credit/Debit cards & Cash on Delivery across India.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
