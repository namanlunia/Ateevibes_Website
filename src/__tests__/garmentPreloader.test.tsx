import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import * as framerMotion from 'framer-motion';
import fs from 'fs';
import path from 'path';
import { Preloader } from '../components/motion/Preloader';
import {
  PRELOADER_GARMENTS,
  PRELOADER_MOBILE_GARMENTS,
  PRELOADER_TIMING,
  buildPreloaderGarments,
} from '../components/motion/preloaderConfig';
import { useUIStore } from '../store/uiStore';

// Mock framer-motion hooks and components
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(),
  };
});

describe('Garment Preloader Configuration & Asset Integrity', () => {
  it('defines 18 garments on desktop and 10 on mobile across 3 distinct depth layers', () => {
    expect(PRELOADER_GARMENTS).toHaveLength(18);
    expect(PRELOADER_MOBILE_GARMENTS).toHaveLength(10);

    const desktopBg = PRELOADER_GARMENTS.filter((g) => g.layer === 'background');
    const desktopMid = PRELOADER_GARMENTS.filter((g) => g.layer === 'middle');
    const desktopFg = PRELOADER_GARMENTS.filter((g) => g.layer === 'foreground');

    expect(desktopBg).toHaveLength(7);
    expect(desktopMid).toHaveLength(7);
    expect(desktopFg).toHaveLength(4);

    const mobileBg = PRELOADER_MOBILE_GARMENTS.filter((g) => g.layer === 'background');
    const mobileMid = PRELOADER_MOBILE_GARMENTS.filter((g) => g.layer === 'middle');
    const mobileFg = PRELOADER_MOBILE_GARMENTS.filter((g) => g.layer === 'foreground');

    expect(mobileBg).toHaveLength(4);
    expect(mobileMid).toHaveLength(4);
    expect(mobileFg).toHaveLength(2);
  });

  it('guarantees valid sizes, opacities, z-indices, delays, durations, sways, and rotations', () => {
    for (const g of PRELOADER_GARMENTS) {
      if (g.layer === 'background') {
        expect(g.size).toBeGreaterThanOrEqual(80);
        expect(g.size).toBeLessThanOrEqual(110);
        expect(g.opacity).toBe(0.35);
        expect(g.zIndex).toBe(10);
      } else if (g.layer === 'middle') {
        expect(g.size).toBeGreaterThanOrEqual(130);
        expect(g.size).toBeLessThanOrEqual(170);
        expect(g.opacity).toBe(0.65);
        expect(g.zIndex).toBe(15);
      } else if (g.layer === 'foreground') {
        expect(g.size).toBeGreaterThanOrEqual(190);
        expect(g.size).toBeLessThanOrEqual(240);
        expect(g.opacity).toBe(0.95);
        expect(g.zIndex).toBe(20);
      }

      expect(g.delay).toBeGreaterThanOrEqual(0);
      expect(g.delay).toBeLessThanOrEqual(2.5);

      expect(g.duration).toBeGreaterThanOrEqual(1.8);
      expect(g.duration).toBeLessThanOrEqual(3.5);

      expect(Math.abs(g.sway)).toBeGreaterThanOrEqual(10);
      expect(Math.abs(g.sway)).toBeLessThanOrEqual(24);

      expect(g.rotation).toBeGreaterThanOrEqual(-8);
      expect(g.rotation).toBeLessThanOrEqual(8);
    }
  });

  it('ensures no two neighbouring slots share the same image', () => {
    for (let i = 0; i < PRELOADER_GARMENTS.length - 1; i++) {
      expect(PRELOADER_GARMENTS[i].imagePath).not.toBe(PRELOADER_GARMENTS[i + 1].imagePath);
    }
  });

  it('covers viewport width with at least two garments in each fifth on desktop', () => {
    const fifths = [0, 0, 0, 0, 0];
    for (const g of PRELOADER_GARMENTS) {
      const fifthIndex = Math.min(4, Math.floor(g.xPercent / 20));
      fifths[fifthIndex]++;
    }
    for (const count of fifths) {
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps foreground garments outside the center hero column', () => {
    const fgGarments = PRELOADER_GARMENTS.filter((g) => g.layer === 'foreground');
    for (const g of fgGarments) {
      expect(g.xPercent < 35 || g.xPercent > 65).toBe(true);
    }
  });

  it('guarantees all image paths exist in public/ and are responsive webp assets', () => {
    const publicDir = path.resolve(process.cwd(), 'public');

    for (const g of PRELOADER_GARMENTS) {
      expect(g.imagePath).toMatch(/^\/?products\/[^/]+\/[^/]+-480\.webp$/);
      const cleanPath = g.imagePath.startsWith('/') ? g.imagePath.slice(1) : g.imagePath;
      const fullPath = path.join(publicDir, cleanPath);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('keeps total image weight across unique preloader images under 250 KB', () => {
    const publicDir = path.resolve(process.cwd(), 'public');
    const uniqueImages = new Set(PRELOADER_GARMENTS.map((g) => g.imagePath));
    let totalBytes = 0;

    for (const imgPath of uniqueImages) {
      const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
      const fullPath = path.join(publicDir, cleanPath);
      expect(fs.existsSync(fullPath)).toBe(true);
      totalBytes += fs.statSync(fullPath).size;
    }

    expect(totalBytes).toBeLessThan(250 * 1024);
  });

  it('never includes coming-soon products and contains no style codes in alt or texts', () => {
    const styleCodeRegex = /style\s*(code)?\s*[:#-]?\s*\d{3,4}|P\.?\s*NO\b/i;

    for (const g of PRELOADER_GARMENTS) {
      expect(g.slug).not.toBe('waffle-polo');
      expect(styleCodeRegex.test(g.name)).toBe(false);
      expect(styleCodeRegex.test(g.styleDescription)).toBe(false);
    }
  });

  it('deterministic output from buildPreloaderGarments matches constant array', () => {
    const fresh = buildPreloaderGarments();
    expect(fresh).toEqual(PRELOADER_GARMENTS);
  });
});

describe('Garment Preloader Component & Timing Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    useUIStore.setState({ preloaderFinished: false });
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(false);

    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document, 'fonts', {
      value: { ready: Promise.resolve(), status: 'loaded' },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    sessionStorage.clear();
    document.body.style.overflow = '';
  });

  it('shows on first visit and finishes at 1.8s when page is already ready', async () => {
    render(<Preloader />);

    expect(screen.getByTestId('preloader-overlay')).toBeInTheDocument();
    expect(screen.getByText('Loading Ateevibes')).toBeInTheDocument();
    expect(screen.getByText('ATEEVIBES')).toBeInTheDocument();
    expect(screen.getByText('Feel the Vibes')).toBeInTheDocument();

    // At 1790ms, still visible (minimum time not reached)
    act(() => {
      vi.advanceTimersByTime(1790);
    });
    expect(screen.getByTestId('preloader-overlay')).toBeInTheDocument();

    // At 1800ms (1.8s minimum), finish is triggered
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Advance fade-out (400ms)
    act(() => {
      vi.advanceTimersByTime(PRELOADER_TIMING.FADE_OUT_MS + 50);
    });

    expect(useUIStore.getState().preloaderFinished).toBe(true);
    expect(sessionStorage.getItem('atv:preloader_done')).toBe('true');
  });

  it('does not finish before 1.8s even if page reports complete immediately', () => {
    render(<Preloader />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(useUIStore.getState().preloaderFinished).toBe(false);
    expect(screen.getByTestId('preloader-overlay')).toBeInTheDocument();
  });

  it('waits past 1.8s if page is not ready, and finishes at 3.2s hard cap', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, 'fonts', {
      value: { ready: new Promise(() => {}), status: 'loading' },
      writable: true,
      configurable: true,
    });

    render(<Preloader />);

    // At 1.8s, page is not ready, so it stays visible
    act(() => {
      vi.advanceTimersByTime(1850);
    });
    expect(useUIStore.getState().preloaderFinished).toBe(false);

    // At 3190ms, still within hard cap
    act(() => {
      vi.advanceTimersByTime(1340);
    });
    expect(useUIStore.getState().preloaderFinished).toBe(false);

    // At 3200ms (3.2s cap), hard cap forces finish
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Advance fade-out (400ms)
    act(() => {
      vi.advanceTimersByTime(PRELOADER_TIMING.FADE_OUT_MS + 50);
    });

    expect(useUIStore.getState().preloaderFinished).toBe(true);
  });

  it('finishes between 1.8s and 3.2s as soon as the page becomes ready', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, 'fonts', {
      value: { ready: new Promise(() => {}), status: 'loading' },
      writable: true,
      configurable: true,
    });

    render(<Preloader />);

    // Advance to 2.2s (past minimum, but page still loading)
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(useUIStore.getState().preloaderFinished).toBe(false);

    // Page becomes ready at 2.2s
    act(() => {
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true,
        configurable: true,
      });
      Object.defineProperty(document, 'fonts', {
        value: { ready: Promise.resolve(), status: 'loaded' },
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('load'));
      vi.advanceTimersByTime(50);
    });

    // Advance fade-out
    act(() => {
      vi.advanceTimersByTime(PRELOADER_TIMING.FADE_OUT_MS + 50);
    });

    expect(useUIStore.getState().preloaderFinished).toBe(true);
  });

  it('does not show if preloader has already finished in current session', () => {
    sessionStorage.setItem('atv:preloader_done', 'true');
    useUIStore.setState({ preloaderFinished: true });

    render(<Preloader />);
    expect(screen.queryByTestId('preloader-overlay')).not.toBeInTheDocument();
  });

  it('forces display in dev mode when ?preloader=1 is in URL even if session flag is set', () => {
    sessionStorage.setItem('atv:preloader_done', 'true');
    useUIStore.setState({ preloaderFinished: true });

    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost:5173/?preloader=1'),
      writable: true,
      configurable: true,
    });

    render(<Preloader />);
    expect(screen.getByTestId('preloader-overlay')).toBeInTheDocument();
  });

  it('renders static variant without flying garments under prefers-reduced-motion and finishes at 600ms', () => {
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(true);

    render(<Preloader />);

    // No flying garments rendered
    expect(screen.queryByTestId(/preloader-garment-/)).not.toBeInTheDocument();

    // Wordmark and tagline still present
    expect(screen.getByText('ATEEVIBES')).toBeInTheDocument();
    expect(screen.getByText('Feel the Vibes')).toBeInTheDocument();

    // At 550ms, not yet finished
    act(() => {
      vi.advanceTimersByTime(550);
    });
    expect(useUIStore.getState().preloaderFinished).toBe(false);

    // At 600ms (reduced-motion min), finish triggers
    act(() => {
      vi.advanceTimersByTime(60);
      vi.advanceTimersByTime(250); // reduced motion fade out (200ms)
    });

    expect(useUIStore.getState().preloaderFinished).toBe(true);
  });

  it('locks scrolling and applies inert to main content while preloader is visible', () => {
    const mainEl = document.createElement('main');
    mainEl.id = 'main-content';
    document.body.appendChild(mainEl);

    const { unmount } = render(<Preloader />);

    expect(document.body.style.overflow).toBe('hidden');
    expect(mainEl.hasAttribute('inert')).toBe(true);

    unmount();

    expect(document.body.style.overflow).toBe('');
    expect(mainEl.hasAttribute('inert')).toBe(false);

    mainEl.remove();
  });
});
