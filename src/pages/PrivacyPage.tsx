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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-obsidian tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-base text-graphite/80 max-w-lg mx-auto font-sans">
            Last updated: October 2026. We are committed to safeguarding your personal information and respecting your privacy rights.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury space-y-8 text-xs sm:text-sm text-graphite leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-normal text-obsidian tracking-tight">1. Information We Collect</h2>
            <p>
              When you purchase from Ateevibes or create an account, we collect necessary transactional information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-graphite/80">
              <li>Contact details: Name, mobile number, email address.</li>
              <li>Delivery information: Shipping address, city, state, and 6-digit postal PIN code.</li>
              <li>Order history: Items purchased, selected sizes, colours, and dates of transactions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-normal text-obsidian tracking-tight">2. Payment Security & Encryption</h2>
            <p>
              All online payments on Ateevibes (UPI, Debit/Credit Cards, Net Banking) are routed through authorized PCI-DSS Level 1 certified payment gateways (e.g. Razorpay).
            </p>
            <p className="font-semibold text-obsidian">
              We never store or log your card numbers, CVV security codes, UPI PINs, or online banking passwords on our servers or client storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-normal text-obsidian tracking-tight">3. How Your Data Is Used</h2>
            <ul className="list-disc pl-5 space-y-1 text-graphite/80">
              <li>Processing, packing, and dispatching your orders.</li>
              <li>Sending live tracking updates and invoice confirmations via SMS, WhatsApp, and email.</li>
              <li>Providing customer support and order fulfillment assistance.</li>
              <li>With your permission, sharing private drops and exclusive promotional offers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-normal text-obsidian tracking-tight">4. Sharing with Third Parties</h2>
            <p>
              We only share your shipping data with trusted third-party logistics partners (such as Bluedart, Delhivery, or Indian Postal Express) strictly to facilitate courier delivery of your parcel. We do not sell or rent customer data to marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-normal text-obsidian tracking-tight">5. Cookies & Local Storage</h2>
            <p>
              We use lightweight local storage tokens to remember your shopping cart items, wishlist, and preferred filters during your session. You can clear this data anytime through your browser settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-normal text-obsidian tracking-tight">6. Contact Our Data Officer</h2>
            <p>
              If you have any questions regarding your personal information, or wish to request data deletion, contact us at{' '}
              <a href="mailto:privacy@ateevibes.com" className="font-bold text-gold hover:text-obsidian transition-colors underline">
                privacy@ateevibes.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
