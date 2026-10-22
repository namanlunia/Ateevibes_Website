import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';
import { siteConfig } from '../config/site';

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{`Privacy Policy | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Ateevibes privacy policy outlining how customer personal data, order information, and payment safety are handled with strict security standards."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-ink-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-lg mx-auto">
            Last updated: October 2026. We are committed to safeguarding your personal information and respecting your privacy rights.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm text-ink-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-normal text-ink-900">1. Information We Collect</h2>
            <p>
              When you purchase from Ateevibes or create an account, we collect necessary transactional information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink-600">
              <li>Contact details: Name, mobile number, email address.</li>
              <li>Delivery information: Shipping address, city, state, and 6-digit postal PIN code.</li>
              <li>Order history: Items purchased, selected sizes, colours, and dates of transactions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-normal text-ink-900">2. Payment Security & Encryption</h2>
            <p>
              All online payments on Ateevibes (UPI, Debit/Credit Cards, Net Banking) are routed through authorized PCI-DSS Level 1 certified payment gateways (e.g. Razorpay).
            </p>
            <p className="font-semibold text-ink-900">
              We never store or log your card numbers, CVV security codes, UPI PINs, or online banking passwords on our servers or client storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-normal text-ink-900">3. How Your Data Is Used</h2>
            <ul className="list-disc pl-5 space-y-1 text-ink-600">
              <li>Processing, packing, and dispatching your orders.</li>
              <li>Sending live tracking updates and invoice confirmations via SMS, WhatsApp, and email.</li>
              <li>Providing customer support and facilitating 7-day doorstep size exchanges.</li>
              <li>With your permission, sharing private drops and exclusive promotional offers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-normal text-ink-900">4. Sharing with Third Parties</h2>
            <p>
              We only share your shipping data with trusted third-party logistics partners (such as Bluedart, Delhivery, or Indian Postal Express) strictly to facilitate courier delivery of your parcel. We do not sell or rent customer data to marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-normal text-ink-900">5. Cookies & Local Storage</h2>
            <p>
              We use lightweight local storage tokens to remember your shopping cart items, wishlist, and preferred filters during your session. You can clear this data anytime through your browser settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-normal text-ink-900">6. Contact Our Data Officer</h2>
            <p>
              If you have any questions regarding your personal information, or wish to request data deletion, contact us at{' '}
              <a href="mailto:privacy@ateevibes.com" className="font-bold text-accent-700 underline">
                privacy@ateevibes.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
