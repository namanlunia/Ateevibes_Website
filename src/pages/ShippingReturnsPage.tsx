import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { siteConfig } from '../config/site';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{`Shipping & Returns Policy | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Read our shipping guidelines, free delivery threshold above ₹1,499, and hassle-free 7-day exchange and return policy."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Clear & Honest Policies</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-ink-900 tracking-tight">
            Shipping & 7-Day Exchanges
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-lg mx-auto">
            We want you to feel confident in every order. Here is everything you need to know about delivery timelines and finding your ideal fit.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-surface-tint border border-border space-y-2">
            <Truck className="w-6 h-6 text-accent-700" />
            <h4 className="font-display text-sm font-bold text-ink-900">Free Shipping</h4>
            <p className="text-xs text-ink-600">On all prepaid & COD orders exceeding ₹1,499 across India.</p>
          </div>
          <div className="p-5 rounded-3xl bg-surface-tint border border-border space-y-2">
            <Clock className="w-6 h-6 text-accent-700" />
            <h4 className="font-display text-sm font-bold text-ink-900">3–5 Days Transit</h4>
            <p className="text-xs text-ink-600">Dispatched in 24–48h via Express Air courier networks.</p>
          </div>
          <div className="p-5 rounded-3xl bg-surface-tint border border-border space-y-2">
            <RotateCcw className="w-6 h-6 text-accent-700" />
            <h4 className="font-display text-sm font-bold text-ink-900">7-Day Exchanges</h4>
            <p className="text-xs text-ink-600">Convenient return window if you need a different size.</p>
          </div>
          <div className="p-5 rounded-3xl bg-surface-tint border border-border space-y-2">
            <ShieldCheck className="w-6 h-6 text-accent-700" />
            <h4 className="font-display text-sm font-bold text-ink-900">Quality Assured</h4>
            <p className="text-xs text-ink-600">Secure mailer packing with quality verification checks.</p>
          </div>
        </div>

        {/* Section 1: Shipping Details */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-surface-tint border border-border flex items-center justify-center text-accent-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink-900">
                Domestic Shipping Policy
              </h2>
              <p className="text-xs text-ink-600">Fulfillment directly from our Surat, Gujarat hub</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-700 leading-relaxed">
            <div className="space-y-1">
              <h3 className="font-bold text-ink-900">1. Order Dispatch & Delivery Schedule</h3>
              <p>
                All confirmed orders are processed and handed over to our logistics partners (Bluedart, Delhivery, Express Air) within 24 to 48 business hours. Orders placed on Sundays or public holidays are dispatched on the next business day.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-ink-900">2. Shipping Charges</h3>
              <ul className="list-disc pl-5 space-y-1 text-ink-600">
                <li>
                  <strong className="text-ink-900">Orders ₹1,499 and above:</strong> 100% Free Express Delivery.
                </li>
                <li>
                  <strong className="text-ink-900">Orders under ₹1,499:</strong> Flat ₹79 standard shipping fee.
                </li>
              </ul>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-ink-900">3. Cash on Delivery (COD)</h3>
              <p>
                Cash on Delivery is available across 25,000+ Indian PIN codes with a flat ₹49 convenience and cash-handling fee. To prevent fraudulent orders, our automated system may request a quick 1-click confirmation via WhatsApp or SMS before dispatch.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-ink-900">4. Live Parcel Tracking</h3>
              <p>
                As soon as your shipment is picked up by the carrier, a real-time tracking link and AWB number are automatically sent to your registered phone number and email address. You can also track your parcel live anytime on our website at <Link to="/track-order" className="text-accent-700 font-bold underline">Track Order</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: 7-Day Doorstep Exchange Policy */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-surface-tint border border-border flex items-center justify-center text-accent-700">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink-900">
                7-Day Hassle-Free Size Exchanges
              </h2>
              <p className="text-xs text-ink-600">Reverse courier pickup with zero extra fees</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-700 leading-relaxed">
            <p>
              We want your t-shirt to fit and drape exactly the way you envision. If the size you ordered isn&apos;t quite right, we offer an easy 7-day size exchange.
            </p>

            <div className="p-4 rounded-2xl bg-surface-tint border border-border space-y-2">
              <h4 className="font-bold text-ink-900">Eligibility Criteria:</h4>
              <ul className="space-y-1.5 text-xs text-ink-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
                  <span>The item must be unused, unwashed, and in its original pristine condition.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
                  <span>All brand tags, wash labels, and original packaging must be intact.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
                  <span>Exchange request must be initiated within 7 calendar days of delivery.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-ink-900">How to request an exchange:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-border bg-surface-tint/60 space-y-1">
                  <span className="text-accent-700 font-extrabold text-xs block">STEP 1</span>
                  <p className="font-bold text-ink-900 text-xs">Reach Out</p>
                  <p className="text-[11px] text-ink-600">Contact our WhatsApp concierge with your Order ID and preferred size.</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-tint/60 space-y-1">
                  <span className="text-accent-700 font-extrabold text-xs block">STEP 2</span>
                  <p className="font-bold text-ink-900 text-xs">Courier Pickup</p>
                  <p className="text-[11px] text-ink-600">Our courier partner will arrive at your address to collect the original item.</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-tint/60 space-y-1">
                  <span className="text-accent-700 font-extrabold text-xs block">STEP 3</span>
                  <p className="font-bold text-ink-900 text-xs">Replacement Dispatched</p>
                  <p className="text-[11px] text-ink-600">Your requested replacement size is immediately shipped via Express courier.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-ink-600">
                Ready to initiate a size exchange?
              </span>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi Ateevibes team, I would like to request a size exchange.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-5 py-2 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Request Exchange on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
