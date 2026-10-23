import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES, Category } from '../../data/categories';
import { productService } from '../../services/productService';
import { PRODUCTS } from '../../data/products';
import { formatPrice } from '../../lib/format';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    productService.getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    }).catch(() => {});
  }, []);

  // Featured flagship item (China Jacquard)
  const featuredProduct = PRODUCTS.find((p) => p.pno === '1007') || PRODUCTS[0];

  const getSubcategoryCount = (categorySlug: string, subCategorySlug: string) => {
    return PRODUCTS.filter(
      (p) => p.category === categorySlug && p.subCategory === subCategorySlug
    ).length;
  };

  const getCategoryCount = (categorySlug: string) => {
    return PRODUCTS.filter((p) => p.category === categorySlug).length;
  };

  // Close on outside click and Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={menuContainerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-full mt-3 z-50 pointer-events-auto"
          style={{ left: '50%', transform: 'translateX(-50%)', width: 'min(1040px, calc(100vw - 48px))' }}
        >
          <motion.div
            id="mega-menu"
            role="region"
            aria-label="Shop Mega Menu"
            initial={{ opacity: 0, y: 10, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white rounded-2xl border border-sandstone shadow-luxury p-8 overflow-hidden"
          >
            {/* CSS Grid: 4 equal category columns + 260px featured card */}
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_260px] gap-6 items-start">
              {/* 4 Category Columns */}
              {categories.map((cat) => {
                const totalCount = getCategoryCount(cat.slug);
                return (
                  <div key={cat.id} className="space-y-3 min-w-0">
                    <Link
                      to={`/shop/${cat.slug}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <h4 className="font-display text-base font-normal text-obsidian group-hover:text-gold transition-colors flex items-center justify-between gap-1">
                        <span className="truncate">{cat.name.replace(' Tees', '')}</span>
                        <span className="shrink-0 text-[10px] font-sans font-semibold text-ink-600 bg-ivory px-2 py-0.5 rounded-full border border-sandstone">
                          {totalCount}
                        </span>
                      </h4>
                    </Link>

                    <ul className="space-y-2 border-t border-sandstone/60 pt-2.5">
                      {cat.subCategories.map((sub) => {
                        const count = getSubcategoryCount(cat.slug, sub.slug);
                        return (
                          <li key={sub.id}>
                            <Link
                              to={`/shop/${cat.slug}/${sub.slug}`}
                              onClick={onClose}
                              className="text-xs text-ink-700 hover:text-gold transition-colors flex items-start justify-between gap-2 py-0.5 group leading-snug"
                            >
                              <span className="break-words font-normal group-hover:font-medium line-clamp-2">
                                {sub.name}
                              </span>
                              <span className="shrink-0 text-[10px] font-semibold text-ink-500 bg-sandstone/30 px-1.5 py-0.5 rounded-full mt-0.5">
                                {count}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    <Link
                      to={`/shop/${cat.slug}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gold hover:text-obsidian transition-colors pt-1 uppercase tracking-wider"
                    >
                      <span>View all</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}

              {/* Featured Product Column (about 260px) */}
              <div className="w-[260px] border-l border-sandstone/80 pl-6 space-y-3">
                <div className="bg-ivory rounded-xl p-4 border border-sandstone group">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span className="tracking-wider uppercase text-[10px]">Featured Drop</span>
                  </div>

                  <Link
                    to={`/product/${featuredProduct.slug}`}
                    onClick={onClose}
                    className="block relative aspect-[4/5] rounded-lg overflow-hidden bg-white mb-2.5"
                  >
                    <img
                      src={featuredProduct.variants[0]?.images[0] || '/brand/tshirt-silhouette.svg'}
                      alt={featuredProduct.name}
                      onError={(e) => {
                        e.currentTarget.src = '/brand/tshirt-silhouette.svg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <h5 className="font-display font-normal text-obsidian text-sm leading-snug line-clamp-2 mb-1">
                    {featuredProduct.name}
                  </h5>
                  <p className="text-[11px] text-ink-600 mb-2 truncate">{featuredProduct.fabric}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-sandstone/60">
                    <span className="font-bold text-obsidian text-xs tabular-nums">
                      {formatPrice(featuredProduct.mrp)}
                    </span>
                    <Link
                      to={`/product/${featuredProduct.slug}`}
                      onClick={onClose}
                      className="text-[11px] font-bold text-gold hover:text-obsidian flex items-center gap-1 uppercase tracking-wider"
                    >
                      <span>View item</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
