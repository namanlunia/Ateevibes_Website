import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Plus, Star, Check } from 'lucide-react';
import { Product, Variant, SizeType } from '../../types';
import { formatPrice } from '../../lib/format';
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from '../../lib/images';
import { cn } from '../../lib/utils';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { ColourSwatch } from './ColourSwatch';

interface ProductCardProps {
  product: Product;
  initialColourSlug?: string;
  className?: string;
}


export function getQuickAddChipClasses({
  isJustAdded = false,
  isOutOfStock = false,
}: {
  isJustAdded?: boolean;
  isOutOfStock?: boolean;
} = {}): string {
  const baseClasses =
    "min-w-[32px] h-7 px-2 text-[13px] font-semibold rounded transition-[background-color,color,border-color] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

  if (isJustAdded) {
    return cn(
      baseClasses,
      "bg-status-success text-white border border-status-success shadow-sm"
    );
  }

  if (isOutOfStock) {
    return cn(
      baseClasses,
      "bg-sandstone/20 text-ink-600 border border-sandstone/60 line-through cursor-not-allowed"
    );
  }

  return cn(
    baseClasses,
    "bg-white text-obsidian border border-obsidian/35 hover:bg-obsidian hover:text-gold hover:border-gold focus-visible:bg-obsidian focus-visible:text-gold focus-visible:border-gold active:scale-90"
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  initialColourSlug,
  className = '',
}) => {
  const getInitialVariant = (): Variant => {
    if (initialColourSlug) {
      const match = product.variants.find(
        (v) => v.colourSlug.toLowerCase() === initialColourSlug.toLowerCase()
      );
      if (match) return match;
    }
    return product.variants[0] || ({} as Variant);
  };

  const [selectedVariant, setSelectedVariant] = useState<Variant>(getInitialVariant);
  const [hoveredVariant, setHoveredVariant] = useState<Variant | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  // Sync initialColourSlug when shop filter changes
  useEffect(() => {
    if (initialColourSlug) {
      const match = product.variants.find(
        (v) => v.colourSlug.toLowerCase() === initialColourSlug.toLowerCase()
      );
      if (match) {
        setSelectedVariant(match);
      }
    }
  }, [initialColourSlug, product.variants]);

  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    state.items.some((p) => p.id === product.id)
  );
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const addToast = useUIStore((state) => state.addToast);

  const activeVariant = hoveredVariant || selectedVariant;
  const isComingSoon = product.status === 'coming-soon';

  // Smooth crossfade on variant switch (~220ms)
  const [displayVariant, setDisplayVariant] = useState<Variant>(activeVariant);
  const [prevVariant, setPrevVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (activeVariant.id !== displayVariant.id) {
      setPrevVariant(displayVariant);
      setDisplayVariant(activeVariant);
      const timer = setTimeout(() => {
        setPrevVariant(null);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [activeVariant.id, displayVariant.id]);

  // Images: main image and alternate/second image for hover swap
  const mainImage = displayVariant.images?.[0] || product.variants[0]?.images?.[0] || '/brand/tshirt-silhouette.svg';
  const secondImage = displayVariant.images?.[1] || mainImage;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    addToast({
      type: 'info',
      message: added ? 'Saved to your wishlist' : 'Removed from wishlist',
      duration: 3000,
    });
  };

  const handleQuickAddSize = (e: React.MouseEvent, size: SizeType) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComingSoon) return;

    const availableStock = activeVariant.stockBySize?.[size] ?? 10;
    if (availableStock <= 0) return;

    const targetCard = (e.currentTarget.closest('.product-card-container') as HTMLElement) || null;

    addItem({
      product,
      variant: activeVariant,
      size,
      qty: 1,
      sourceElement: targetCard,
    });

    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1200);

    addToast({
      type: 'success',
      message: 'Added to your bag. Looking good.',
      actionLabel: 'View Bag',
      onAction: () => openCart(),
      duration: 4000,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product, selectedVariant);
  };

  const productHref = `/product/${product.slug}?colour=${selectedVariant.colourSlug}`;

  return (
    <div
      className={`product-card-container group relative flex flex-col h-full bg-white rounded-xl border border-sandstone overflow-hidden transition-all duration-300 hover:border-gold/60 hover:shadow-soft-hover ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredVariant(null);
      }}
    >
      {/* 4:5 Aspect Ratio Image Canvas */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory rounded-t-xl">
        <Link to={productHref} className="block w-full h-full relative">
          {/* Previous image during 220ms crossfade */}
          {prevVariant && (
            <img
              src={prevVariant.images?.[0] || '/brand/tshirt-silhouette.svg'}
              srcSet={getProductSrcSet(prevVariant.images?.[0] || '')}
              sizes={PRODUCT_IMAGE_SIZES}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* Main Photo with smooth crossfade and zoom */}
          <img
            src={mainImage}
            srcSet={getProductSrcSet(mainImage)}
            sizes={PRODUCT_IMAGE_SIZES}
            alt={`${product.name} - ${displayVariant.colourName}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.srcset = '';
              e.currentTarget.src = '/brand/placeholder.svg';
            }}
            className={`w-full h-full object-cover transition-[transform,opacity] duration-[220ms] ease-out group-hover:scale-105 ${
              isHovered && secondImage ? 'opacity-0 scale-100' : 'opacity-100'
            }`}
          />

          {/* Second Image Swap on Hover */}
          {secondImage && (
            <img
              src={secondImage}
              srcSet={getProductSrcSet(secondImage)}
              sizes={PRODUCT_IMAGE_SIZES}
              alt={`${product.name} alternate view`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.srcset = '';
                e.currentTarget.src = '/brand/placeholder.svg';
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          )}
        </Link>

        {/* Mask inside watermark */}
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-44 h-12 bg-gradient-to-r from-[#FCFCFA] via-[#FCFCFA] to-transparent z-[5]" />

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isComingSoon && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-obsidian text-ivory border border-sandstone/40 uppercase tracking-wider shadow-sm">
              Coming Soon
            </span>
          )}
          {!isComingSoon && product.badges.includes('Best Seller') && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-obsidian text-gold border border-gold/40 uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {!isComingSoon && product.badges.includes('New') && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gold text-obsidian border border-gold uppercase tracking-wider shadow-sm">
              New Drop
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Pop Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur border border-sandstone/80 text-obsidian hover:text-gold hover:scale-110 active:scale-95 transition-[transform,colors,box-shadow] shadow-subtle"
        >
          <motion.div
            animate={{ scale: isInWishlist ? [1, 1.35, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isInWishlist ? 'fill-status-error text-status-error' : 'text-obsidian'
              }`}
            />
          </motion.div>
        </button>

        {/* Quick View Button (Desktop overlay) */}
        <button
          onClick={handleQuickView}
          aria-label="Quick preview"
          className="hidden lg:flex absolute top-12 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur border border-sandstone/80 text-obsidian hover:text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-200 hover:bg-white shadow-subtle"
        >
          <Eye className="w-4 h-4 text-obsidian" />
        </button>

        {/* Desktop Quick Add Bar (Slides up on Hover) */}
        {!isComingSoon && (
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-obsidian/85 via-obsidian/45 to-transparent">
            <div className="bg-white/98 text-obsidian backdrop-blur rounded-lg p-2.5 shadow-luxury border border-sandstone">
              <p className="text-[10px] font-bold text-ink-700 tracking-wider uppercase mb-1.5 text-center">
                Quick Add Size
              </p>
              <div className="flex items-center justify-center gap-1.5">
                {product.sizes.map((size) => {
                  const stock = activeVariant.stockBySize?.[size] ?? 10;
                  const isOutOfStock = stock <= 0;
                  const isJustAdded = addedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      aria-label={`Quick add size ${size}${isOutOfStock ? ' - Sold out' : ''}`}
                      disabled={isOutOfStock}
                      onClick={(e) => handleQuickAddSize(e, size)}
                      className={getQuickAddChipClasses({ isJustAdded, isOutOfStock })}
                    >
                      {isJustAdded ? <Check className="w-3.5 h-3.5 mx-auto" /> : size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Quick Add Plus Button */}
        {!isComingSoon && (
          <div className="lg:hidden absolute bottom-2.5 right-2.5 z-10">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickAddOpen(!quickAddOpen); }}
              aria-label="Select size"
              className="w-8 h-8 rounded-full bg-obsidian text-gold border border-gold/30 flex items-center justify-center shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile Size Dropdown */}
        <AnimatePresence>
          {quickAddOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="lg:hidden absolute bottom-12 right-2.5 z-20 bg-white rounded-lg shadow-luxury p-2 border border-sandstone flex flex-col gap-1"
            >
              <span className="text-[10px] font-bold text-ink-600 uppercase px-1">Select Size</span>
              {product.sizes.map((size) => {
                const stock = activeVariant.stockBySize?.[size] ?? 10;
                const isOutOfStock = stock <= 0;
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      handleQuickAddSize(e, size);
                      setQuickAddOpen(false);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded text-left ${
                      isOutOfStock
                        ? 'text-ink-600/40 line-through'
                        : 'hover:bg-ivory text-obsidian'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body Details */}
      <div className="pt-3 pb-2 px-3 flex flex-col flex-1 justify-between space-y-2 bg-white">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-ink-600">
          <span className="font-semibold text-gold tracking-widest text-[10px] uppercase truncate">
            {product.categoryName}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 font-medium text-[11px] text-ink-700">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-ink-500">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link to={productHref} className="block group-hover:text-gold transition-colors">
          <h3 className="font-sans font-medium text-sm sm:text-base text-obsidian line-clamp-2 leading-snug min-h-[2.5rem] sm:min-h-[2.75rem]">
            {product.name}
          </h3>
        </Link>

        {/* Colorway Swatches Preview Row */}
        {product.variants.length > 1 && (
          <div className="pt-0.5 flex items-center justify-between gap-1.5 min-h-[26px]">
            <ColourSwatch
              variants={product.variants}
              selectedVariantId={selectedVariant.id}
              onSelect={(v) => setSelectedVariant(v)}
              onHover={(v) => setHoveredVariant(v)}
              size="sm"
              maxVisible={5}
              ringOffsetClass="ring-offset-white"
            />
            <span
              className="text-[11px] font-medium text-ink-600 truncate max-w-[100px] text-right"
              title={displayVariant.colourName}
            >
              {displayVariant.colourName}
            </span>
          </div>
        )}

        {/* Price and Fabric badge */}
        <div className="pt-1 flex items-center justify-between border-t border-sandstone/40">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base sm:text-lg text-obsidian tabular-nums">
              {formatPrice(product.mrp)}
            </span>
            <span className="text-[10px] text-ink-500 font-normal">tax incl.</span>
          </div>
          <span className="text-[10px] font-semibold text-ink-600 bg-ivory border border-sandstone px-2 py-0.5 rounded-full">
            {product.fabric}
          </span>
        </div>
      </div>
    </div>
  );
};
