import {
  RETURN_WINDOW_HOURS,
  EXCHANGE_WINDOW_HOURS,
  STORE_CREDIT_VALIDITY_DAYS,
  EXCHANGE_FEE,
  MAX_EXCHANGES_PER_ORDER,
} from './commerce';
import { formatPrice } from '../lib/format';
import { siteConfig } from './site';

export interface PolicyValues {
  returnWindowHours?: number;
  exchangeWindowHours?: number;
  storeCreditValidityDays?: number;
  exchangeFee?: number;
  maxExchangesPerOrder?: number;
  supportEmail?: string;
}

export const POLICY_CONSTANTS = {
  RETURN_WINDOW_HOURS,
  EXCHANGE_WINDOW_HOURS,
  STORE_CREDIT_VALIDITY_DAYS,
  EXCHANGE_FEE,
  MAX_EXCHANGES_PER_ORDER,
};

export const POLICY_LEGAL_NOTE =
  'This policy does not affect your statutory rights under applicable Indian consumer law.';

export const CHECKOUT_TERMS_ACKNOWLEDGEMENT =
  'I accept the Terms of Service and Returns & Exchanges Policy, and acknowledge that this is a simulated demo transaction with no real payment.';

export interface PolicySection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface PolicyGlanceRow {
  label: string;
  detail: string;
}

export interface PolicyFAQ {
  id: string;
  question: string;
  answer: string;
}

export function getPolicySections(overrides?: PolicyValues): PolicySection[] {
  const retHours = overrides?.returnWindowHours ?? RETURN_WINDOW_HOURS;
  const exHours = overrides?.exchangeWindowHours ?? EXCHANGE_WINDOW_HOURS;
  const credDays = overrides?.storeCreditValidityDays ?? STORE_CREDIT_VALIDITY_DAYS;
  const fee = formatPrice(overrides?.exchangeFee ?? EXCHANGE_FEE);
  const maxEx = overrides?.maxExchangesPerOrder ?? MAX_EXCHANGES_PER_ORDER;
  const email = overrides?.supportEmail ?? siteConfig.contact.email;

  return [
    {
      id: 'returns',
      title: 'Returns',
      paragraphs: [
        'Returns are accepted only for products that are defective, damaged, incorrect, or undelivered.',
        `A return must be requested within ${retHours} hours of delivery. For an order that was never delivered, the request must be made within ${retHours} hours of the expected delivery date shown in order tracking.`,
      ],
    },
    {
      id: 'refunds',
      title: 'Refunds',
      paragraphs: [
        `Approved returns are refunded as a store credit coupon code, valid for ${credDays} days from the date it is issued.`,
      ],
    },
    {
      id: 'exchanges',
      title: 'Exchanges',
      paragraphs: [
        'Exchanges are allowed only for size-related issues. Exchanging for a different product, style or colour is not permitted under any circumstances.',
        `Exchange requests must be raised within ${exHours} hours of delivery.`,
        `Only ${maxEx} exchange is allowed per order, and a ${fee} exchange fee applies.`,
        'Exchanges depend on stock availability. If the requested size is out of stock, we cannot proceed with the exchange, and no store credit or other compensation is provided.',
      ],
    },
    {
      id: 'important-notes',
      title: 'Important Notes',
      paragraphs: [
        'Products sold during a sale are final and are not eligible for returns, refunds or exchanges.',
      ],
    },
    {
      id: 'how-to-request',
      title: 'How to Request',
      paragraphs: [
        `To request a return or exchange, contact us with your order number through the Contact page or at the support email in siteConfig (${email}).`,
      ],
    },
  ];
}

export function getPolicyBullets(overrides?: PolicyValues): string[] {
  const retHours = overrides?.returnWindowHours ?? RETURN_WINDOW_HOURS;
  const exHours = overrides?.exchangeWindowHours ?? EXCHANGE_WINDOW_HOURS;
  const credDays = overrides?.storeCreditValidityDays ?? STORE_CREDIT_VALIDITY_DAYS;
  const fee = formatPrice(overrides?.exchangeFee ?? EXCHANGE_FEE);
  const maxEx = overrides?.maxExchangesPerOrder ?? MAX_EXCHANGES_PER_ORDER;

  return [
    `Returns are accepted within ${retHours} hours of delivery (or within ${retHours} hours of the expected delivery date for undelivered orders) only for products that are defective, damaged, incorrect, or undelivered.`,
    `Approved returns are refunded as a store credit coupon code, valid for ${credDays} days from the date it is issued.`,
    `Exchanges are allowed only for size-related issues within ${exHours} hours of delivery for a ${fee} exchange fee (maximum ${maxEx} exchange per order, subject to stock availability; no store credit or compensation if size is out of stock).`,
    'Products sold during a sale are final and are not eligible for returns, refunds or exchanges.',
  ];
}

export function getPolicyGlance(overrides?: PolicyValues): PolicyGlanceRow[] {
  const retHours = overrides?.returnWindowHours ?? RETURN_WINDOW_HOURS;
  const exHours = overrides?.exchangeWindowHours ?? EXCHANGE_WINDOW_HOURS;
  const credDays = overrides?.storeCreditValidityDays ?? STORE_CREDIT_VALIDITY_DAYS;
  const fee = formatPrice(overrides?.exchangeFee ?? EXCHANGE_FEE);
  const maxEx = overrides?.maxExchangesPerOrder ?? MAX_EXCHANGES_PER_ORDER;

  return [
    {
      label: 'Returns',
      detail: `Accepted only for defective, damaged, incorrect, or undelivered items within ${retHours} hours of delivery (or expected delivery date for undelivered orders).`,
    },
    {
      label: 'Refund',
      detail: `Approved returns are refunded as a store credit coupon code, valid for ${credDays} days from the date it is issued.`,
    },
    {
      label: 'Exchange',
      detail: `Size-related issues only, requested within ${exHours} hours of delivery. Maximum ${maxEx} exchange per order, subject to stock availability (no store credit or compensation if out of stock).`,
    },
    {
      label: 'Fee',
      detail: `${fee} exchange fee applies for size exchanges.`,
    },
    {
      label: 'Sale items',
      detail: 'Final sale. Not eligible for returns, refunds or exchanges.',
    },
  ];
}

export function getPolicyFAQs(overrides?: PolicyValues): PolicyFAQ[] {
  const retHours = overrides?.returnWindowHours ?? RETURN_WINDOW_HOURS;
  const exHours = overrides?.exchangeWindowHours ?? EXCHANGE_WINDOW_HOURS;
  const credDays = overrides?.storeCreditValidityDays ?? STORE_CREDIT_VALIDITY_DAYS;
  const fee = formatPrice(overrides?.exchangeFee ?? EXCHANGE_FEE);
  const maxEx = overrides?.maxExchangesPerOrder ?? MAX_EXCHANGES_PER_ORDER;

  return [
    {
      id: 'faq-policy-1',
      question: 'What can I return?',
      answer:
        'Returns are accepted only for products that are defective, damaged, incorrect, or undelivered. Products sold during a sale are final and are not eligible for returns, refunds or exchanges.',
    },
    {
      id: 'faq-policy-2',
      question: 'How long do I have?',
      answer:
        `A return must be requested within ${retHours} hours of delivery. For an order that was never delivered, the request must be made within ${retHours} hours of the expected delivery date shown in order tracking. Exchange requests must be raised within ${exHours} hours of delivery.`,
    },
    {
      id: 'faq-policy-3',
      question: 'How do I get my refund?',
      answer:
        `Approved returns are refunded as a store credit coupon code, valid for ${credDays} days from the date it is issued.`,
    },
    {
      id: 'faq-policy-4',
      question: 'Can I exchange?',
      answer:
        `Exchanges are allowed only for size-related issues. Exchanging for a different product, style or colour is not permitted under any circumstances. Only ${maxEx} exchange is allowed per order, and a ${fee} exchange fee applies.`,
    },
    {
      id: 'faq-policy-5',
      question: 'What if my size is out of stock?',
      answer:
        'Exchanges depend on stock availability. If the requested size is out of stock, we cannot proceed with the exchange, and no store credit or other compensation is provided.',
    },
    {
      id: 'faq-policy-6',
      question: 'Is there a fee?',
      answer:
        `A ${fee} exchange fee applies for size exchanges. Returns for defective, damaged, incorrect, or undelivered items do not have an exchange fee.`,
    },
    {
      id: 'faq-policy-7',
      question: 'Are sale items returnable?',
      answer:
        'No. Products sold during a sale are final and are not eligible for returns, refunds or exchanges.',
    },
  ];
}

export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export const POLICY_BULLETS = getPolicyBullets();
