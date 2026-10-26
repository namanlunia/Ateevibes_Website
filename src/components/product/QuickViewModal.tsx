import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { Variant, SizeType } from '../../types';
import { formatPrice } from '../../lib/format';
import { ColourSwatch } from './ColourSwatch';
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from '../../lib/images';

export const QuickViewModal: React.FC = () => {
  const product = useUIStore((state) => state.quickViewProduct);
  const initialVariant = useUIStore((state) => state.quickViewVariant);
  const closeQuickView = useUIStore((state) => state.closeQuickView);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeType | string>('M');
  const [qty, setQty] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedVariant(initialVariant || product.variants[0] || null);
      setSelectedSize(product.sizes[0] || 'M');
      setQty(1);
      setActiveImageIdx(0);
    }
  }, [product, initialVariant]);

  if (!product || !selectedVariant) return null;

  const isComingSoon = product.status === 'coming-soon';
  const availableStock = selectedVariant.stockBySize?.[selectedSize] ?? 10;
  const isOutOfStock = availableStock <= 0;

  const images = selectedVariant.images?.length > 0 ? selectedVariant.images : ['/brand/tshirt-silhouette.svg'];
  const activeImage = images[activeImageIdx] || images[0];

  const handleAddToCart = () => {
    if (isComingSoon || isOutOfStock) return;

    addItem({
      product,
      variant: selectedVariant,
      size: selectedSize,
      qty,
    });

    closeQuickView();
    addToast({
      type: 'success',
      message: 'Added to your bag. Looking good.',
      actionLabel: 'View Bag',
      onAction: () => openCart(),
    });
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeQuickView();
        }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-ink-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl shadow-2xl border border-border overflow-y-auto grid grid-cols-1 md:grid-cols-2 z-10"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur border border-border text-ink-700 hover:text-ink-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery Column */}
          <div className="p-6 bg-surface-tint flex flex-col justify-between">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
              <img
                src={activeImage}
                srcSet={getProductSrcSet(activeImage)}
                sizes={PRODUCT_IMAGE_SIZES}
                alt={`${product.name} - ${selectedVariant.colourName}`}
                onError={(e) => {
                  e.currentTarget.srcset = '';
                  e.currentTarget.src = '/brand/placeholder.svg';
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail rail */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-ink-900 scale-105' : 'border-border/80 opacity-70'
                    }`}
                  >
                    <img
                      src={img}
                      srcSet={getProductSrcSet(img)}
                      sizes="64px"
                      alt="thumbnail"
                      onError={(e) => {
                        e.currentTarget.srcset = '';
                        e.currentTarget.src = '/brand/placeholder.svg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-ink-600">
                <span className="font-semibold text-accent-700 uppercase tracking-wider">
                  {product.categoryName}
                </span>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 font-medium text-xs text-ink-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-ink-600/60">({product.reviewCount})</span>
                  </div>
                )}
              </div>

              <h2 className="font-display text-2xl font-normal text-ink-900 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-ink-900 tabular-nums">
                  {formatPrice(product.mrp)}
                </span>
                <span className="text-xs text-ink-600 font-medium">Inclusive of all taxes</span>
              </div>

              <p className="text-xs text-ink-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Colour Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink-900">Colour:</span>
                <span className="text-ink-700 font-medium">{selectedVariant.colourName}</span>
              </div>
              <ColourSwatch
                variants={product.variants}
                selectedVariantId={selectedVariant.id}
                onSelect={(v) => {
                  setSelectedVariant(v);
                  setActiveImageIdx(0);
                }}
                size="md"
                ringOffsetClass="ring-offset-white"
              />
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink-900">Size:</span>
                {availableStock <= 5 && availableStock > 0 && (
                  <span className="text-status-warning font-semibold text-[11px]">
                    Only {availableStock} left
                  </span>
                )}
                {isOutOfStock && (
                  <span className="text-status-error font-semibold text-[11px]">Sold out</span>
                )}
              </div>

              <div className="flex gap-2" role="radiogroup" aria-label="Select size">
                {product.sizes.map((size) => {
                  const stock = selectedVariant.stockBySize?.[size] ?? 10;
                  const outOfStock = stock <= 0;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Size ${size}${outOfStock ? ' - Sold out' : ''}`}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center transition-[background-color,color,border-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                        isSelected
                          ? 'bg-chip-active-bg text-chip-active-text border-[1.5px] border-chip-active-border shadow-sm'
                          : outOfStock
                          ? 'bg-sandstone/20 text-ink-400 line-through border border-transparent cursor-not-allowed opacity-60'
                          : 'bg-chip-inactive-bg text-chip-inactive-text border border-chip-inactive-border hover:border-gold/50 shadow-subtle'
                      }`}
                    >
                      {isSelected && (
                        <Check className="absolute top-1 right-1 w-2.5 h-2.5 text-gold" strokeWidth={2.5} />
                      )}
                      <span className={isSelected ? 'text-chip-active-text' : outOfStock ? 'text-ink-400' : 'text-chip-inactive-text'}>{size}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-full bg-surface-tint p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-ink-900 text-sm font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-ink-900 tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(availableStock, qty + 1))}
                    disabled={qty >= availableStock}
                    className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-ink-900 text-sm font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isComingSoon || isOutOfStock}
                  className="flex-1 btn-primary py-3 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isComingSoon
                      ? 'Coming Soon'
                      : isOutOfStock
                      ? 'Sold Out'
                      : `Add to Bag • ${formatPrice(product.mrp * qty)}`}
                  </span>
                </button>
              </div>

              {/* View Full Product Link */}
              <div className="text-center pt-1">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-700 hover:text-ink-900 transition-colors"
                >
                  <span>View full product details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
