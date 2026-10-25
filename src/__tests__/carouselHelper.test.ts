import { describe, it, expect } from 'vitest';
import {
  getPerView,
  getPageCount,
  getPageScrollLeft,
  getCurrentPage,
} from '../lib/carouselHelper';

describe('carouselHelper', () => {
  describe('getPerView', () => {
    it('returns 4 for widths >= 1280px', () => {
      expect(getPerView(1280)).toBe(4);
      expect(getPerView(1440)).toBe(4);
      expect(getPerView(1920)).toBe(4);
    });

    it('returns 3 for widths from 1024px to 1279px', () => {
      expect(getPerView(1024)).toBe(3);
      expect(getPerView(1100)).toBe(3);
      expect(getPerView(1279)).toBe(3);
    });

    it('returns 2 for widths from 640px to 1023px', () => {
      expect(getPerView(640)).toBe(2);
      expect(getPerView(768)).toBe(2);
      expect(getPerView(1023)).toBe(2);
    });

    it('returns 1 for widths below 640px', () => {
      expect(getPerView(639)).toBe(1);
      expect(getPerView(480)).toBe(1);
      expect(getPerView(320)).toBe(1);
    });
  });

  describe('getPageCount', () => {
    it('handles single page scenarios', () => {
      expect(getPageCount(4, 4)).toBe(1);
      expect(getPageCount(3, 4)).toBe(1);
      expect(getPageCount(1, 1)).toBe(1);
    });

    it('handles multi-page with exact divisor', () => {
      expect(getPageCount(8, 4)).toBe(2);
      expect(getPageCount(6, 3)).toBe(2);
      expect(getPageCount(6, 2)).toBe(3);
    });

    it('handles last partial page', () => {
      expect(getPageCount(7, 4)).toBe(2);
      expect(getPageCount(5, 3)).toBe(2);
      expect(getPageCount(7, 3)).toBe(3);
      expect(getPageCount(9, 4)).toBe(3);
    });

    it('handles empty or zero items gracefully', () => {
      expect(getPageCount(0, 4)).toBe(0);
      expect(getPageCount(5, 0)).toBe(0);
    });
  });

  describe('getPageScrollLeft', () => {
    const cardWidth = 280;
    const gap = 24;

    it('returns 0 for page 0 or negative pages', () => {
      expect(getPageScrollLeft(0, cardWidth, gap, 4)).toBe(0);
      expect(getPageScrollLeft(-1, cardWidth, gap, 4)).toBe(0);
    });

    it('calculates exact scrollLeft for subsequent pages based on perView * (cardWidth + gap)', () => {
      // 1 card step = 304px. For perView = 4, page step = 4 * 304 = 1216px
      expect(getPageScrollLeft(1, cardWidth, gap, 4)).toBe(1216);
      expect(getPageScrollLeft(2, cardWidth, gap, 4)).toBe(2432);

      // For perView = 2, page step = 2 * 304 = 608px
      expect(getPageScrollLeft(1, cardWidth, gap, 2)).toBe(608);
      expect(getPageScrollLeft(2, cardWidth, gap, 2)).toBe(1216);
    });
  });

  describe('getCurrentPage', () => {
    const cardWidth = 280;
    const gap = 24;
    const perView = 4;
    const totalItems = 8;

    it('determines current page from scroll position accurately', () => {
      expect(getCurrentPage(0, cardWidth, gap, perView, totalItems)).toBe(0);
      expect(getCurrentPage(300, cardWidth, gap, perView, totalItems)).toBe(0);
      expect(getCurrentPage(700, cardWidth, gap, perView, totalItems)).toBe(1);
      expect(getCurrentPage(1216, cardWidth, gap, perView, totalItems)).toBe(1);
      expect(getCurrentPage(2000, cardWidth, gap, perView, totalItems)).toBe(1); // clamped to maxPage (1)
    });

    it('handles 0 or invalid inputs cleanly', () => {
      expect(getCurrentPage(-50, cardWidth, gap, perView, totalItems)).toBe(0);
      expect(getCurrentPage(100, 0, gap, perView, totalItems)).toBe(0);
    });
  });
});
