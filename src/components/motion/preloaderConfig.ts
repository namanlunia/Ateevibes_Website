import { PRODUCTS } from '../../data/products';
import { getResponsiveVariants } from '../../lib/images';

type PreloaderLayer = 'background' | 'middle' | 'foreground';

export interface PreloaderGarmentConfig {
  id: string;
  slug: string;
  name: string;
  category: string;
  styleDescription: string;
  colorName: string;
  imagePath: string;
  layer: PreloaderLayer;
  size: number;
  xPercent: number;
  delay: number;
  duration: number;
  sway: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  showOnMobile: boolean;
}

interface ProductSeed {
  id: string;
  slug: string;
  variantIndex?: number;
  styleDescription: string;
  layer: PreloaderLayer;
  size: number;
  xPercent: number;
  delay: number;
  duration: number;
  sway: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  showOnMobile: boolean;
}

/**
 * 18 deterministic garments on desktop, 10 on mobile across 3 depth layers:
 * - Desktop: 7 background, 7 middle, 4 foreground
 * - Mobile: 4 background, 4 middle, 2 foreground
 *
 * Spans all catalog categories: round neck, polo and collar, jacquard,
 * printed, tai dai, waffle, matty, and stripe gradient.
 * Staggered across 5 waves so shirts continuously rise throughout the entire load time.
 */
const SEED_GARMENTS: ProductSeed[] = [
  // --- Wave 1 (0.0s - 0.35s) ---
  {
    id: 'garment-1-matty-black',
    slug: 'premium-matty-round-neck',
    variantIndex: 0, // Black
    styleDescription: 'Plain Matty Tee',
    layer: 'foreground',
    size: 215,
    xPercent: 12,
    delay: 0.0,
    duration: 1.9,
    sway: 16,
    rotation: -6,
    opacity: 0.95,
    zIndex: 20,
    showOnMobile: true,
  },
  {
    id: 'garment-2-waffle-beige',
    slug: 'premium-waffle-round-neck',
    variantIndex: 1, // Beige
    styleDescription: 'Waffle Knit',
    layer: 'middle',
    size: 155,
    xPercent: 68,
    delay: 0.1,
    duration: 2.3,
    sway: -18,
    rotation: 5,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: true,
  },
  {
    id: 'garment-3-polo-white',
    slug: 'premium-matty-polo',
    variantIndex: 0, // White
    styleDescription: 'Matty Polo',
    layer: 'background',
    size: 95,
    xPercent: 42,
    delay: 0.2,
    duration: 3.1,
    sway: 14,
    rotation: -4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: true,
  },
  {
    id: 'garment-4-stripe-gradient-pink',
    slug: 'premium-printed-collar-stripe-gradient',
    variantIndex: 0, // Rose Pink
    styleDescription: 'Stripe Gradient Collar',
    layer: 'middle',
    size: 150,
    xPercent: 32,
    delay: 0.35,
    duration: 2.5,
    sway: 20,
    rotation: 7,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: false,
  },

  // --- Wave 2 (0.45s - 0.8s) ---
  {
    id: 'garment-5-jacquard-lemon',
    slug: 'jacquard-half-sleeve',
    variantIndex: 4, // Lemon
    styleDescription: 'Jacquard Knit',
    layer: 'background',
    size: 100,
    xPercent: 85,
    delay: 0.45,
    duration: 2.9,
    sway: -15,
    rotation: -5,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: true,
  },
  {
    id: 'garment-6-tai-dai-gold',
    slug: 'tai-dai-print-half-sleeve',
    variantIndex: 0, // R.Gold
    styleDescription: 'Tai Dai Print',
    layer: 'foreground',
    size: 205,
    xPercent: 76,
    delay: 0.55,
    duration: 2.0,
    sway: 18,
    rotation: 6,
    opacity: 0.95,
    zIndex: 20,
    showOnMobile: false,
  },
  {
    id: 'garment-7-twoway-wine',
    slug: 'two-way-round-neck',
    variantIndex: 2, // Wine
    styleDescription: '2-Way Round Neck',
    layer: 'middle',
    size: 145,
    xPercent: 6,
    delay: 0.68,
    duration: 2.4,
    sway: -22,
    rotation: -6,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: true,
  },
  {
    id: 'garment-8-tencil-green',
    slug: 'imported-tencil-round-neck',
    variantIndex: 1, // Bottle Green
    styleDescription: 'Imported Tencil Tee',
    layer: 'background',
    size: 90,
    xPercent: 28,
    delay: 0.8,
    duration: 3.2,
    sway: 12,
    rotation: 4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: false,
  },

  // --- Wave 3 (0.95s - 1.3s) ---
  {
    id: 'garment-9-royal-jacquard-lavender',
    slug: 'royal-print-jacquard-half-sleeve',
    variantIndex: 2, // Lavender
    styleDescription: 'Royal Print Jacquard',
    layer: 'foreground',
    size: 220,
    xPercent: 88,
    delay: 0.95,
    duration: 1.9,
    sway: -17,
    rotation: -7,
    opacity: 0.95,
    zIndex: 20,
    showOnMobile: true,
  },
  {
    id: 'garment-10-printed-round-design1',
    slug: 'premium-printed-round-neck',
    variantIndex: 0, // Design 01
    styleDescription: 'Printed Round Neck',
    layer: 'middle',
    size: 160,
    xPercent: 46,
    delay: 1.05,
    duration: 2.6,
    sway: 19,
    rotation: 5,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: true,
  },
  {
    id: 'garment-11-polo-jacquard-mint',
    slug: 'jacquard-half-sleeve-polo',
    variantIndex: 1, // Mint Green
    styleDescription: 'Jacquard Polo',
    layer: 'background',
    size: 105,
    xPercent: 15,
    delay: 1.15,
    duration: 3.0,
    sway: -14,
    rotation: -4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: true,
  },
  {
    id: 'garment-12-matty-red',
    slug: 'premium-matty-round-neck',
    variantIndex: 4, // Jalapeno Red
    styleDescription: 'Premium Matty Red',
    layer: 'middle',
    size: 140,
    xPercent: 82,
    delay: 1.3,
    duration: 2.3,
    sway: 16,
    rotation: 6,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: true,
  },

  // --- Wave 4 (1.45s - 1.8s) ---
  {
    id: 'garment-13-abstract-collar-design1',
    slug: 'premium-printed-collar-abstract',
    variantIndex: 0, // Design 01
    styleDescription: 'Abstract Collar Polo',
    layer: 'background',
    size: 95,
    xPercent: 72,
    delay: 1.45,
    duration: 3.3,
    sway: -21,
    rotation: -5,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: true,
  },
  {
    id: 'garment-14-waffle-aqua',
    slug: 'premium-waffle-round-neck',
    variantIndex: 3, // Aqua
    styleDescription: 'Aqua Waffle Knit',
    layer: 'foreground',
    size: 210,
    xPercent: 24,
    delay: 1.55,
    duration: 2.1,
    sway: 15,
    rotation: 7,
    opacity: 0.95,
    zIndex: 20,
    showOnMobile: false,
  },
  {
    id: 'garment-15-jacquard-full-rust',
    slug: 'jacquard-full-sleeve',
    variantIndex: 0, // Rust
    styleDescription: 'Jacquard Full Sleeve',
    layer: 'middle',
    size: 165,
    xPercent: 54,
    delay: 1.68,
    duration: 2.5,
    sway: -18,
    rotation: -6,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: false,
  },
  {
    id: 'garment-16-royal-full-green',
    slug: 'royal-print-jacquard-full-sleeve',
    variantIndex: 0, // Green
    styleDescription: 'Royal Print Full Sleeve',
    layer: 'background',
    size: 85,
    xPercent: 58,
    delay: 1.8,
    duration: 2.8,
    sway: 13,
    rotation: 4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: false,
  },

  // --- Wave 5 (1.95s - 2.15s) ---
  {
    id: 'garment-17-tai-dai-choco',
    slug: 'tai-dai-print-full-sleeve',
    variantIndex: 4, // Choco
    styleDescription: 'Tai Dai Full Sleeve',
    layer: 'middle',
    size: 135,
    xPercent: 18,
    delay: 1.95,
    duration: 2.4,
    sway: 23,
    rotation: 6,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: false,
  },
  {
    id: 'garment-18-royal-half-green',
    slug: 'royal-print-jacquard-half-sleeve',
    variantIndex: 0, // Green
    styleDescription: 'Royal Print Half Sleeve',
    layer: 'background',
    size: 110,
    xPercent: 36,
    delay: 2.15,
    duration: 3.1,
    sway: -16,
    rotation: -4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: false,
  },
];

/**
 * Builds the deterministic list of 18 preloader garments by resolving active products
 * from data/products.ts and their smallest responsive webp asset (-480.webp).
 */
export function buildPreloaderGarments(): PreloaderGarmentConfig[] {
  return SEED_GARMENTS.map((seed) => {
    const product = PRODUCTS.find((p) => p.slug === seed.slug && p.status !== 'coming-soon');
    if (!product) {
      throw new Error(`Preloader target product not found or not active: ${seed.slug}`);
    }

    const targetVariant = product.variants[seed.variantIndex ?? 0];
    if (!targetVariant || !targetVariant.images[0]) {
      throw new Error(`Preloader target product missing variant image: ${seed.slug}`);
    }

    const variants = getResponsiveVariants(targetVariant.images[0]);
    if (!variants?.w480) {
      throw new Error(`Preloader target image missing 480w webp variant: ${targetVariant.images[0]}`);
    }

    return {
      id: seed.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      styleDescription: seed.styleDescription,
      colorName: targetVariant.colourName,
      imagePath: variants.w480,
      layer: seed.layer,
      size: seed.size,
      xPercent: seed.xPercent,
      delay: seed.delay,
      duration: seed.duration,
      sway: seed.sway,
      rotation: seed.rotation,
      opacity: seed.opacity,
      zIndex: seed.zIndex,
      showOnMobile: seed.showOnMobile,
    };
  });
}

export const PRELOADER_GARMENTS: PreloaderGarmentConfig[] = buildPreloaderGarments();
export const PRELOADER_MOBILE_GARMENTS: PreloaderGarmentConfig[] = PRELOADER_GARMENTS.filter((g) => g.showOnMobile);

export const PRELOADER_TIMING = {
  MIN_DURATION_MS: 1800,
  MAX_DURATION_MS: 3200,
  MIN_REDUCED_MOTION_MS: 600,
  FADE_OUT_MS: 400,
} as const;
