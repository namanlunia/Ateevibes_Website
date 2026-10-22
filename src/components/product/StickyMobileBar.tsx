import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product, Variant, SizeType } from '../../types';
import { formatPrice } from '../../lib/format';

interface StickyMobileBarProps {
  product: Product;
  selectedVariant: Variant;
  selectedSize: SizeType | string;
  isVisible: boolean;
  onAddToCart: () => void;
  disabled?: boolean;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  product,
  selectedVariant,
  selectedSize,
  isVisible,
  onAddToCart,
  disabled = false,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border p-3.5 px-4 flex items-center justify-between shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <img
              src={selectedVariant.images?.[0] || '/brand/tshirt-silhouette.svg'}
              alt={product.name}
              className="w-11 h-12 rounded-lg object-cover bg-brand-cream/30 border border-border"
            />
            <div>
              <p className="font-bold text-xs text-ink-900 line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-ink-900 tabular-nums">
                  {formatPrice(product.mrp)}
                </span>
                <span className="text-ink-600 font-medium text-[11px]">
                  Size {selectedSize} • {selectedVariant.colourName}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            disabled={disabled}
            className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
