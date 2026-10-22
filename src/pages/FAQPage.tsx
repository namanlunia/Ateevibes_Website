import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { siteConfig } from '../config/site';

interface FAQItem {
  id: string;
  category: 'shipping' | 'sizing' | 'fabrics' | 'returns' | 'payments';
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'f-1',
    category: 'shipping',
    question: 'How long does delivery take across India?',
    answer:
      'We dispatch all orders within 24–48 business hours from our Surat dispatch hub. Metro deliveries (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai) typically arrive in 2–4 business days. Other regional cities and PIN codes take 3–5 business days via Express Air courier partners.',
  },
  {
    id: 'f-2',
    category: 'shipping',
    question: 'What are your delivery charges and free shipping threshold?',
    answer:
      'All orders over ₹1,499 receive 100% Free Express Delivery automatically. Orders below ₹1,499 have a flat ₹79 shipping charge across all serviced Indian PIN codes.',
  },
  {
    id: 'f-3',
    category: 'shipping',
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes, Cash on Delivery is available across 25,000+ PIN codes with a flat ₹49 convenience fee. You can also pay seamlessly online via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or Net Banking.',
  },
  {
    id: 'f-4',
    category: 'sizing',
    question: 'How do Ateevibes t-shirts fit? Are they true to size?',
    answer:
      'Our t-shirts feature a modern regular tailored fit. They are designed to sit cleanly across the chest and shoulders without clinging uncomfortably or billowing around the waist. If you prefer a relaxed or streetwear oversized drape, we recommend ordering one size up.',
  },
  {
    id: 'f-5',
    category: 'sizing',
    question: 'Where can I find exact garment measurements?',
    answer:
      'You can check our dedicated Size Guide page or click "Size Guide" on any product detail page to view chest, length, shoulder, and sleeve measurements in both inches and centimeters.',
  },
  {
    id: 'f-6',
    category: 'fabrics',
    question: 'What is China Jacquard fabric and how do I care for it?',
    answer:
      'China Jacquard is a specialized dimensional knit where intricate patterns are woven directly into the fabric structure rather than printed on top. To keep the weave looking crisp: machine wash in cold water on a gentle cycle, turn the garment inside out, and dry in shade. Avoid bleaching.',
  },
  {
    id: 'f-7',
    category: 'fabrics',
    question: 'Will these t-shirts shrink after machine washing?',
    answer:
      'All our fabrics are engineered with durable shape retention knits to maintain their structure and fit. When washed according to label guidelines (cold wash, gentle cycle, dry in shade), shape and drape are reliably preserved.',
  },
  {
    id: 'f-8',
    category: 'returns',
    question: 'What is your exchange and return policy?',
    answer:
      'We offer a hassle-free 7-Day Exchange & Return window. If your t-shirt does not fit perfectly, initiate an exchange request and our courier partner will collect the item directly from your address. The item must be unused, unwashed, and with tags attached.',
  },
  {
    id: 'f-9',
    category: 'returns',
    question: 'How do refunds work if I return an item?',
    answer:
      'Once the returned item is inspected at our hub, refunds are credited back to your original payment method (or bank account for COD orders) within 5–7 business days.',
  },
  {
    id: 'f-10',
    category: 'payments',
    question: 'Are my payment details secure on your website?',
    answer:
      'Absolutely. All online transactions are routed through Razorpay / PCI-DSS Level 1 compliant bank grade encryption. We do not store or have access to your card CVV or sensitive banking passwords.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Questions' },
  { key: 'shipping', label: 'Shipping & Delivery' },
  { key: 'sizing', label: 'Sizing & Fit' },
  { key: 'fabrics', label: 'Fabrics & Care' },
  { key: 'returns', label: 'Exchanges & Returns' },
  { key: 'payments', label: 'Payment & Security' },
];

export const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('f-1');

  const filteredFaqs = FAQ_LIST.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>{`Frequently Asked Questions | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Find answers to common questions about Ateevibes t-shirts, shipping times, sizing charts, fabric care, and 7-day exchanges."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {/* Header & Search */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-ink-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-lg mx-auto">
            Everything you need to know about our products, sizing, order shipping, and seamless exchanges.
          </p>

          {/* Search Input */}
          <div className="relative max-w-md mx-auto pt-2">
            <input
              type="text"
              placeholder="Search by keyword (e.g. shipping, wash, exchange)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-2xl text-xs sm:text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 shadow-sm"
            />
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-tab-active-bg text-tab-active-text shadow-sm'
                  : 'bg-surface-tint border border-border text-ink-600 hover:text-ink-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-surface-tint rounded-3xl p-10 border border-border text-center space-y-2">
              <p className="font-display text-lg font-normal text-ink-900">
                No matching questions found
              </p>
              <p className="text-xs text-ink-600">
                Try searching for something else or contact our concierge directly.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-ink-900 hover:bg-surface-tint/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 text-ink-500"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-600 leading-relaxed border-t border-border/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Contact Strip */}
        <div className="bg-surface-tint rounded-3xl border border-border p-8 text-center space-y-4">
          <h3 className="font-display text-xl font-normal text-ink-900">
            Still have questions?
          </h3>
          <p className="text-xs text-ink-600 max-w-md mx-auto">
            Our concierge team is available on WhatsApp and email to assist with sizing advice or special requests.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi Ateevibes team, I have a question.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-5 py-2 text-xs font-bold inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="mailto:support@ateevibes.com"
              className="btn-secondary px-5 py-2 text-xs font-bold inline-flex items-center gap-2 bg-white"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
