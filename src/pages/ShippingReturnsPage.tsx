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
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Clear & Honest Policies</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-obsidian tracking-tight">
            Shipping & 7-Day Exchanges
          </h1>
          <p className="text-xs sm:text-base text-graphite/80 max-w-lg mx-auto font-sans">
            We want you to feel confident in every wardrobe choice. Here is everything you need to know about delivery milestones and finding your ideal fit.
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
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">7-Day Exchanges</h4>
            <p className="text-xs text-graphite/70 font-sans">Convenient return window if you need a different size.</p>
          </div>
          <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2.5 shadow-luxury">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">Quality Assured</h4>
            <p className="text-xs text-graphite/70 font-sans">Secure mailer packing with quality verification checks.</p>
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
              <p className="text-xs text-graphite/70 font-sans mt-0.5">Fulfillment directly from our Surat, Gujarat atelier</p>
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

        {/* Section 2: 7-Day Doorstep Exchange Policy */}
        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-sandstone">
            <div className="w-10 h-10 rounded-xl bg-ivory border border-sandstone flex items-center justify-center text-gold shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                7-Day Hassle-Free Size Exchanges
              </h2>
              <p className="text-xs text-graphite/70 font-sans mt-0.5">Reverse courier pickup with zero extra fees</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-graphite leading-relaxed font-sans">
            <p>
              We want your t-shirt to fit and drape exactly the way you envision. If the size you ordered isn&apos;t quite right, we offer an easy 7-day size exchange.
            </p>

            <div className="p-5 rounded-2xl bg-ivory border border-sandstone space-y-2.5">
              <h4 className="font-bold text-obsidian uppercase tracking-wider text-xs">Eligibility Criteria:</h4>
              <ul className="space-y-2 text-xs text-graphite/80">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>The item must be unused, unwashed, and in its original pristine condition.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>All brand tags, wash labels, and original packaging must be intact.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Exchange request must be initiated within 7 calendar days of delivery.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-obsidian uppercase tracking-wider text-xs">How to request an exchange:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-5 rounded-xl border border-sandstone bg-ivory space-y-1">
                  <span className="text-gold font-bold text-xs uppercase tracking-wider block">STEP 1</span>
                  <p className="font-bold text-obsidian text-xs">Reach Out</p>
                  <p className="text-[11px] text-graphite/70">Contact our WhatsApp concierge with your Order ID and preferred size.</p>
                </div>
                <div className="p-5 rounded-xl border border-sandstone bg-ivory space-y-1">
                  <span className="text-gold font-bold text-xs uppercase tracking-wider block">STEP 2</span>
                  <p className="font-bold text-obsidian text-xs">Courier Pickup</p>
                  <p className="text-[11px] text-graphite/70">Our courier partner will arrive at your address to collect the original item.</p>
                </div>
                <div className="p-5 rounded-xl border border-sandstone bg-ivory space-y-1">
                  <span className="text-gold font-bold text-xs uppercase tracking-wider block">STEP 3</span>
                  <p className="font-bold text-obsidian text-xs">Replacement Dispatched</p>
                  <p className="text-[11px] text-graphite/70">Your requested replacement size is immediately shipped via Express courier.</p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-sandstone flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-graphite/70">
                Ready to initiate a size exchange?
              </span>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi Ateevibes team, I would like to request a size exchange.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury"
              >
                <MessageCircle className="w-3.5 h-3.5 text-gold" />
                <span>Request Exchange on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
