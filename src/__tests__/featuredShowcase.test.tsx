import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PRODUCTS } from '../data/products';
import {
  FEATURED_SHOWCASE_CONFIG,
  resolveFeaturedSlides,
} from '../data/featuredShowcase';
import { HomePage } from '../pages/HomePage';
import { useCartStore } from '../store/cartStore';

const NO_PNO_REGEX = /P\.?\s*NO\b/i;
const NO_STYLE_CODE_REGEX = /style\s*(code)?\s*[:#-]?\s*\d{3,4}/i;

const FORBIDDEN_WORDS = [
  'flagship',
  'icon',
  'four-way',
  'engineered',
  'made in india',
  'pre-shrunk',
];

describe('Featured Showcase Data & Style Code Guards', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  describe('Showcase Copy & Data Rules', () => {
    it('ensures each showcase description is at most 140 characters', () => {
      FEATURED_SHOWCASE_CONFIG.forEach((item) => {
        expect(
          item.description.length,
          `"${item.productName}" description exceeds 140 chars (${item.description.length})`
        ).toBeLessThanOrEqual(140);
      });
    });

    it('ensures no description contains forbidden claims', () => {
      FEATURED_SHOWCASE_CONFIG.forEach((item) => {
        const lowerDesc = item.description.toLowerCase();
        FORBIDDEN_WORDS.forEach((forbidden) => {
          expect(
            lowerDesc,
            `"${item.productName}" contains forbidden word: "${forbidden}"`
          ).not.toContain(forbidden);
        });
      });
    });

    it('resolves exactly 6 active products with valid pricing, real slug, and at least one image', () => {
      const slides = resolveFeaturedSlides(PRODUCTS);
      expect(slides.length).toBe(6);

      slides.forEach((slide) => {
        expect(slide.product.status).toBe('active');
        expect(slide.mrp).toBeGreaterThan(0);
        expect(slide.slug).toBeTruthy();
        expect(slide.image).toBeTruthy();
        expect(slide.swatches.length).toBeGreaterThan(0);
        expect(slide.swatches.length).toBeLessThanOrEqual(5);

        // Never contain P.NO or style codes in slide text
        expect(slide.name).not.toMatch(NO_PNO_REGEX);
        expect(slide.name).not.toMatch(NO_STYLE_CODE_REGEX);
        expect(slide.description).not.toMatch(NO_PNO_REGEX);
        expect(slide.description).not.toMatch(NO_STYLE_CODE_REGEX);
        expect(slide.fabricLine).not.toMatch(NO_PNO_REGEX);
        expect(slide.fabricLine).not.toMatch(NO_STYLE_CODE_REGEX);
      });
    });
  });

  describe('Full HomePage Featured Card & Slides Style Code Guard', () => {
    const renderHomePage = () => {
      return render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/']}>
            <HomePage />
          </MemoryRouter>
        </HelmetProvider>
      );
    };

    it('renders the HomePage, waits for the featured showcase and asserts no P.NO or style code', async () => {
      const { container } = renderHomePage();

      // Wait for featured showcase region to appear in DOM after async products load
      await waitFor(() => {
        const featuredRegion = container.querySelector(
          '[aria-roledescription="carousel"][aria-label*="Featured Silhouette"]'
        );
        expect(featuredRegion).not.toBeNull();
      });

      const featuredSection = container.querySelector(
        '[aria-roledescription="carousel"][aria-label*="Featured Silhouette"]'
      );
      expect(featuredSection).not.toBeNull();

      // Assert current rendered text has zero P.NO or style code matches
      const text = featuredSection?.textContent || '';
      expect(text).not.toMatch(NO_PNO_REGEX);
      expect(text).not.toMatch(NO_STYLE_CODE_REGEX);

      // Verify all slides in resolved showcase data have zero P.NO or style codes
      const slides = resolveFeaturedSlides(PRODUCTS);
      slides.forEach((slide) => {
        const slideText = `${slide.name} ${slide.description} ${slide.categoryLabel} ${slide.fabricLine}`;
        expect(slideText).not.toMatch(NO_PNO_REGEX);
        expect(slideText).not.toMatch(NO_STYLE_CODE_REGEX);
      });
    });
  });
});
