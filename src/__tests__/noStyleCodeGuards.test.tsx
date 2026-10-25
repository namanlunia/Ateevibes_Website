import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SearchOverlay } from '../components/layout/SearchOverlay';
import { MegaMenu } from '../components/layout/MegaMenu';
import { Footer } from '../components/layout/Footer';
import { CookieNotice } from '../components/layout/CookieNotice';
import { useCartStore } from '../store/cartStore';
import { PRODUCTS } from '../data/products';

const NO_PNO_REGEX = /P\.?\s*NO\b/i;
const NO_STYLE_CODE_REGEX = /style\s*(code)?\s*[:#-]?\s*\d{3,4}/i;

describe('Style Code and P.NO Removal Guards (Section 6 & 7)', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  const renderWithProviders = (ui: React.ReactElement, initialPath = '/') => {
    return render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          {ui}
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  it('asserts Home page renders with no match for P.NO or style codes across all slides', async () => {
    const { container } = renderWithProviders(<HomePage />);

    // Wait for the featured silhouette showcase carousel to mount
    await waitFor(() => {
      const carousel = container.querySelector(
        '[aria-roledescription="carousel"][aria-label*="Featured Silhouette"]'
      );
      expect(carousel).not.toBeNull();
    });

    const showcase = container.querySelector(
      '[aria-roledescription="carousel"][aria-label*="Featured Silhouette"]'
    );
    expect(showcase).not.toBeNull();

    // Check full page text content
    const fullText = container.textContent || '';
    expect(fullText).not.toMatch(NO_PNO_REGEX);
    expect(fullText).not.toMatch(NO_STYLE_CODE_REGEX);

    // Click through each slide in the featured showcase and assert no P.NO or style codes
    const nextBtn = showcase?.querySelector('button[aria-label="Next slide"]');
    if (nextBtn) {
      for (let i = 0; i < 6; i++) {
        fireEvent.click(nextBtn);
        const slideText = showcase?.textContent || '';
        expect(slideText).not.toMatch(NO_PNO_REGEX);
        expect(slideText).not.toMatch(NO_STYLE_CODE_REGEX);
      }
    }
  });

  it('asserts Shop page renders with no match for P.NO or style codes', async () => {
    const { container } = renderWithProviders(<ShopPage />, '/shop');
    const text = container.textContent || '';
    expect(text).not.toMatch(NO_PNO_REGEX);
    expect(text).not.toMatch(NO_STYLE_CODE_REGEX);
  });

  it('asserts Product page renders with no match for P.NO or style codes', async () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/product/:slug" element={<ProductPage />} />
      </Routes>,
      '/product/royal-print-jacquard-full-sleeve'
    );
    const text = container.textContent || '';
    expect(text).not.toMatch(NO_PNO_REGEX);
    expect(text).not.toMatch(NO_STYLE_CODE_REGEX);
  });

  it('asserts Cart page renders with no match for P.NO or style codes', async () => {
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: 'M',
      qty: 1,
    });

    const { container } = renderWithProviders(<CartPage />, '/cart');
    const text = container.textContent || '';
    expect(text).not.toMatch(NO_PNO_REGEX);
    expect(text).not.toMatch(NO_STYLE_CODE_REGEX);
  });

  it('asserts Checkout page renders with no match for P.NO or style codes', async () => {
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: 'M',
      qty: 1,
    });

    const { container } = renderWithProviders(<CheckoutPage />, '/checkout');
    const text = container.textContent || '';
    expect(text).not.toMatch(NO_PNO_REGEX);
    expect(text).not.toMatch(NO_STYLE_CODE_REGEX);
  });

  it('asserts Search overlay renders with no match for P.NO or style codes', async () => {
    const { container } = renderWithProviders(
      <SearchOverlay isOpen={true} onClose={() => {}} />
    );
    const text = container.textContent || '';
    expect(text).not.toMatch(NO_PNO_REGEX);
    expect(text).not.toMatch(NO_STYLE_CODE_REGEX);
  });

  it('asserts MegaMenu uses centered positioning and has no P.NO badge', () => {
    const { container } = renderWithProviders(
      <MegaMenu isOpen={true} onClose={() => {}} />
    );
    const wrapper = container.querySelector('[style*="translateX(-50%)"]');
    expect(wrapper).not.toBeNull();
    const text = container.textContent || '';
    expect(text).not.toMatch(NO_PNO_REGEX);
    expect(text).not.toMatch(NO_STYLE_CODE_REGEX);
  });

  it('asserts Footer and Search overlay use flex pill containers for inputs with buttons', () => {
    const footer = renderWithProviders(<Footer />);
    const footerForm = footer.container.querySelector('form');
    expect(footerForm).not.toBeNull();
    const footerPill = footer.container.querySelector('.rounded-full.flex');
    expect(footerPill).not.toBeNull();

    const search = renderWithProviders(<SearchOverlay isOpen={true} onClose={() => {}} />);
    const searchPill = search.container.querySelector('.rounded-full.flex');
    expect(searchPill).not.toBeNull();
  });

  it('asserts Cookie banner Got it button uses the required centering classes', () => {
    const { container } = renderWithProviders(<CookieNotice />);
    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.className).toContain('inline-flex');
    expect(button?.className).toContain('items-center');
    expect(button?.className).toContain('justify-center');
    expect(button?.className).toContain('text-center');
    expect(button?.className).toContain('px-6');
    expect(button?.className).toContain('py-3');
    expect(button?.className).toContain('min-w-[96px]');
    expect(button?.className).toContain('leading-none');
  });
});
