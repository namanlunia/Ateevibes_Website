import { Product } from '../types';

export interface ShowcaseItemConfig {
  productName: string;
  description: string;
  fabricLine: string;
}

export interface FeaturedSlide {
  product: Product;
  name: string;
  slug: string;
  description: string;
  categoryLabel: string;
  fabricLine: string;
  image: string;
  mrp: number;
  swatches: {
    id: string;
    colourName: string;
    hex: string;
    patternImage?: string;
  }[];
  tintColor: string;
}

export const FEATURED_SHOWCASE_CONFIG: readonly ShowcaseItemConfig[] = [
  {
    productName: 'Royal Print Jacquard Full Sleeve T-Shirt',
    description:
      'China jacquard fabric with a bold royal print. Breathable, lightweight, durable and stretchable, with a modern fit.',
    fabricLine: 'CHINA JACQUARD · FULL SLEEVE',
  },
  {
    productName: 'Tai Dai Print Full Sleeve T-Shirt',
    description:
      'A soft, comfortable tai dai print in five shades. Breathable, lightweight, durable and stretchable.',
    fabricLine: 'TAI DAI · FULL SLEEVE',
  },
  {
    productName: 'Jacquard Half Sleeve Polo T-Shirt',
    description:
      'Jacquard weave with a refined texture. Breathable, soft and comfortable for all-day wear.',
    fabricLine: 'JACQUARD · HALF SLEEVE POLO',
  },
  {
    productName: 'Premium Printed Collar T-Shirt, Stripe Gradient',
    description:
      'Bright, long-lasting printed stripes on skin-friendly fabric. A perfect fit that stays comfortable all day.',
    fabricLine: 'PRINTED COLLAR · HALF SLEEVE',
  },
  {
    productName: 'Premium Waffle Round Neck T-Shirt',
    description:
      'Waffle texture in a breathable, comfortable round neck tee. Perfect for every occasion.',
    fabricLine: 'PREMIUM WAFFLE · ROUND NECK',
  },
  {
    productName: 'Premium Matty Polo T-Shirt',
    description:
      'Ultra soft matty fabric that is breathable and comfortable all day, in a classic polo.',
    fabricLine: 'PIQUE MATTY · POLO',
  },
];

/**
 * Resolves curated showcase config against live or offline product catalog.
 * Skips coming-soon, archived or missing products.
 * Uses real product slug and live variants/pricing.
 */
export function resolveFeaturedSlides(products: Product[]): FeaturedSlide[] {
  if (!Array.isArray(products) || products.length === 0) return [];

  const slides: FeaturedSlide[] = [];

  for (const item of FEATURED_SHOWCASE_CONFIG) {
    const targetName = item.productName.trim().toLowerCase();
    const product = products.find(
      (p) => p.name.trim().toLowerCase() === targetName
    );

    // Skip missing, archived, or coming-soon
    if (!product || product.status !== 'active') {
      continue;
    }

    const firstVariant = product.variants?.[0];
    const image =
      firstVariant?.images?.[0] || '/brand/tshirt-silhouette.svg';
    const swatches = (product.variants || []).slice(0, 5).map((v) => ({
      id: v.id,
      colourName: v.colourName,
      hex: v.hex,
      patternImage: v.patternImage,
    }));

    slides.push({
      product,
      name: product.name,
      slug: product.slug,
      description: item.description,
      categoryLabel: (product.categoryName || 'EXCLUSIVE DROP').toUpperCase(),
      fabricLine: item.fabricLine,
      image,
      mrp: product.mrp,
      swatches,
      tintColor: firstVariant?.hex || '#C9A45C',
    });
  }

  return slides;
}
