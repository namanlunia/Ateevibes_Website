import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as fs from 'fs';
import * as path from 'path';

import {
  RETURN_WINDOW_HOURS,
  EXCHANGE_WINDOW_HOURS,
  STORE_CREDIT_VALIDITY_DAYS,
  EXCHANGE_FEE,
  MAX_EXCHANGES_PER_ORDER,
} from '../config/commerce';
import {
  POLICY_CONSTANTS,
  POLICY_LEGAL_NOTE,
  CHECKOUT_TERMS_ACKNOWLEDGEMENT,
  POLICY_BULLETS,
  getPolicySections,
  getPolicyBullets,
  getPolicyGlance,
  getPolicyFAQs,
  generateFaqJsonLd,
} from '../config/policyCopy';

import { ShippingReturnsPage } from '../pages/ShippingReturnsPage';
import { FAQPage, FAQ_LIST } from '../pages/FAQPage';
import { TermsPage } from '../pages/TermsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SizeGuidePage } from '../pages/SizeGuidePage';
import { PRODUCTS } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';

const FORBIDDEN_PHRASES = ['7-day', '7 day', 'transit damage', 'sales final unless'];

describe('Policy Single Source of Truth & Copy Generator', () => {
  it('exposes the authoritative typed policy constants', () => {
    expect(RETURN_WINDOW_HOURS).toBe(24);
    expect(EXCHANGE_WINDOW_HOURS).toBe(48);
    expect(STORE_CREDIT_VALIDITY_DAYS).toBe(50);
    expect(EXCHANGE_FEE).toBe(250);
    expect(MAX_EXCHANGES_PER_ORDER).toBe(1);

    expect(POLICY_CONSTANTS.RETURN_WINDOW_HOURS).toBe(24);
    expect(POLICY_CONSTANTS.EXCHANGE_WINDOW_HOURS).toBe(48);
    expect(POLICY_CONSTANTS.STORE_CREDIT_VALIDITY_DAYS).toBe(50);
    expect(POLICY_CONSTANTS.EXCHANGE_FEE).toBe(250);
    expect(POLICY_CONSTANTS.MAX_EXCHANGES_PER_ORDER).toBe(1);
  });

  it('builds a 4-bullet policy summary containing the key facts and no forbidden phrases', () => {
    expect(POLICY_BULLETS).toEqual(getPolicyBullets());
    const bullets = getPolicyBullets();
    expect(bullets).toHaveLength(4);

    const fullBulletText = bullets.join(' ');
    expect(fullBulletText).toContain('24 hours');
    expect(fullBulletText).toContain('50 days');
    expect(fullBulletText).toContain('₹250');
    expect(fullBulletText).toContain('defective, damaged, incorrect, or undelivered');
    expect(fullBulletText).toContain('store credit');
    expect(fullBulletText).toContain('size-related issues');
    expect(fullBulletText).toContain('sale are final');

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(fullBulletText.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('builds structured sections and policy at a glance table', () => {
    const sections = getPolicySections();
    expect(sections.map((s) => s.id)).toEqual([
      'returns',
      'refunds',
      'exchanges',
      'important-notes',
      'how-to-request',
    ]);

    const glance = getPolicyGlance();
    expect(glance.map((g) => g.label)).toEqual([
      'Returns',
      'Refund',
      'Exchange',
      'Fee',
      'Sale items',
    ]);

    const glanceText = glance.map((g) => g.detail).join(' ');
    expect(glanceText).toContain('24 hours');
    expect(glanceText).toContain('50 days');
    expect(glanceText).toContain('₹250');

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(glanceText.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('builds the exact 7 policy FAQ items with matching structured data', () => {
    const faqs = getPolicyFAQs();
    expect(faqs).toHaveLength(7);

    const expectedQuestions = [
      'What can I return?',
      'How long do I have?',
      'How do I get my refund?',
      'Can I exchange?',
      'What if my size is out of stock?',
      'Is there a fee?',
      'Are sale items returnable?',
    ];

    expect(faqs.map((f) => f.question)).toEqual(expectedQuestions);

    const faqText = faqs.map((f) => f.answer).join(' ');
    expect(faqText).toContain('24 hours');
    expect(faqText).toContain('50 days');
    expect(faqText).toContain('₹250');

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(faqText.toLowerCase()).not.toContain(phrase.toLowerCase());
    }

    const jsonLd = generateFaqJsonLd(faqs);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('FAQPage');
    expect(jsonLd.mainEntity).toHaveLength(7);
    expect(jsonLd.mainEntity[0].name).toBe('What can I return?');
    expect(jsonLd.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].answer);
  });

  it('dynamically adapts generated text when constants are overridden', () => {
    const customBullets = getPolicyBullets({
      returnWindowHours: 72,
      exchangeWindowHours: 96,
      storeCreditValidityDays: 90,
      exchangeFee: 500,
      maxExchangesPerOrder: 2,
    });

    const customText = customBullets.join(' ');
    expect(customText).toContain('72 hours');
    expect(customText).toContain('96 hours');
    expect(customText).toContain('90 days');
    expect(customText).toContain('₹500');
    expect(customText).toContain('maximum 2 exchange');

    const customFaqs = getPolicyFAQs({
      returnWindowHours: 48,
      exchangeWindowHours: 72,
      storeCreditValidityDays: 60,
      exchangeFee: 300,
    });
    const feeFaq = customFaqs.find((f) => f.question === 'Is there a fee?');
    expect(feeFaq?.answer).toContain('₹300');
  });

  it('provides the correct checkout acknowledgement string', () => {
    expect(CHECKOUT_TERMS_ACKNOWLEDGEMENT).toContain('Terms of Service');
    expect(CHECKOUT_TERMS_ACKNOWLEDGEMENT).toContain('Returns & Exchanges Policy');
  });
});

describe('Storefront Pages & Components Rendering Policy', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(useUIStore.getState(), 'setOfflineCatalog').mockImplementation(() => {});
    useUIStore.setState({ isOfflineCatalog: false, toasts: [] });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
    useCartStore.getState().clearCart();
    useUIStore.setState({ isOfflineCatalog: false, toasts: [] });
    sessionStorage.clear();
  });

  const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/']) => {
    const router = createMemoryRouter(
      [
        {
          path: '*',
          element: ui,
        },
      ],
      { initialEntries }
    );
    return render(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    );
  };

  it('renders /shipping-returns with complete policy, table, legal note, and no forbidden phrases', () => {
    const { container } = renderWithRouter(<ShippingReturnsPage />);
    const text = container.textContent || '';

    expect(screen.getByRole('heading', { level: 1, name: /Shipping, Returns & Exchanges/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Returns, Refunds & Exchanges Policy/i })).toBeInTheDocument();

    // Table
    expect(screen.getByText('Policy at a Glance')).toBeInTheDocument();
    expect(screen.getByText('Refund')).toBeInTheDocument();

    // Key facts
    expect(text).toContain('24 hours');
    expect(text).toContain('50 days');
    expect(text).toContain('₹250');
    expect(text).toContain('size-related issues');
    expect(text).toContain('sale are final');
    expect(text).toContain(POLICY_LEGAL_NOTE);

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('renders /faq with the 7 policy FAQs and matching structured data', () => {
    const { container } = renderWithRouter(<FAQPage />);
    const text = container.textContent || '';

    expect(screen.getByText('What can I return?')).toBeInTheDocument();
    expect(screen.getByText('How long do I have?')).toBeInTheDocument();
    expect(screen.getByText('How do I get my refund?')).toBeInTheDocument();
    expect(screen.getByText('Can I exchange?')).toBeInTheDocument();
    expect(screen.getByText('What if my size is out of stock?')).toBeInTheDocument();
    expect(screen.getByText('Is there a fee?')).toBeInTheDocument();
    expect(screen.getByText('Are sale items returnable?')).toBeInTheDocument();

    // Verify structured data generated matches FAQ_LIST
    const jsonLd = generateFaqJsonLd(FAQ_LIST);
    expect(jsonLd.mainEntity.length).toBe(FAQ_LIST.length);

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('renders /terms with Returns, Refunds & Exchanges section and statutory note', () => {
    const { container } = renderWithRouter(<TermsPage />);
    const text = container.textContent || '';

    expect(screen.getByRole('heading', { level: 2, name: /4\. Returns, Refunds & Exchanges/i })).toBeInTheDocument();
    expect(text).toContain('24 hours');
    expect(text).toContain('50 days');
    expect(text).toContain('₹250');
    expect(text).toContain(POLICY_LEGAL_NOTE);

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('renders /product accordion with 4-bullet summary and link to full policy', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/product/:slug',
          element: <ProductPage />,
        },
      ],
      { initialEntries: [`/product/${PRODUCTS[0].slug}`] }
    );

    const { container } = render(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    );

    const accordionBtn = screen.getByRole('button', { name: /Shipping & Returns/i });
    expect(accordionBtn).toBeInTheDocument();
    fireEvent.click(accordionBtn);

    const text = container.textContent || '';
    expect(text).toContain('24 hours');
    expect(text).toContain('50 days');
    expect(text).toContain('₹250');
    expect(screen.getByText(/View full Returns & Exchanges Policy/i)).toBeInTheDocument();

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('renders /size-guide with the careful size selection note', () => {
    const { container } = renderWithRouter(<SizeGuidePage />);
    const text = container.textContent || '';

    expect(screen.getByText(/Choose Your Size Carefully/i)).toBeInTheDocument();
    expect(text).toContain('48 hours');
    expect(text).toContain('₹250');
    expect(text).toContain('subject to stock availability');

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('renders /cart with the policy note under totals', () => {
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: 'M',
      qty: 1,
    });

    const { container } = renderWithRouter(<CartPage />);
    const text = container.textContent || '';

    expect(text).toContain('Returns and exchanges follow our policy');
    expect(screen.getByRole('link', { name: /policy/i })).toBeInTheDocument();

    for (const phrase of FORBIDDEN_PHRASES) {
      expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('renders checkout review step with 4-bullet summary and required terms checkbox linking to both pages', async () => {
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: 'M',
      qty: 1,
    });

    const { container } = renderWithRouter(<CheckoutPage />);

    // Fill Step 1 Address Form
    const fullNameInput = container.querySelector('#fullName') as HTMLInputElement;
    fireEvent.change(fullNameInput, { target: { value: 'Dev Test' } });

    const emailInput = container.querySelector('#email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'dev@ateevibes.test' } });

    const phoneInput = container.querySelector('#phone') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const addrInput = container.querySelector('#addressLine1') as HTMLInputElement;
    fireEvent.change(addrInput, { target: { value: '101 Bandra West' } });

    const cityInput = container.querySelector('#city') as HTMLInputElement;
    fireEvent.change(cityInput, { target: { value: 'Mumbai' } });

    const stateSelect = container.querySelector('#state') as HTMLSelectElement;
    fireEvent.change(stateSelect, { target: { value: 'Maharashtra' } });

    const pinInput = container.querySelector('#pincode') as HTMLInputElement;
    fireEvent.change(pinInput, { target: { value: '400050' } });

    // Step 1 -> Step 2
    const step1Next = screen.getByRole('button', { name: /Continue to Shipping/i });
    fireEvent.click(step1Next);

    // Step 2 -> Step 3
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Continue to Payment/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Payment/i }));

    // Step 3 -> Select COD and proceed to Step 4 (Review)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Review Order/i })).toBeInTheDocument();
    });
    // Click COD payment option
    const codOption = screen.getByRole('button', { name: /COD/i });
    fireEvent.click(codOption);

    fireEvent.click(screen.getByRole('button', { name: /Review Order/i }));

    // Verify Step 4 Review Step is rendered
    await waitFor(() => {
      expect(screen.getByText('Returns & Exchanges Policy Summary')).toBeInTheDocument();
    });

    // 4-bullet summary present
    expect(screen.getByText(/defective, damaged, incorrect, or undelivered/i)).toBeInTheDocument();
    expect(screen.getByText(/50 days/i)).toBeInTheDocument();
    expect(screen.getByText(/₹250 exchange fee/i)).toBeInTheDocument();

    // Checkbox links to Terms and Returns & Exchanges Policy
    const termsLink = screen.getByRole('link', { name: /Terms of Service/i });
    expect(termsLink).toHaveAttribute('href', '/terms');

    const returnsLinks = screen.getAllByRole('link', { name: /Returns & Exchanges Policy/i });
    expect(returnsLinks.length).toBeGreaterThanOrEqual(1);
    returnsLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/shipping-returns');
    });

    // Checkbox is checked by default and button is enabled
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    const placeOrderBtn = screen.getByRole('button', { name: /Place Order/i });
    expect(placeOrderBtn).not.toBeDisabled();

    // Unchecking terms disables the place order button
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(placeOrderBtn).toBeDisabled();

    // Re-checking terms re-enables the button
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(placeOrderBtn).not.toBeDisabled();
  });
});

describe('Static Guard Tests — No Hardcoded Constants or Forbidden Phrases', () => {
  it('ensures no source file outside src/config contains hardcoded ₹250, 50 days, or 7-day', () => {
    const srcDir = path.resolve(__dirname, '../');
    const violations: { file: string; match: string }[] = [];

    const guardPatterns = [
      { pattern: /₹250/, name: 'hardcoded ₹250' },
      { pattern: /50\s*days/i, name: 'hardcoded 50 days' },
      { pattern: /7-day/i, name: 'forbidden phrase 7-day' },
      { pattern: /\b7\s+day\b/i, name: 'forbidden phrase 7 day' },
      { pattern: /transit\s+damage/i, name: 'forbidden phrase transit damage' },
      { pattern: /sales?\s+(?:are\s+)?final\s+unless/i, name: 'forbidden phrase sales final unless' },
    ];

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(srcDir, fullPath);

        if (entry.isDirectory()) {
          // Exclude config directory (the single source of truth) and __tests__ directory
          if (relPath === 'config' || relPath === '__tests__' || relPath.startsWith('config/') || relPath.startsWith('__tests__/')) {
            continue;
          }
          scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const { pattern, name } of guardPatterns) {
            if (pattern.test(content)) {
              violations.push({ file: relPath, match: name });
            }
          }
        }
      }
    }

    scanDir(srcDir);
    expect(violations).toEqual([]);
  });
});
