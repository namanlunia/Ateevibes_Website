import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Truck,
  Clock,
  ShieldCheck,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import { siteConfig } from '../config/site';
import {
  getPolicySections,
  getPolicyGlance,
  POLICY_LEGAL_NOTE,
} from '../config/policyCopy';

export const ShippingReturnsPage: React.FC = () => {
  const policyGlance = getPolicyGlance();
  const policySections = getPolicySections();
  return (
    <>
      <Helmet>
        <title>{`Shipping, Returns & Exchanges | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Learn about Ateevibes order fulfillment, express domestic shipping timelines, free delivery threshold above ₹1,499, and our authoritative returns and size-exchange policies."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Ateevibes Delivery & Returns</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-obsidian tracking-tight">
            Shipping, Returns & Exchanges
          </h1>
          <p className="text-xs sm:text-base text-graphite/80 max-w-lg mx-auto font-sans">
            Every Ateevibes garment is engineered, inspected, and dispatched directly from our Mumbai production hub. Review our delivery timelines, returns policy, and size exchange guidelines below.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2.5 shadow-luxury">
            <Truck className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">Free Shipping</h4>
            <p className="text-xs text-graphite/70 font-sans">On all prepaid & COD orders exceeding ₹1,499 across India.</p>
          </div>
          <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2.5 shadow-luxury">
            <Clock className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">3–5 Days Transit</h4>
            <p className="text-xs text-graphite/70 font-sans">Dispatched in 24–48h via Express Air courier networks.</p>
          </div>
          <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2.5 shadow-luxury">
            <RotateCcw className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">Clear Returns</h4>
            <p className="text-xs text-graphite/70 font-sans">24h returns for defective/damaged orders; 48h size exchanges.</p>
          </div>
          <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2.5 shadow-luxury">
            <MessageCircle className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">Concierge Help</h4>
            <p className="text-xs text-graphite/70 font-sans">Direct WhatsApp & email assistance for orders and sizing.</p>
          </div>
        </div>

        {/* Section 1: Shipping Details */}
        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-sandstone">
            <div className="w-10 h-10 rounded-xl bg-ivory border border-sandstone flex items-center justify-center text-gold shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                Domestic Shipping Policy
              </h2>
              <p className="text-xs text-graphite/70 font-sans mt-0.5">Fulfillment directly from Ateevibes, Mumbai, Maharashtra</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-graphite leading-relaxed font-sans">
            <div className="space-y-1.5">
              <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">1. Order Dispatch & Delivery Schedule</h3>
              <p>
                All confirmed orders are processed and handed over to our logistics partners (Bluedart, Delhivery, Express Air) within 24 to 48 business hours. Orders placed on Sundays or public holidays are dispatched on the next business day.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">2. Shipping Charges</h3>
              <ul className="list-disc pl-5 space-y-1 text-graphite/80">
                <li>
                  <strong className="text-obsidian">Orders ₹1,499 and above:</strong> 100% Free Express Delivery.
                </li>
                <li>
                  <strong className="text-obsidian">Orders under ₹1,499:</strong> Flat ₹79 standard shipping fee.
                </li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">3. Cash on Delivery (COD)</h3>
              <p>
                Cash on Delivery is available across 25,000+ Indian PIN codes with a flat ₹49 convenience and cash-handling fee. To prevent fraudulent orders, our automated system may request a quick 1-click confirmation via WhatsApp or SMS before dispatch.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">4. Live Parcel Tracking</h3>
              <p>
                As soon as your shipment is picked up by the carrier, a real-time tracking link and AWB number are automatically sent to your registered phone number and email address. You can also track your parcel live anytime on our website at <Link to="/track-order" className="text-gold font-bold underline hover:text-obsidian transition-colors">Track Order</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Returns, Refunds & Exchanges Policy */}
        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury space-y-8">
          <div className="flex items-center gap-3.5 pb-4 border-b border-sandstone">
            <div className="w-10 h-10 rounded-xl bg-ivory border border-sandstone flex items-center justify-center text-gold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                Returns, Refunds & Exchanges Policy
              </h2>
              <p className="text-xs text-graphite/70 font-sans mt-0.5">Authoritative policy guidelines for every order</p>
            </div>
          </div>

          {/* Policy at a Glance Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">
              Policy at a Glance
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-sandstone">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-ivory border-b border-sandstone text-[11px] font-bold uppercase text-graphite/70 tracking-wider">
                    <th className="py-3 px-4 w-1/4">Aspect</th>
                    <th className="py-3 px-4">Policy Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone bg-white">
                  {policyGlance.map((row) => (
                    <tr key={row.label} className="hover:bg-ivory/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-obsidian">{row.label}</td>
                      <td className="py-3.5 px-4 text-graphite/80 leading-relaxed font-sans">{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Structured Policy Sections */}
          <div className="space-y-6 pt-2">
            {policySections.map((section) => (
              <div key={section.id} className="space-y-2">
                <h3 className="font-serif text-lg font-normal text-obsidian tracking-tight">
                  {section.title}
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-graphite/80 leading-relaxed font-sans">
                  {section.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Rights Legal Note */}
          <div className="pt-4 border-t border-sandstone">
            <p className="text-xs text-graphite/70 italic font-sans">
              {POLICY_LEGAL_NOTE}
            </p>
          </div>

          {/* Concierge Help Strip */}
          <div className="pt-4 border-t border-sandstone flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="font-bold text-obsidian text-xs">Need to raise a request or have questions?</p>
              <p className="text-[11px] text-graphite/70">
                Contact us via our <Link to="/contact" className="text-gold underline hover:text-obsidian">Contact Page</Link> or email {siteConfig.contact.email}.
              </p>
            </div>
            <Link
              to="/contact"
              className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury"
            >
              <MessageCircle className="w-3.5 h-3.5 text-gold" />
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
