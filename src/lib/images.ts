/**
 * Shared responsive image resolution helper.
 * Maps product image paths (e.g. "/products/500/black.jpg") to their pre-generated
 * responsive WebP sibling variants (-480.webp, -800.webp, -1200.webp).
 */

export interface ResponsiveImageVariants {
  w480: string;
  w800: string;
  w1200: string;
}

export interface ResponsiveImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
}

export const PRODUCT_IMAGE_SIZES = '(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px';

/**
 * Returns the -480, -800, and -1200 WebP sibling paths for a product image,
 * resolving relative to the file's own basename and directory.
 */
export function getResponsiveVariants(imagePath: string | undefined | null): ResponsiveImageVariants | null {
  if (!imagePath || typeof imagePath !== 'string') return null;

  // Match /products/{pno}/{name}.{ext}
  const match = imagePath.match(/^(\/products\/[^/]+)\/([^/]+)\.(jpg|jpeg|png|webp)$/i);
  if (!match) return null;

  const [, dir, name] = match;
  // Ignore swatch images or already size-suffixed variants
  if (name.startsWith('swatch-') || /-(480|800|1200)$/.test(name)) {
    return null;
  }

  return {
    w480: `${dir}/${name}-480.webp`,
    w800: `${dir}/${name}-800.webp`,
    w1200: `${dir}/${name}-1200.webp`,
  };
}

/**
 * Emits a srcset string with 480w, 800w, and 1200w descriptors.
 */
export function getProductSrcSet(imagePath: string | undefined | null): string | undefined {
  const variants = getResponsiveVariants(imagePath);
  if (!variants) return undefined;
  return `${variants.w480} 480w, ${variants.w800} 800w, ${variants.w1200} 1200w`;
}

/**
 * Emits complete { src, srcSet, sizes } props for an <img> element.
 */
export function getResponsiveImageProps(
  imagePath: string | undefined | null,
  sizes: string = PRODUCT_IMAGE_SIZES,
  fallbackSrc: string = '/brand/placeholder.svg'
): ResponsiveImageProps {
  const src = imagePath || fallbackSrc;
  const srcSet = getProductSrcSet(imagePath);
  return {
    src,
    srcSet,
    sizes: srcSet ? sizes : undefined,
  };
}
