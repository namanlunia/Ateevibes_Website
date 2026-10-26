import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ColourSwatch } from '../components/product/ColourSwatch';
import { ProductCard } from '../components/product/ProductCard';
import { ProductPage } from '../pages/ProductPage';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { useUIStore } from '../store/uiStore';
import { PRODUCTS } from '../data/products';
import { Variant } from '../types';

describe('ColourSwatch Component & Swatch Interactions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const testVariants: Variant[] = [
    {
      id: 'var-1',
      colourName: 'Black',
      colourSlug: 'black',
      hex: '#111111',
      images: ['/products/500/black.jpg'],
      stockBySize: { M: 5, L: 4, XL: 2 },
    },
    {
      id: 'var-2',
      colourName: 'White',
      colourSlug: 'white',
      hex: '#FFFFFF',
      images: ['/products/500/white.jpg'],
      stockBySize: { M: 3, L: 0, XL: 2 },
    },
    {
      id: 'var-3',
      colourName: 'Mint Green',
      colourSlug: 'mint-green',
      hex: '#8FD1B0',
      patternImage: '/products/105/swatch-mint-green.jpg',
      images: ['/products/105/mint-green.jpg'],
      stockBySize: { M: 4, L: 2, XL: 1 },
    },
    {
      id: 'var-4',
      colourName: 'Navy',
      colourSlug: 'navy',
      hex: '#1B2A4A',
      images: ['/products/500/navy.jpg'],
      stockBySize: { M: 2, L: 5, XL: 3 },
    },
    {
      id: 'var-5',
      colourName: 'Wine',
      colourSlug: 'wine',
      hex: '#5A1F2E',
      images: ['/products/500/wine.jpg'],
      stockBySize: { M: 4, L: 1, XL: 0 },
    },
    {
      id: 'var-6',
      colourName: 'Rust',
      colourSlug: 'rust',
      hex: '#9C3B1E',
      images: ['/products/500/rust.jpg'],
      stockBySize: { M: 3, L: 3, XL: 2 },
    },
  ];

  it('renders radiogroup with role="radiogroup" and role="radio" with aria-checked', () => {
    const handleSelect = vi.fn();
    render(
      <ColourSwatch
        variants={testVariants}
        selectedVariantId="var-1"
        onSelect={handleSelect}
      />
    );

    const group = screen.getByRole('radiogroup', { name: /colour/i });
    expect(group).toBeInTheDocument();

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(testVariants.length);

    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[0]).toHaveAttribute('aria-label', 'Colour: Black');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
  });

  it('renders solid background or pattern thumbnail cover with inset shadow', () => {
    render(
      <ColourSwatch
        variants={testVariants}
        selectedVariantId="var-1"
        onSelect={() => {}}
      />
    );

    const radios = screen.getAllByRole('radio');
    // Solid colour
    expect(radios[0].style.backgroundColor).toBe('rgb(17, 17, 17)');
    expect(radios[0].style.boxShadow).toContain('inset 0 0 0 1px rgba(0, 0, 0, 0.28)');

    // Pattern swatch thumb
    expect(radios[2].style.backgroundImage).toContain('/products/105/swatch-mint-green.jpg');
    expect(radios[2].style.backgroundSize).toBe('cover');
  });

  it('supports keyboard navigation: ArrowRight/Left, Home, End, and Enter/Space', () => {
    const handleSelect = vi.fn();
    render(
      <ColourSwatch
        variants={testVariants}
        selectedVariantId="var-1"
        onSelect={handleSelect}
      />
    );

    const group = screen.getByRole('radiogroup', { name: /colour/i });

    // ArrowRight selects next
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(handleSelect).toHaveBeenCalledWith(testVariants[1]);

    // End selects last
    fireEvent.keyDown(group, { key: 'End' });
    expect(handleSelect).toHaveBeenCalledWith(testVariants[testVariants.length - 1]);

    // Home selects first
    fireEvent.keyDown(group, { key: 'Home' });
    expect(handleSelect).toHaveBeenCalledWith(testVariants[0]);

    // Space selects current
    fireEvent.keyDown(group, { key: ' ' });
    expect(handleSelect).toHaveBeenCalledWith(testVariants[0]);
  });

  it('limits to maxVisible swatches and expands inline on clicking +N button', () => {
    const handleSelect = vi.fn();
    render(
      <ColourSwatch
        variants={testVariants}
        selectedVariantId="var-1"
        onSelect={handleSelect}
        maxVisible={5}
      />
    );

    let radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);

    const expandBtn = screen.getByRole('button', { name: /more colourways/i });
    expect(expandBtn).toHaveTextContent('+1');

    fireEvent.click(expandBtn);

    radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(6);
    expect(screen.queryByRole('button', { name: /more colourways/i })).toBeNull();
  });

  it('ProductCard: clicking swatch changes displayed image src, link href gains ?colour=<slug>, exactly one selected, hover reverts', () => {
    const product = PRODUCTS[0]; // PNO 500, has 9 variants
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    const cardLinks = screen.getAllByRole('link');
    // Initially first variant
    expect(cardLinks[0]).toHaveAttribute('href', `/product/${product.slug}?colour=${product.variants[0].colourSlug}`);

    const swatches = screen.getAllByRole('radio');
    const checkedSwatches = swatches.filter((s) => s.getAttribute('aria-checked') === 'true');
    expect(checkedSwatches).toHaveLength(1);

    // Click second swatch (blue)
    const secondVariant = product.variants[1];
    fireEvent.click(swatches[1]);

    // Link href updated
    expect(cardLinks[0]).toHaveAttribute('href', `/product/${product.slug}?colour=${secondVariant.colourSlug}`);

    // Main image src matches second variant
    const img = screen.getByAltText(`${product.name} - ${secondVariant.colourName}`);
    expect(img).toHaveAttribute('src', secondVariant.images[0]);

    // Hover third swatch previews image
    const thirdVariant = product.variants[2];
    fireEvent.mouseEnter(swatches[2]);
    const previewImg = screen.getByAltText(`${product.name} - ${thirdVariant.colourName}`);
    expect(previewImg).toHaveAttribute('src', thirdVariant.images[0]);

    // Mouse leave reverts to selected second variant
    const cardContainer = cardLinks[0].closest('.product-card-container')!;
    fireEvent.mouseLeave(cardContainer);
    const revertedImg = screen.getByAltText(`${product.name} - ${secondVariant.colourName}`);
    expect(revertedImg).toHaveAttribute('src', secondVariant.images[0]);
  });

  it('ProductPage: ?colour preselects valid variant and falls back to first on invalid', () => {
    const product = PRODUCTS[0];
    const secondVariant = product.variants[1];

    const { unmount } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`/product/${product.slug}?colour=${secondVariant.colourSlug}`]}>
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(secondVariant.colourName)).toBeInTheDocument();
    unmount();

    // Fallback on invalid colour param
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`/product/${product.slug}?colour=non-existent-colour`]}>
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(product.variants[0].colourName)).toBeInTheDocument();
  });

  it('ProductPage: switching colour keeps in-stock size or clears with inline note', () => {
    const product = PRODUCTS[0];
    const var0 = product.variants[0];
    const var1 = product.variants[1];
    var1.stockBySize = { ...(var1.stockBySize || {}), L: 0 };

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`/product/${product.slug}?colour=${var0.colourSlug}`]}>
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    // Select size L
    const sizeLBtn = screen.getByRole('radio', { name: /size l/i });
    fireEvent.click(sizeLBtn);
    expect(sizeLBtn).toHaveAttribute('aria-checked', 'true');

    // Switch to variant 1 (which has 0 stock in L)
    const swatches = screen.getAllByRole('radio', { name: /^colour:/i });
    fireEvent.click(swatches[1]);

    // Size L is cleared and inline note is displayed
    expect(screen.getByRole('alert')).toHaveTextContent(/size L is sold out/i);
    expect(screen.getByRole('button', { name: /select a size/i })).toBeDisabled();
  });

  it('QuickViewModal: opens with card selected variant', () => {
    const product = PRODUCTS[0];
    const secondVariant = product.variants[1];

    useUIStore.getState().openQuickView(product, secondVariant);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <QuickViewModal />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(secondVariant.colourName)).toBeInTheDocument();
    const swatches = screen.getAllByRole('radio', { name: /^colour:/i });
    expect(swatches[1]).toHaveAttribute('aria-checked', 'true');
  });
});
