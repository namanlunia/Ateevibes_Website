import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Compass, Heart, ShoppingBag, User, HelpCircle, Phone, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.items.reduce((sum, i) => sum + i.qty, 0));

  const toggleCategory = (slug: string) => {
    setExpandedCategory((prev) => (prev === slug ? null : slug));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm z-50 lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 w-[88vw] max-w-sm bg-surface glass-tint z-50 flex flex-col justify-between shadow-2xl lg:hidden overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-white/80">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <img src="/brand/logo.png" alt="Ateevibes" className="h-8 w-auto object-contain" />
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-full hover:bg-black/5 text-ink-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto py-4 px-5 space-y-6">
              {/* Quick Collections */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-accent-700 tracking-wider uppercase mb-2">Featured</p>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 text-base font-medium text-ink-900 hover:text-accent-700 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-accent-500" />
                    <span>Shop All</span>
                  </span>
                </Link>
                <Link
                  to="/collections/new-arrivals"
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 text-base font-medium text-ink-900 hover:text-accent-700 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-accent-500" />
                    <span>New Arrivals</span>
                  </span>
                  <span className="text-[10px] font-bold bg-brand-green/80 text-ink-900 px-2 py-0.5 rounded-full">NEW</span>
                </Link>
                <Link
                  to="/collections/best-sellers"
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 text-base font-medium text-ink-900 hover:text-accent-700 transition-colors"
                >
                  <span>Best Sellers</span>
                </Link>
                <Link
                  to="/collections/full-sleeve"
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 text-base font-medium text-ink-900 hover:text-accent-700 transition-colors"
                >
                  <span>Full Sleeve</span>
                </Link>
              </div>

              {/* Accordion Categories */}
              <div className="border-t border-border pt-4 space-y-1">
                <p className="text-[11px] font-bold text-ink-600 tracking-wider uppercase mb-2">Categories</p>
                {CATEGORIES.map((cat) => {
                  const isExpanded = expandedCategory === cat.slug;
                  return (
                    <div key={cat.id} className="border-b border-border/40 pb-1">
                      <button
                        onClick={() => toggleCategory(cat.slug)}
                        className="w-full flex items-center justify-between py-2.5 text-base font-medium text-ink-900 text-left"
                      >
                        <span>{cat.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 pr-2 pb-2 space-y-2"
                          >
                            <Link
                              to={`/shop/${cat.slug}`}
                              onClick={onClose}
                              className="block py-1 text-sm font-semibold text-accent-700"
                            >
                              All {cat.name}
                            </Link>
                            {cat.subCategories.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/shop/${cat.slug}/${sub.slug}`}
                                onClick={onClose}
                                className="block py-1 text-sm text-ink-700 hover:text-ink-900"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Quick Customer Links */}
              <div className="border-t border-border pt-4 space-y-2 text-sm text-ink-700">
                <Link
                  to="/track-order"
                  onClick={onClose}
                  className="flex items-center gap-2 py-1.5 hover:text-ink-900"
                >
                  <HelpCircle className="w-4 h-4 text-ink-600" />
                  <span>Track Order</span>
                </Link>
                <Link
                  to="/size-guide"
                  onClick={onClose}
                  className="flex items-center gap-2 py-1.5 hover:text-ink-900"
                >
                  <span>Size Guide</span>
                </Link>
                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center gap-2 py-1.5 hover:text-ink-900"
                >
                  <span>Our Story</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="flex items-center gap-2 py-1.5 hover:text-ink-900"
                >
                  <Phone className="w-4 h-4 text-ink-600" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t border-border bg-white/80 grid grid-cols-3 gap-2 text-center text-xs">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-tint border border-border"
              >
                <div className="relative">
                  <Heart className="w-4 h-4 text-ink-700" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-ink-900 text-brand-cream text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-ink-700">Wishlist</span>
              </Link>

              <Link
                to="/cart"
                onClick={onClose}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-tint border border-border"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-ink-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-accent-700 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-ink-700">Bag</span>
              </Link>

              <Link
                to="/account"
                onClick={onClose}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-tint border border-border"
              >
                <User className="w-4 h-4 text-ink-700" />
                <span className="mt-1 text-ink-700">Account</span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
