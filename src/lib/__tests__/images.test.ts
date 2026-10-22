import { describe, it, expect } from 'vitest';
import {
  getResponsiveVariants,
  getProductSrcSet,
  getResponsiveImageProps,
  PRODUCT_IMAGE_SIZES,
} from '../images';

describe('Responsive Image Resolver (images.ts)', () => {
  it('correctly maps standard product jpg to -480, -800, -1200 webp siblings', () => {
    const variants = getResponsiveVariants('/products/500/black.jpg');
    expect(variants).toEqual({
      w480: '/products/500/black-480.webp',
      w800: '/products/500/black-800.webp',
      w1200: '/products/500/black-1200.webp',
    });
  });

  it('handles alphanumeric product numbers and hyphenated color names', () => {
    const variants = getResponsiveVariants('/products/1700-A/sage-green.jpg');
    expect(variants).toEqual({
      w480: '/products/1700-A/sage-green-480.webp',
      w800: '/products/1700-A/sage-green-800.webp',
      w1200: '/products/1700-A/sage-green-1200.webp',
    });
  });

  it('generates proper srcset string with 480w, 800w, 1200w descriptors', () => {
    const srcSet = getProductSrcSet('/products/1400/white.jpg');
    expect(srcSet).toBe(
      '/products/1400/white-480.webp 480w, /products/1400/white-800.webp 800w, /products/1400/white-1200.webp 1200w'
    );
  });

  it('ignores swatch images', () => {
    expect(getResponsiveVariants('/products/500/swatch-black.jpg')).toBeNull();
    expect(getProductSrcSet('/products/500/swatch-black.jpg')).toBeUndefined();
  });

  it('ignores non-product paths (brand, catalog, etc.)', () => {
    expect(getResponsiveVariants('/brand/tshirt-silhouette.svg')).toBeNull();
    expect(getResponsiveVariants('/catalog/1007-main.webp')).toBeNull();
    expect(getResponsiveVariants(undefined)).toBeNull();
    expect(getResponsiveVariants(null)).toBeNull();
  });

  it('ignores already sized webp variants to avoid recursive resolution', () => {
    expect(getResponsiveVariants('/products/500/black-480.webp')).toBeNull();
    expect(getResponsiveVariants('/products/500/black-800.webp')).toBeNull();
    expect(getResponsiveVariants('/products/500/black-1200.webp')).toBeNull();
  });

  it('getResponsiveImageProps returns full props bundle with custom sizes', () => {
    const props = getResponsiveImageProps('/products/1007/green.jpg', '(max-width: 768px) 100vw, 50vw');
    expect(props.src).toBe('/products/1007/green.jpg');
    expect(props.srcSet).toBe(
      '/products/1007/green-480.webp 480w, /products/1007/green-800.webp 800w, /products/1007/green-1200.webp 1200w'
    );
    expect(props.sizes).toBe('(max-width: 768px) 100vw, 50vw');

    // Default sizes should equal PRODUCT_IMAGE_SIZES
    const defaultProps = getResponsiveImageProps('/products/1007/green.jpg');
    expect(defaultProps.sizes).toBe(PRODUCT_IMAGE_SIZES);
  });

  it('getResponsiveImageProps falls back gracefully when srcSet cannot be computed', () => {
    const props = getResponsiveImageProps('/brand/placeholder.svg');
    expect(props.src).toBe('/brand/placeholder.svg');
    expect(props.srcSet).toBeUndefined();
    expect(props.sizes).toBeUndefined();
  });
});
