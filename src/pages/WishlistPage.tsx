import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Trash2, Share2, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice } from '../lib/format';
import { siteConfig } from '../config/site';

export const WishlistPage: React.FC = () => {
  const rawItems = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  // Always resolve latest product data by id to ensure updated slugs and details
  const items = React.useMemo(
    () => rawItems.map((item) => PRODUCTS.find((p) => p.id === item.id) || item),
    [rawItems]
  );

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);

  const handleMoveToBag = (product: (typeof items)[0]) => {
    const defaultVariant = product.variants[0];
    const defaultSize = product.sizes[0] || 'M';

    if (defaultVariant) {
      addItem({
        product,
        variant: defaultVariant,
        size: defaultSize,
        qty: 1,
      });

      removeItem(product.id);
      addToast({
        type: 'success',
        message: 'Moved to your bag. Looking good.',
        actionLabel: 'View Bag',
        onAction: () => openCart(),
      });
    }
  };

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: 'info',
      message: 'Wishlist link copied to clipboard!',
      duration: 3000,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`My Wishlist (${items.length}) | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">
              My Wishlist ({items.length})
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              Curate your personal Ateevibes rotation and move to bag when ready.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareWishlist}
                className="btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Wishlist</span>
              </button>

              <button
                onClick={clearWishlist}
                className="text-xs font-semibold text-ink-600 hover:text-status-error transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-surface-tint rounded-3xl border border-border p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-ink-700">
              <Heart className="w-8 h-8 text-accent-700" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink-900">
              Your wishlist is empty
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              Explore our collections and tap the heart icon on any style to save it here for later.
            </p>
            <Link to="/shop" className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2">
              <span>Start Browsing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/5] bg-brand-cream/25 overflow-hidden">
                    <Link to={`/product/${product.slug}`} className="block w-full h-full">
                      <img
                        src={product.variants[0]?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-ink-700 hover:text-status-error transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-accent-700 uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <Link
                        to={`/product/${product.slug}`}
                        className="block font-bold text-sm text-ink-900 line-clamp-1 hover:text-accent-700 mt-0.5"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs font-bold text-ink-900 mt-1 tabular-nums">
                        {formatPrice(product.mrp)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};
