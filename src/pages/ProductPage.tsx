import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Heart,
  Share2,
  Star,
  ShoppingBag,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
  Maximize2,
  ChevronDown,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Wind,
  Feather,
  Activity,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { PRODUCTS, OLD_SLUG_MAP } from '../data/products';
import { REVIEWS_DATA } from '../data/reviews';
import { Product, Variant, SizeType } from '../types';
import { formatPrice } from '../lib/format';
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from '../lib/images';
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '../lib/seo';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { PincodeChecker } from '../components/product/PincodeChecker';
import { ProductLightbox } from '../components/product/ProductLightbox';
import { ReviewModal } from '../components/product/ReviewModal';
import { StickyMobileBar } from '../components/product/StickyMobileBar';
import { NotFoundPage } from './NotFoundPage';
import { siteConfig } from '../config/site';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.slug === (slug && OLD_SLUG_MAP[slug] ? OLD_SLUG_MAP[slug] : slug));

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(() => product?.variants[0] || null);
  const [selectedSize, setSelectedSize] = useState<SizeType | string>(() => product?.sizes[0] || 'M');
  const [qty, setQty] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [isMobileBarVisible, setIsMobileBarVisible] = useState(false);

  // Recommendations
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [completeSetProducts, setCompleteSetProducts] = useState<Product[]>([]);

  // Accordion state
  const [accordions, setAccordions] = useState({
    description: true,
    fabric: false,
    shipping: false,
    sizeFit: false,
  });

  const mainCtaRef = useRef<HTMLButtonElement>(null);

  // Stores
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    Boolean(product && state.items.some((p) => p.id === product.id))
  );
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);
  const allRecentlyViewed = useRecentlyViewedStore((state) => state.items);
  const recentlyViewed = React.useMemo(
    () => (product ? allRecentlyViewed.filter((p) => p.id !== product.id).slice(0, 4) : []),
    [allRecentlyViewed, product?.id]
  );

  const lastTrackedProductIdRef = useRef<string | null>(null);

  // Initialize product state & recently viewed
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || null);
      setSelectedSize(product.sizes[0] || 'M');
      setQty(1);
      setActiveImageIdx(0);

      if (lastTrackedProductIdRef.current !== product.id) {
        lastTrackedProductIdRef.current = product.id;
        addRecentlyViewed(product);
      }

      productService.getRelated(product.id, 4).then(setRelatedProducts);
      if (product.variants[0]?.colourName) {
        productService
          .getComplementarySet(product.id, product.variants[0].colourName, 4)
          .then(setCompleteSetProducts);
      }
    }
  }, [product?.id, slug]);

  // Observer for sticky mobile CTA bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMobileBarVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (mainCtaRef.current) {
      observer.observe(mainCtaRef.current);
    }

    return () => observer.disconnect();
  }, [product]);

  // Redirect legacy slugs with style numbers to clean new slugs
  if (slug && OLD_SLUG_MAP[slug]) {
    return <Navigate to={`/product/${OLD_SLUG_MAP[slug]}`} replace />;
  }

  if (!product || !selectedVariant) {
    return <NotFoundPage />;
  }

  const isComingSoon = product.status === 'coming-soon';
  const availableStock = selectedVariant.stockBySize?.[selectedSize] ?? 10;
  const isOutOfStock = availableStock <= 0;

  // Active gallery photos (never render catalog posters with style numbers printed)
  const currentPhotos =
    selectedVariant.images?.length > 0
      ? selectedVariant.images
      : ['/brand/tshirt-silhouette.svg'];

  const activeMainImage = currentPhotos[activeImageIdx] || currentPhotos[0];

  // Cart actions
  const handleAddToCart = () => {
    if (isComingSoon || isOutOfStock) return;

    addItem({
      product,
      variant: selectedVariant,
      size: selectedSize,
      qty,
    });

    addToast({
      type: 'success',
      message: 'Added to your bag. Looking good.',
      actionLabel: 'View Bag',
      onAction: () => openCart(),
    });
  };

  const handleBuyNow = () => {
    if (isComingSoon || isOutOfStock) return;

    addItem({
      product,
      variant: selectedVariant,
      size: selectedSize,
      qty,
    });

    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Ateevibes!`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        message: 'Product link copied to clipboard!',
        duration: 3000,
      });
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyModalOpen(false);
      setNotifySuccess(false);
      setNotifyEmail('');
      addToast({
        type: 'success',
        message: `You're on the list! We'll notify ${notifyEmail} once drops arrive.`,
      });
    }, 1200);
  };

  // Product reviews (genuine customer feedback only)
  const productReviews = REVIEWS_DATA.filter((r) => r.productId === product.id && !r.isSample);

  // Icon mapping for highlights
  const getHighlightIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('breathable')) return <Wind className="w-4 h-4 text-accent-700" />;
    if (lower.includes('lightweight')) return <Feather className="w-4 h-4 text-accent-700" />;
    if (lower.includes('stretch')) return <Activity className="w-4 h-4 text-accent-700" />;
    if (lower.includes('durable') || lower.includes('retention')) return <ShieldCheck className="w-4 h-4 text-accent-700" />;
    if (lower.includes('moisture')) return <Droplets className="w-4 h-4 text-accent-700" />;
    return <Sparkles className="w-4 h-4 text-accent-700" />;
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | ${siteConfig.name}`}</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`${siteConfig.url}/product/${product.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`${siteConfig.url}/product/${product.slug}`} />
        <meta property="og:title" content={`${product.name} | ${siteConfig.name}`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={selectedVariant.images[0] || '/brand/tshirt-silhouette.svg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | ${siteConfig.name}`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={selectedVariant.images[0] || '/brand/tshirt-silhouette.svg'} />
        <script type="application/ld+json">
          {JSON.stringify(generateProductJsonLd(product))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: '/' },
              { name: 'Shop', url: '/shop' },
              { name: product.categoryName, url: `/shop/${product.category}` },
              { name: product.name, url: `/product/${product.slug}` },
            ])
          )}
        </script>
      </Helmet>

      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink-600 flex-wrap">
          <Link to="/" className="hover:text-ink-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-ink-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop/${product.category}`} className="hover:text-ink-900 transition-colors">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-ink-900 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT: Image Gallery (Sticky Desktop) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            {/* Gallery Top Bar (Zoom trigger) */}
            <div className="flex items-center justify-end pb-1">
              <button
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Expand image fullscreen"
                className="p-2 rounded-full bg-surface-tint border border-border text-ink-700 hover:text-ink-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zoom</span>
              </button>
            </div>

            {/* Main Image Frame with hover zoom */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-brand-cream/25 border border-border shadow-soft group cursor-zoom-in"
            >
              <motion.img
                key={`${selectedVariant.id}-${activeImageIdx}`}
                src={activeMainImage}
                srcSet={getProductSrcSet(activeMainImage)}
                sizes={PRODUCT_IMAGE_SIZES}
                alt={`${product.name} view`}
                onError={(e) => {
                  e.currentTarget.srcset = '';
                  e.currentTarget.src = '/brand/tshirt-silhouette.svg';
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                {isComingSoon && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-ink-900 text-brand-cream uppercase tracking-wider">
                    Coming Soon
                  </span>
                )}
                {!isComingSoon && product.badges.includes('Best Seller') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-700 text-white uppercase tracking-wider">
                    Best Seller
                  </span>
                )}
                {!isComingSoon && product.badges.includes('New') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-green text-ink-900 border border-brand-green uppercase tracking-wider">
                    New Drop
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Rail */}
            {currentPhotos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {currentPhotos.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 sm:w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx
                        ? 'border-ink-900 ring-2 ring-ink-900/20 scale-105'
                        : 'border-border/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      srcSet={getProductSrcSet(img)}
                      sizes="80px"
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

          {/* RIGHT: Product Details Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-ink-600">
                <span className="font-bold text-accent-700 uppercase tracking-widest text-[11px]">
                  {product.categoryName} • {product.subCategoryName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    className="p-1.5 rounded-full hover:bg-black/5 text-ink-700 hover:text-ink-900"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const added = toggleWishlist(product);
                      addToast({
                        type: 'info',
                        message: added ? 'Saved to your wishlist' : 'Removed from wishlist',
                      });
                    }}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="p-1.5 rounded-full hover:bg-black/5 text-ink-700 hover:text-ink-900"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist ? 'fill-status-error text-status-error' : 'text-ink-900'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-normal text-ink-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating Review Anchor Link */}
              <div className="flex items-center gap-2 text-xs">
                {product.rating > 0 ? (
                  <a
                    href="#reviews-section"
                    className="flex items-center gap-1.5 font-medium text-ink-700 hover:text-accent-700 transition-colors"
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{product.rating.toFixed(1)}</span>
                    <span className="text-ink-600 underline">({product.reviewCount} reviews)</span>
                  </a>
                ) : (
                  <span className="text-ink-600">No reviews yet</span>
                )}
                <span className="text-ink-600">•</span>
                <span className="text-accent-700 font-semibold uppercase tracking-wider text-[11px]">
                  {product.fabric}
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-bold text-ink-900 tabular-nums">
                  {formatPrice(product.mrp)}
                </span>
                <span className="text-xs text-ink-600 font-medium">Inclusive of all taxes</span>
              </div>

              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Colour Selector */}
            <div className="space-y-3 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink-900 uppercase tracking-wide">Colourway</span>
                <span className="font-semibold text-accent-700">{selectedVariant.colourName}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setActiveImageIdx(0);
                      }}
                      title={v.colourName}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-ink-900 ring-2 ring-ink-900/30 scale-110'
                          : 'border-white hover:scale-105'
                      }`}
                      style={
                        v.patternImage
                          ? { backgroundImage: `url(${v.patternImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                          : { backgroundColor: v.hex }
                      }
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            v.colourSlug === 'white' || v.colourSlug === 'off-white'
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector with Stock Rules */}
            <div className="space-y-3 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink-900 uppercase tracking-wide">Select Size</span>
                  {availableStock <= 5 && availableStock > 0 && (
                    <span className="text-status-warning font-semibold text-[11px] bg-status-warning/10 px-2 py-0.5 rounded-full">
                      Only {availableStock} left
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="text-status-error font-semibold text-[11px] bg-status-error/10 px-2 py-0.5 rounded-full">
                      Sold Out
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-semibold text-accent-700 hover:text-ink-900 underline flex items-center gap-1"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => {
                  const stock = selectedVariant.stockBySize?.[size] ?? 10;
                  const outOfStock = stock <= 0;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-tab-active-bg text-tab-active-text border-tab-active-bg shadow-md scale-[1.02]'
                          : outOfStock
                          ? 'bg-black/5 text-ink-600/40 line-through border-transparent cursor-not-allowed'
                          : 'bg-surface-tint border-border text-ink-900 hover:border-ink-900'
                      }`}
                    >
                      <span className="text-sm">{size}</span>
                      <span className="text-[10px] font-normal opacity-70">
                        {outOfStock ? 'Sold out' : `${stock} in stock`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag / Buy Now / Coming Soon */}
            <div className="space-y-3 pt-2">
              {!isComingSoon ? (
                <>
                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-border rounded-full bg-surface-tint p-1">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        disabled={qty <= 1}
                        className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-ink-900 text-sm font-bold disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-ink-900 tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(Math.min(availableStock, qty + 1))}
                        disabled={qty >= availableStock}
                        className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-ink-900 text-sm font-bold disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      ref={mainCtaRef}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 btn-primary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : `Add to Bag • ${formatPrice(product.mrp * qty)}`}</span>
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full btn-secondary py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 text-accent-700 fill-accent-700" />
                    <span>Buy It Now</span>
                  </button>
                </>
              ) : (
                /* Coming Soon Notify Me */
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full py-3.5 rounded-full bg-black/10 text-ink-600 font-bold text-sm cursor-not-allowed"
                  >
                    Coming Soon — Not Yet Available
                  </button>
                  <button
                    onClick={() => setNotifyModalOpen(true)}
                    className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When In Stock</span>
                  </button>
                </div>
              )}
            </div>

            {/* Pincode Estimator */}
            <PincodeChecker />

            {/* Highlights Icon Chips Row */}
            {product.highlights.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/80">
                <span className="text-xs font-bold text-ink-900 uppercase tracking-wide">
                  Product Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-medium text-ink-900"
                    >
                      {getHighlightIcon(h)}
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Accordions (Description, Fabric & Care, Shipping, Size & Fit) */}
            <div className="border-t border-border/80 divide-y divide-border/60 text-xs sm:text-sm">
              {/* Description */}
              <div className="py-3">
                <button
                  onClick={() => setAccordions((a) => ({ ...a, description: !a.description }))}
                  className="w-full flex items-center justify-between font-bold text-ink-900 uppercase tracking-wider text-xs text-left"
                >
                  <span>Description & Details</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.description ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.description && (
                  <p className="mt-2 text-ink-600 text-xs sm:text-sm leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Fabric & Care */}
              <div className="py-3">
                <button
                  onClick={() => setAccordions((a) => ({ ...a, fabric: !a.fabric }))}
                  className="w-full flex items-center justify-between font-bold text-ink-900 uppercase tracking-wider text-xs text-left"
                >
                  <span>Fabric & Care</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.fabric ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.fabric && (
                  <div className="mt-2 space-y-2 text-xs text-ink-600">
                    <p><strong>Fabric Knit:</strong> {product.fabric}</p>
                    <p><strong>Composition:</strong> to be confirmed</p>
                    <p><strong>Wash Care:</strong> Machine wash cold with like colours. Do not bleach. Tumble dry low or dry flat in shade. Iron inside out on low heat.</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => setAccordions((a) => ({ ...a, shipping: !a.shipping }))}
                  className="w-full flex items-center justify-between font-bold text-ink-900 uppercase tracking-wider text-xs text-left"
                >
                  <span>Shipping & 7-Day Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.shipping ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.shipping && (
                  <div className="mt-2 space-y-1.5 text-xs text-ink-600">
                    <p>• Free standard delivery on all orders over ₹1,499 (otherwise flat ₹79).</p>
                    <p>• Estimated delivery time: 3 to 7 business days across India.</p>
                    <p>• Cash on Delivery (COD) available with a nominal ₹49 handling fee.</p>
                    <p>• Hassle-free 7-day return and exchange window from delivery.</p>
                  </div>
                )}
              </div>

              {/* Size & Fit */}
              <div className="py-3">
                <button
                  onClick={() => setAccordions((a) => ({ ...a, sizeFit: !a.sizeFit }))}
                  className="w-full flex items-center justify-between font-bold text-ink-900 uppercase tracking-wider text-xs text-left"
                >
                  <span>Size & Fit Notes</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.sizeFit ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.sizeFit && (
                  <div className="mt-2 space-y-1.5 text-xs text-ink-600">
                    <p>• Tailored modern regular fit — neither too snug nor oversized.</p>
                    <p>• Models wear Size M (Chest 40"). Fits true to size.</p>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-accent-700 font-bold underline pt-1 block"
                    >
                      Open Full Size Chart Table
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Set Cross-Sell */}
        {completeSetProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-700">
                  Style Coordination
                </span>
                <h3 className="font-display text-2xl font-bold text-ink-900">
                  Complete the Set in {selectedVariant.colourName}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {completeSetProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* You May Also Like Cross-Sell */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-700">
                  Recommended For You
                </span>
                <h3 className="font-display text-2xl font-normal text-ink-900">
                  You May Also Like
                </h3>
              </div>
              <Link to={`/shop/${product.category}`} className="text-xs font-bold text-accent-700 hover:text-ink-900 flex items-center gap-1">
                <span>View category</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Block */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border space-y-6">
            <h3 className="font-display text-2xl font-normal text-ink-900">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div id="reviews-section" className="mt-20 pt-16 border-t border-border space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-700">
                Customer Voices
              </span>
              <h3 className="font-display text-3xl font-normal text-ink-900">
                Customer Reviews
              </h3>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-primary px-6 py-2.5 text-xs font-bold"
            >
              Write a Review
            </button>
          </div>

          {productReviews.length > 0 ? (
            <div className="space-y-4">
              {productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-white border border-border space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-xs text-ink-900">{rev.userName}</span>
                    </div>
                    <span className="text-[11px] text-ink-600">{rev.date}</span>
                  </div>
                  {rev.title && <h4 className="font-bold text-sm text-ink-900">{rev.title}</h4>}
                  <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-tint rounded-3xl p-8 sm:p-12 border border-border text-center space-y-3">
              <p className="font-display text-2xl font-normal text-ink-900">
                Be the First to Review This Garment
              </p>
              <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
                We value authentic customer feedback on fabric touch, silhouette, and drape. Share your experience with the community.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>Write First Review</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals & Overlays */}
        <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        <ProductLightbox
          images={currentPhotos}
          initialIndex={activeImageIdx}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          title={product.name}
        />
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productName={product.name}
        />

        {/* Coming Soon Notify Modal */}
        <AnimatePresence>
          {notifyModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setNotifyModalOpen(false)}
                className="fixed inset-0 bg-ink-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-border z-10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-ink-900">Be the First to Know</h3>
                  <button
                    onClick={() => setNotifyModalOpen(false)}
                    className="p-1 rounded-full text-ink-600 hover:text-ink-900"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-ink-600 leading-relaxed">
                  {product.name} is currently in development. Enter your email and we'll alert you the moment the drop is live.
                </p>

                {notifySuccess ? (
                  <div className="p-3 rounded-2xl bg-brand-green/40 border border-brand-green flex items-center gap-2 text-xs text-ink-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-accent-700" />
                    <span>Notification registered!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="pt-1">
                    <div className="flex items-center w-full bg-surface-tint border border-border focus-within:border-ink-900 rounded-full p-1.5 shadow-sm transition-colors">
                      <input
                        type="email"
                        required
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 min-w-0 bg-transparent pl-4 pr-3 py-2 text-xs sm:text-sm text-ink-900 placeholder:text-ink-600/60 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="btn-primary shrink-0 px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap"
                      >
                        Notify Me
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Sticky Mobile Add-to-Cart Bar */}
        <StickyMobileBar
          product={product}
          selectedVariant={selectedVariant}
          selectedSize={selectedSize}
          isVisible={isMobileBarVisible && !isComingSoon}
          onAddToCart={handleAddToCart}
          disabled={isOutOfStock}
        />
      </div>
    </>
  );
};
