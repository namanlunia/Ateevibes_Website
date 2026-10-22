import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HomePage, FABRIC_STORIES } from '../pages/HomePage';

// WCAG relative luminance & contrast ratio calculation
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Fabric Story Tabs & Accessibility Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderHomePage = () => {
    return render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  it('renders Fabric Story section with role="tablist", role="tab", and first tab active by default', () => {
    renderHomePage();

    const tablist = screen.getByRole('tablist', { name: /fabric stories/i });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(FABRIC_STORIES.length);

    // First tab is selected by default on load
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabIndex', '0');
    expect(tabs[0].className).toContain('bg-tab-active-bg');
    expect(tabs[0].className).toContain('text-tab-active-text');

    // Content panel is rendered and associated
    const panel = screen.getByRole('tabpanel');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('id', `fabric-panel-${FABRIC_STORIES[0].id}`);
    expect(panel).toHaveTextContent(FABRIC_STORIES[0].name);

    // Other tabs are unselected
    for (let i = 1; i < tabs.length; i++) {
      expect(tabs[i]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[i]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[i].className).not.toContain('bg-tab-active-bg');
      expect(tabs[i].className).toContain('bg-surface-tint');
      expect(tabs[i].className).toContain('text-ink-700');
    }
  });

  it('clicks each tab in turn: selects only that tab with active classes, unselects others, and updates panel content', () => {
    renderHomePage();

    const tabs = screen.getAllByRole('tab');

    FABRIC_STORIES.forEach((fabric, targetIdx) => {
      // Click the tab
      fireEvent.click(tabs[targetIdx]);

      // Assert only this tab is selected
      tabs.forEach((tab, idx) => {
        if (idx === targetIdx) {
          expect(tab).toHaveAttribute('aria-selected', 'true');
          expect(tab).toHaveAttribute('tabIndex', '0');
          expect(tab.className).toContain('bg-tab-active-bg');
          expect(tab.className).toContain('text-tab-active-text');
        } else {
          expect(tab).toHaveAttribute('aria-selected', 'false');
          expect(tab).toHaveAttribute('tabIndex', '-1');
          expect(tab.className).not.toContain('bg-tab-active-bg');
          expect(tab.className).toContain('bg-surface-tint');
          expect(tab.className).toContain('text-ink-700');
        }
      });

      // Assert panel content updates without blank flash
      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('id', `fabric-panel-${fabric.id}`);
      expect(panel).toHaveTextContent(fabric.name);
      expect(panel).toHaveTextContent(fabric.tagline);
    });
  });

  it('supports keyboard navigation: ArrowRight, ArrowLeft, Home, and End keys', () => {
    renderHomePage();

    const tabs = screen.getAllByRole('tab');

    // Focus first tab
    tabs[0].focus();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Press ArrowRight -> moves to second tab
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');

    // Press ArrowRight again -> moves to third tab
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    // Press ArrowLeft -> moves back to second tab
    fireEvent.keyDown(tabs[2], { key: 'ArrowLeft' });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // Press End -> moves to last tab
    fireEvent.keyDown(tabs[1], { key: 'End' });
    const lastIdx = tabs.length - 1;
    expect(tabs[lastIdx]).toHaveAttribute('aria-selected', 'true');

    // Press Home -> moves to first tab
    fireEvent.keyDown(tabs[lastIdx], { key: 'Home' });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('WCAG AA contrast test: ensures active and inactive states exceed 4.5:1 ratio', () => {
    // Selected Tab: --tab-active-bg (#1c241a) vs --tab-active-text (#ffffff)
    const activeBg = '#1c241a';
    const activeText = '#ffffff';
    const activeRatio = getContrastRatio(activeBg, activeText);

    expect(activeRatio).toBeGreaterThanOrEqual(4.5);
    // In fact it exceeds AAA (7:1)
    expect(activeRatio).toBeGreaterThanOrEqual(14.0);

    // Unselected Tab: --surface-tint (#fbfdf6) vs --ink-700 (#3a4636)
    const inactiveBg = '#fbfdf6';
    const inactiveText = '#3a4636';
    const inactiveRatio = getContrastRatio(inactiveBg, inactiveText);

    expect(inactiveRatio).toBeGreaterThanOrEqual(4.5);

    // Optional Gold Token Check: --gold (#e8c26a) on --tab-active-bg (#1c241a)
    const gold = '#e8c26a';
    const goldRatio = getContrastRatio(activeBg, gold);
    expect(goldRatio).toBeGreaterThanOrEqual(4.5);
  });
});
