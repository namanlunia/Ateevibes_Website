import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Heart, ArrowRight, ShoppingBag, Truck, Tag, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUIStore } from '../../store/uiStore';
import { formatPrice } from '../../lib/format';
import { PRODUCTS } from '../../data/products';
import { commerceConfig } from '../../config/commerce';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const undoRemove = useCartStore((state) => state.undoRemove);
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

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    addToast({
      type: 'info',
      message: `Removed ${name} from bag.`,
      actionLabel: 'Undo',
      onAction: () => undoRemove(),
      duration: 5000,
    });
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    if (item.product) {
      toggleWishlist(item.product);
      removeItem(item.id);
      addToast({
        type: 'info',
        message: `Moved ${item.product.name} to wishlist.`,
        duration: 3500,
      });
    }
  };

  // Free shipping progress calculations
  const progressPercent = Math.min(
    100,
    Math.round(((breakdown.subtotal - breakdown.discount) / commerceConfig.FREE_SHIPPING_THRESHOLD) * 100)
  );

  // Recommendations: products not in cart
  const cartProductIds = items.map((i) => i.productId);
  const addOnSuggestions = PRODUCTS.filter((p) => p.status === 'active' && !cartProductIds.includes(p.id)).slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          className="fixed inset-0 z-[110] flex justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm"
          />

          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative w-full max-w-md bg-surface h-full flex flex-col justify-between shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-border bg-surface-tint flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-ink-900" />
                <h3 className="font-display text-lg font-bold text-ink-900">
                  Your Bag ({items.reduce((s, i) => s + i.qty, 0)})
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close bag"
                className="p-1.5 rounded-full hover:bg-black/5 text-ink-700 hover:text-ink-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-5 py-3 bg-gradient-to-r from-brand-green/20 via-brand-cream/40 to-surface-tint border-b border-border text-xs">
              <div className="flex items-center justify-between mb-1.5 font-medium text-ink-900">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-accent-700" />
                  <span>
                    {breakdown.isFreeShipping === 0
                      ? '🎉 Free shipping unlocked!'
                      : `Add ${formatPrice(breakdown.isFreeShipping)} more for free shipping`}
                  </span>
                </div>
                <span className="font-bold text-[11px] text-ink-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-green to-accent-700 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-ink-700">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-ink-900">
                    Your bag is feeling light
                  </h4>
                  <p className="text-xs text-ink-600 max-w-xs mx-auto">
                    Let's fix that. Explore China jacquard weaves, waffle knits, and vibrant tie-dye prints.
                  </p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <span>Shop All Styles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-3 rounded-2xl bg-surface-tint border border-border flex gap-3.5 items-center justify-between"
                      >
                        {/* Thumbnail */}
                        <img
                          src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                          alt={item.product?.name || 'T-shirt'}
                          className="w-16 h-20 rounded-xl object-cover bg-white border border-border shrink-0"
                        />

                        {/* Middle info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <Link
                            to={`/product/${item.product?.slug}`}
                            onClick={onClose}
                            className="font-bold text-xs sm:text-sm text-ink-900 line-clamp-1 hover:text-accent-700"
                          >
                            {item.product?.name}
                          </Link>
                          <p className="text-[11px] text-ink-600">
                            {item.variant?.colourName} • Size {item.size}
                          </p>

                          {/* Stepper & Line Price */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center border border-border rounded-full bg-white px-2 py-0.5 gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="text-ink-600 hover:text-ink-900 text-xs font-bold px-1"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold tabular-nums text-ink-900">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="text-ink-600 hover:text-ink-900 text-xs font-bold px-1"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold text-xs sm:text-sm text-ink-900 tabular-nums">
                              {formatPrice((item.product?.mrp || 0) * item.qty)}
                            </span>
                          </div>
                        </div>

                        {/* Right quick actions */}
                        <div className="flex flex-col items-center gap-2 pl-1 border-l border-border/60">
                          <button
                            onClick={() => handleRemoveItem(item.id, item.product?.name || 'Item')}
                            aria-label="Remove item"
                            className="p-1 rounded-md text-ink-600 hover:text-status-error hover:bg-black/5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            aria-label="Save to wishlist"
                            className="p-1 rounded-md text-ink-600 hover:text-accent-700 hover:bg-black/5"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add-on recommendations */}
                  {addOnSuggestions.length > 0 && (
                    <div className="pt-4 border-t border-border space-y-2">
                      <p className="text-[11px] font-bold text-accent-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended Add-Ons</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {addOnSuggestions.map((rec) => (
                          <Link
                            key={rec.id}
                            to={`/product/${rec.slug}`}
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white border border-border hover:border-ink-900 flex items-center gap-2 group transition-colors"
                          >
                            <img
                              src={rec.variants[0]?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                              alt={rec.name}
                              className="w-10 h-12 object-cover rounded-md"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-ink-900 line-clamp-1 group-hover:text-accent-700">
                                {rec.name}
                              </p>
                              <p className="text-[10px] text-ink-600">{formatPrice(rec.mrp)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer / Summary / Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border bg-surface-tint space-y-4">
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex items-center w-full bg-white border border-border focus-within:border-ink-900 rounded-full p-1 shadow-sm transition-colors">
                    <Tag className="w-3.5 h-3.5 text-ink-600 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Promo (e.g. ATEE10)"
                      className="flex-1 min-w-0 bg-transparent pl-2 pr-2 py-1.5 text-xs font-semibold text-ink-900 uppercase placeholder:normal-case focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="btn-secondary shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-full"
                    >
                      Apply
                    </button>
                  </div>

                  {promoFeedback && (
                    <p
                      className={`text-[11px] font-medium pl-1 ${
                        promoFeedback.isError ? 'text-status-error' : 'text-status-success'
                      }`}
                    >
                      {promoFeedback.message}
                    </p>
                  )}

                  {promoCode && (
                    <div className="flex items-center justify-between text-xs text-status-success font-semibold bg-brand-green/30 px-2.5 py-1 rounded-lg">
                      <span>Code {promoCode} active</span>
                      <button onClick={removePromoCode} className="text-ink-700 hover:text-ink-900 text-[11px]">
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-ink-700 border-t border-border/80 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium">{formatPrice(breakdown.subtotal)}</span>
                  </div>

                  {breakdown.discount > 0 && (
                    <div className="flex justify-between text-status-success font-medium">
                      <span>Promo Discount</span>
                      <span className="tabular-nums">-{formatPrice(breakdown.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="tabular-nums">
                      {breakdown.shipping === 0 ? 'FREE' : formatPrice(breakdown.shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-ink-900 pt-2 border-t border-border">
                    <span>Grand Total</span>
                    <span className="tabular-nums">{formatPrice(breakdown.grandTotal)}</span>
                  </div>
                  <p className="text-[10px] text-ink-600">Prices are inclusive of all taxes.</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/cart');
                    }}
                    className="btn-secondary py-3 text-xs font-bold text-center"
                  >
                    View Bag
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      navigate('/checkout');
                    }}
                    className="btn-primary py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
