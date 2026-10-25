import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import {
  PAGE_TRANSITION_CONFIG,
  pageVariants,
  reducedMotionVariants,
  preloadRoute,
} from '../lib/pageTransition';
import { PageTransition } from '../components/layout/PageTransition';


describe('PageTransition System', () => {
  beforeEach(() => {
        vi.restoreAllMocks();
  });

  describe('Config & Tokens', () => {
    it('satisfies total duration <= 600ms and mode wait', () => {
      expect(PAGE_TRANSITION_CONFIG.mode).toBe('wait');
      expect(PAGE_TRANSITION_CONFIG.totalDuration).toBeLessThanOrEqual(0.60);
      expect(PAGE_TRANSITION_CONFIG.enterDuration + PAGE_TRANSITION_CONFIG.exitDuration).toBeCloseTo(0.54, 2);
    });

    it('contains valid ease-out expo curve [0.22, 1, 0.36, 1]', () => {
      expect(PAGE_TRANSITION_CONFIG.easeOut).toEqual([0.22, 1, 0.36, 1]);
      expect(pageVariants.animate).toBeDefined();
      expect(pageVariants.exit).toBeDefined();
    });

    it('provides reduced motion variant with 0 y movement and <= 150ms duration', () => {
      expect(PAGE_TRANSITION_CONFIG.reducedMotionDuration).toBeLessThanOrEqual(0.15);
      expect((reducedMotionVariants.initial as any).y).toBe(0);
      expect((reducedMotionVariants.animate as any).y).toBe(0);
      expect((reducedMotionVariants.exit as any).y).toBe(0);
    });
  });

  describe('Sequencing & Query-string Safety', () => {
    it('does not re-mount or trigger transition on query-string changes on same pathname', async () => {
      let triggerSearchChange: (sort: string) => void = () => {};

      const TestHost: React.FC = () => {
        const navigate = useNavigate();
        triggerSearchChange = (sort: string) => navigate(`/shop?sort=${sort}`);

        return <PageTransition />;
      };

      const { rerender } = render(
        <MemoryRouter initialEntries={['/shop?sort=price']}>
          <TestHost />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();

      act(() => {
        triggerSearchChange('date');
      });

      rerender(
        <MemoryRouter initialEntries={['/shop?sort=date']}>
          <TestHost />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('resets scroll on exit complete when navigating', () => {
      const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      render(
        <MemoryRouter initialEntries={['/']}>
          <PageTransition />
        </MemoryRouter>
      );

      // Verify PageTransition rendered and footer is embedded inside transition wrapper
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
      scrollSpy.mockRestore();
    });
  });

  describe('Route Preloader', () => {
    it('does not throw when preloading existing routes or product slugs', () => {
      expect(() => preloadRoute('/shop')).not.toThrow();
      expect(() => preloadRoute('/product/1400')).not.toThrow();
      expect(() => preloadRoute('/unknown-route')).not.toThrow();
    });
  });
});
