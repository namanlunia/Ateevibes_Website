import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';
import { siteConfig } from '../config/site';

export const TermsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{`Terms & Conditions | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Terms and conditions governing the purchase of products and use of the Ateevibes e-commerce platform."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-ink-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-lg mx-auto">
            Please read these terms and conditions carefully before placing an order on Ateevibes.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm text-ink-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-ink-900">1. Acceptance of Terms</h2>
            <p>
              By accessing our website and purchasing any product, you agree to be bound by these Terms and Conditions. These terms apply to all users of the site, including browsers, customers, and contributors of content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-ink-900">2. Pricing & Taxes</h2>
            <p>
              All prices shown on Ateevibes are quoted in Indian Rupees (INR ₹) and are inclusive of all applicable Goods and Services Tax (GST). We reserve the right to modify prices or discontinue items at any time without prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-ink-900">3. Orders & Cancellation</h2>
            <p>
              We reserve the right to refuse or cancel any order for reasons including non-serviceable PIN codes, stock unavailability, or suspected fraudulent activity. You may cancel your order at any time before it has been dispatched from our Surat hub by contacting support.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-ink-900">4. Product Representation & Colors</h2>
            <p>
              We strive to display garment colors, China jacquard weaves, and tie-dye gradients as accurately as possible. However, actual colors may vary slightly depending on monitor color calibration, lighting conditions during photography, and natural variations in batch dyeing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-ink-900">5. Intellectual Property</h2>
            <p>
              All trademarks, graphics, logo marks (&ldquo;Feel the Vibes&rdquo;), product photography, and text content on this site are the exclusive intellectual property of Ateevibes. Reproduction or commercial exploitation without written consent is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-ink-900">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and any separate agreements shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat, India.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
