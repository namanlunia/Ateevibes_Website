import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { formatPrice } from '../../lib/format';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  // Feature Style 1007
  const featuredProduct = PRODUCTS.find((p) => p.pno === '1007') || PRODUCTS[0];

  const getSubcategoryCount = (categorySlug: string, subCategorySlug: string) => {
    return PRODUCTS.filter(
      (p) => p.category === categorySlug && p.subCategory === subCategorySlug
    ).length;
  };

  const getCategoryCount = (categorySlug: string) => {
    return PRODUCTS.filter((p) => p.category === categorySlug).length;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mega-menu"
          role="region"
          aria-label="Shop Mega Menu"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          className="absolute top-full left-0 w-full glass bg-white/95 backdrop-blur-2xl border-b border-border shadow-soft-hover z-40 py-8 px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-start">
            {/* 4 Category Columns */}
            <div className="col-span-9 grid grid-cols-4 gap-6">
              {CATEGORIES.map((cat) => {
                const totalCount = getCategoryCount(cat.slug);
                return (
                  <div key={cat.id} className="space-y-4">
                    <Link
                      to={`/shop/${cat.slug}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <h4 className="font-display text-lg font-bold text-ink-900 group-hover:text-accent-700 transition-colors flex items-center justify-between">
                        <span>{cat.name}</span>
                        <span className="text-xs font-sans font-normal text-ink-600 bg-surface-tint px-2 py-0.5 rounded-full border border-border">
                          {totalCount}
                        </span>
                      </h4>
                      <p className="text-xs text-ink-600 mt-1 line-clamp-1">{cat.tagline}</p>
                    </Link>

                    <ul className="space-y-2 border-t border-border/60 pt-3">
                      {cat.subCategories.map((sub) => {
                        const count = getSubcategoryCount(cat.slug, sub.slug);
                        return (
                          <li key={sub.id}>
                            <Link
                              to={`/shop/${cat.slug}/${sub.slug}`}
                              onClick={onClose}
                              className="text-sm text-ink-700 hover:text-ink-900 hover:translate-x-1 transition-all duration-150 flex items-center justify-between py-1 group"
                            >
                              <span className="group-hover:font-medium">{sub.name}</span>
                              <span className="text-xs text-ink-600/70">{count}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    <Link
                      to={`/shop/${cat.slug}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-700 hover:text-ink-900 transition-colors pt-1"
                    >
                      <span>Explore all {cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Featured Product Column */}
            <div className="col-span-3 border-l border-border/80 pl-6">
              <div className="bg-surface-tint rounded-2xl p-4 border border-border shadow-sm group">
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                  <span className="tracking-wider uppercase">Signature Style</span>
                </div>

                <Link
                  to={`/product/${featuredProduct.slug}`}
                  onClick={onClose}
                  className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-brand-cream/30 mb-3"
                >
                  <img
                    src={featuredProduct.variants[0]?.images[0] || '/brand/logo.png'}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-ink-900 text-brand-cream text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    P.NO {featuredProduct.pno}
                  </div>
                </Link>

                <h5 className="font-display font-bold text-ink-900 text-sm line-clamp-1">
                  {featuredProduct.name}
                </h5>
                <p className="text-xs text-ink-600 mb-2">China Jacquard Knit</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-900 text-sm">
                    {formatPrice(featuredProduct.mrp)}
                  </span>
                  <Link
                    to={`/product/${featuredProduct.slug}`}
                    onClick={onClose}
                    className="text-xs font-medium text-accent-700 hover:text-ink-900 flex items-center gap-1"
                  >
                    <span>View item</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
