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

const SEED_GARMENTS: ProductSeed[] = [
  // 1. Plain Tee / Matty Solid (Foreground, left)
  {
    id: 'garment-plain-tee',
    slug: 'premium-matty-round-neck',
    styleDescription: 'Plain Tee',
    layer: 'foreground',
    size: 215,
    xPercent: 12,
    delay: 0.0,
    duration: 2.0,
    sway: 16,
    rotation: -6,
    opacity: 0.95,
    zIndex: 20,
    showOnMobile: true,
  },
  // 2. Waffle Knit (Middle, right)
  {
    id: 'garment-waffle',
    slug: 'premium-waffle-round-neck',
    styleDescription: 'Waffle',
    layer: 'middle',
    size: 150,
    xPercent: 78,
    delay: 0.2,
    duration: 2.4,
    sway: 20,
    rotation: 5,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: true,
  },
  // 3. Polo Collar (Background, inner-left)
  {
    id: 'garment-polo',
    slug: 'premium-matty-polo',
    styleDescription: 'Polo',
    layer: 'background',
    size: 95,
    xPercent: 28,
    delay: 0.45,
    duration: 3.0,
    sway: 14,
    rotation: -4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: true,
  },
  // 4. Stripe Gradient (Middle, mid-left)
  {
    id: 'garment-stripe-gradient',
    slug: 'premium-printed-collar-stripe-gradient',
    styleDescription: 'Stripe Gradient',
    layer: 'middle',
    size: 160,
    xPercent: 22,
    delay: 0.7,
    duration: 2.5,
    sway: 18,
    rotation: 7,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: true,
  },
  // 5. China Jacquard (Background, inner-right)
  {
    id: 'garment-jacquard',
    slug: 'jacquard-half-sleeve',
    styleDescription: 'Jacquard',
    layer: 'background',
    size: 100,
    xPercent: 68,
    delay: 0.95,
    duration: 3.1,
    sway: 22,
    rotation: -7,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: true,
  },
  // 6. Tai Dai Print (Foreground, far-right)
  {
    id: 'garment-tai-dai',
    slug: 'tai-dai-print-half-sleeve',
    styleDescription: 'Tai Dai',
    layer: 'foreground',
    size: 205,
    xPercent: 84,
    delay: 1.2,
    duration: 1.9,
    sway: 15,
    rotation: 6,
    opacity: 0.95,
    zIndex: 20,
    showOnMobile: false,
  },
  // 7. Graphic Printed (Middle, far-left)
  {
    id: 'garment-printed',
    slug: 'premium-printed-round-neck',
    styleDescription: 'Printed',
    layer: 'middle',
    size: 140,
    xPercent: 8,
    delay: 1.45,
    duration: 2.3,
    sway: 18,
    rotation: -5,
    opacity: 0.65,
    zIndex: 15,
    showOnMobile: false,
  },
  // 8. Royal Print Jacquard (Background, mid-right)
  {
    id: 'garment-royal-jacquard',
    slug: 'royal-print-jacquard-half-sleeve',
    styleDescription: 'Royal Print Jacquard',
    layer: 'background',
    size: 90,
    xPercent: 60,
    delay: 1.65,
    duration: 2.9,
    sway: 12,
    rotation: 4,
    opacity: 0.35,
    zIndex: 10,
    showOnMobile: false,
  },
];

/**
 * Builds the deterministic list of 8 preloader garments by resolving active products
 * from data/products.ts and their smallest responsive webp asset (-480.webp).
 */
export function buildPreloaderGarments(): PreloaderGarmentConfig[] {
  return SEED_GARMENTS.map((seed) => {
    const product = PRODUCTS.find((p) => p.slug === seed.slug && p.status !== 'coming-soon');
    if (!product) {
      throw new Error(`Preloader target product not found or not active: ${seed.slug}`);
    }

    const firstVariant = product.variants[0];
    if (!firstVariant || !firstVariant.images[0]) {
      throw new Error(`Preloader target product missing first variant image: ${seed.slug}`);
    }

    const variants = getResponsiveVariants(firstVariant.images[0]);
    if (!variants?.w480) {
      throw new Error(`Preloader target image missing 480w webp variant: ${firstVariant.images[0]}`);
    }

    return {
      id: seed.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      styleDescription: seed.styleDescription,
      colorName: firstVariant.colourName,
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
