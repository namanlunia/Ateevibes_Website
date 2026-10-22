import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice } from '../lib/format';
import { PRODUCTS } from '../data/products';
import { siteConfig } from '../config/site';
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
        <h1 className="font-display text-3xl sm:text-4xl font-normal text-obsidian mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 mb-8">
          Review items, apply promo codes, and proceed to checkout.
        </p>

        {/* Free Shipping Alert Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-warm-ivory border border-sandstone flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white text-gold border border-sandstone shadow-sm">
              <Truck className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm text-obsidian">
                {breakdown.isFreeShipping === 0
                  ? 'Free Shipping Unlocked'
                  : `Add ${formatPrice(breakdown.isFreeShipping)} more to get FREE Standard Delivery`}
              </p>
              <p className="text-[11px] text-ink-600">Standard delivery in 3 to 7 business days</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 bg-warm-ivory/60 rounded-3xl border border-sandstone p-8 space-y-6 max-w-xl mx-auto shadow-luxury">
            <div className="w-20 h-20 mx-auto rounded-full bg-white border border-sandstone flex items-center justify-center text-gold shadow-subtle">
              <ShoppingBag className="w-10 h-10 text-gold" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-normal text-obsidian">
                Your bag is feeling light. Let's fix that.
              </h2>
              <p className="text-xs sm:text-sm text-ink-600 max-w-sm mx-auto">
                Discover our newest arrivals in round-neck matty, China jacquard, and artistic patterns.
              </p>
            </div>
            <Link to="/shop" className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>

            {/* Popular Items Showcase */}
            <div className="pt-10 border-t border-sandstone text-left space-y-4">
              <h3 className="font-display text-lg font-normal text-obsidian">You Might Like These</h3>
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
              <div className="bg-white rounded-2xl border border-sandstone divide-y divide-sandstone/60 overflow-hidden shadow-luxury">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                        alt={item.product?.name || 'T-shirt'}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover bg-warm-ivory border border-sandstone shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <Link
                          to={`/product/${item.product?.slug}`}
                          className="block font-semibold text-sm sm:text-base text-obsidian hover:text-gold transition-colors line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-xs text-ink-600">
                          Colour: <span className="font-semibold text-obsidian">{item.variant?.colourName}</span> • Size:{' '}
                          <span className="font-semibold text-obsidian">{item.size}</span>
                        </p>
                        <p className="text-xs text-ink-600">
                          Unit Price:{' '}
                          <span className="font-semibold text-obsidian">{formatPrice(item.product?.mrp || 0)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stepper, Line Total, Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-sandstone/60">
                      <span className="text-base sm:text-lg font-semibold text-obsidian tabular-nums">
                        {formatPrice((item.product?.mrp || 0) * item.qty)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-sandstone rounded-full bg-white p-1 shadow-subtle">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-7 h-7 rounded-full hover:bg-warm-ivory flex items-center justify-center text-xs font-bold text-obsidian"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold tabular-nums text-obsidian">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-7 h-7 rounded-full hover:bg-warm-ivory flex items-center justify-center text-xs font-bold text-obsidian"
                        >
                          +
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 text-xs text-ink-600">
                        <button
                          onClick={() => saveForLater(item.id)}
                          className="hover:text-gold underline flex items-center gap-1 transition-colors"
                        >
                          Save for later
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleRemove(item.id, item.product?.name || 'Item')}
                          className="hover:text-gold flex items-center gap-1 transition-colors"
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
                <div className="bg-warm-ivory/60 rounded-2xl p-6 border border-sandstone space-y-4 shadow-subtle">
                  <h3 className="font-display text-lg font-normal text-obsidian">
                    Saved for Later ({savedForLater.length})
                  </h3>
                  <div className="divide-y divide-sandstone/60">
                    {savedForLater.map((saved) => (
                      <div key={saved.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={saved.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                            alt={saved.product?.name}
                            className="w-12 h-14 rounded-lg object-cover bg-white border border-sandstone"
                          />
                          <div>
                            <p className="font-semibold text-xs text-obsidian">{saved.product?.name}</p>
                            <p className="text-[11px] text-ink-600">
                              {saved.variant?.colourName} • Size {saved.size} • {formatPrice(saved.product?.mrp || 0)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => moveToCartFromSaved(saved.id)}
                          className="btn-secondary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-white border-sandstone"
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
              <div className="bg-warm-ivory/80 rounded-2xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
                <h3 className="font-display text-xl font-normal text-obsidian pb-3 border-b border-sandstone">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="text-xs font-semibold text-obsidian uppercase tracking-wider">
                    Promo Code
                  </label>
                  <div className="flex items-center w-full bg-white border border-sandstone focus-within:border-gold rounded-full p-1 shadow-subtle transition-colors">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME15"
                      className="flex-1 min-w-0 bg-transparent pl-4 pr-2 py-1.5 text-xs font-bold text-obsidian uppercase focus:outline-none"
                    />
                    <button type="submit" className="btn-secondary shrink-0 px-4 py-1.5 text-xs font-bold rounded-full bg-white">
                      Apply
                    </button>
                  </div>

                  {promoFeedback && (
                    <p
                      className={`text-xs font-medium pl-1 ${
                        promoFeedback.isError ? 'text-status-error' : 'text-gold'
                      }`}
                    >
                      {promoFeedback.message}
                    </p>
                  )}

                  {promoCode && (
                    <div className="flex items-center justify-between text-xs text-gold font-semibold bg-gold/15 border border-gold/30 px-3 py-1.5 rounded-xl">
                      <span>Promo code {promoCode} applied</span>
                      <button onClick={removePromoCode} className="text-obsidian hover:text-gold text-xs">
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Price Breakdown Details */}
                <div className="space-y-2.5 text-xs sm:text-sm text-ink-700 border-t border-sandstone pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium tabular-nums">{formatPrice(breakdown.subtotal)}</span>
                  </div>

                  {breakdown.discount > 0 && (
                    <div className="flex justify-between text-gold font-medium">
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

                  <div className="flex justify-between text-base sm:text-lg font-semibold text-obsidian pt-3 border-t border-sandstone">
                    <span>Total Amount</span>
                    <span className="tabular-nums font-display text-2xl">{formatPrice(breakdown.grandTotal)}</span>
                  </div>
                  <p className="text-[11px] text-ink-500">Tax inclusive MRP • No hidden fees</p>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={hasStockErrors}
                  className="w-full btn-primary py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </div>

              {/* Order Information Note */}
              <div className="bg-white rounded-2xl p-4 border border-sandstone space-y-1.5 text-xs text-ink-700 shadow-subtle">
                <div className="flex items-center gap-2 font-semibold text-obsidian">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Order & Delivery Information</span>
                </div>
                <p className="text-[11px] text-ink-600 leading-relaxed">
                  Deliveries dispatched within 48 business hours. Test & demo store simulated order placement.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
