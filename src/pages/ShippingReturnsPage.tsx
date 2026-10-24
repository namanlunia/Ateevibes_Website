import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { siteConfig } from '../config/site';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{`Shipping & Order Policy | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Learn about Ateevibes order fulfillment, express domestic shipping timelines, free delivery threshold above ₹1,499, and order quality inspection policies."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Ateevibes Fulfillment & Orders</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-obsidian tracking-tight">
            Shipping & Order Policy
          </h1>
          <p className="text-xs sm:text-base text-graphite/80 max-w-lg mx-auto font-sans">
            Every Ateevibes garment is engineered, inspected, and dispatched directly from the Ateevibes Mumbai production hub. Review our delivery timelines and customer support guidelines below.
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
            <ShieldCheck className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">Inspected Quality</h4>
            <p className="text-xs text-graphite/70 font-sans">Multi-point manual check for stitches and fabric before dispatch.</p>
          </div>
          <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2.5 shadow-luxury">
            <MessageCircle className="w-6 h-6 text-gold" />
            <h4 className="font-serif text-base font-normal text-obsidian tracking-tight">Concierge Help</h4>
            <p className="text-xs text-graphite/70 font-sans">Direct WhatsApp assistance for sizing questions and order status.</p>
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

        {/* Section 2: Order Quality & Return Policy Notice */}
        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-sandstone">
            <div className="w-10 h-10 rounded-xl bg-ivory border border-sandstone flex items-center justify-center text-gold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                Order Verification & Return Policy
              </h2>
              <p className="text-xs text-graphite/70 font-sans mt-0.5">Accurate, transparent guidelines for every customer</p>
            </div>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-graphite leading-relaxed font-sans">
            <div className="p-5 rounded-2xl bg-ivory border border-sandstone space-y-2">
              <div className="flex items-center gap-2 text-obsidian font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-gold shrink-0" />
                <span>Notice Regarding Returns</span>
              </div>
              <p className="text-xs text-graphite/80 leading-relaxed">
                All sales are final once delivered. Because each garment is produced in specialized limited fabric runs and tailored with dimensional knits, Ateevibes does not accept standard returns or exchanges, unless an item has arrived with transit damage reported within 48 hours or an incorrect variant was dispatched.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">Ateevibes Quality Guarantee</h3>
              <p>
                Before any t-shirt leaves our Mumbai workshop, it undergoes thorough quality verification:
              </p>
              <ul className="space-y-2 text-xs text-graphite/80 pt-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Stitching, collar ribbing, and hem density are inspected for structural integrity.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Chinese jacquard weaves and tie-dye wash patterns are verified against master standards.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Garments are packaged in secure protective mailers to prevent dust or moisture during transit.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-obsidian uppercase tracking-wider text-xs">Damaged or Incorrect Items</h3>
              <p>
                In the rare instance that your package arrives with physical damage from courier transit or you received a size or colorway different from what you ordered:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-xl border border-sandstone bg-ivory space-y-1">
                  <span className="text-gold font-bold text-[10px] uppercase tracking-wider block">STEP 1</span>
                  <p className="font-bold text-obsidian text-xs">Notify Within 48 Hours</p>
                  <p className="text-[11px] text-graphite/70">Reach out to our WhatsApp concierge or email support@ateevibes.com within 48 hours of parcel delivery.</p>
                </div>
                <div className="p-4 rounded-xl border border-sandstone bg-ivory space-y-1">
                  <span className="text-gold font-bold text-[10px] uppercase tracking-wider block">STEP 2</span>
                  <p className="font-bold text-obsidian text-xs">Share Unboxing Evidence</p>
                  <p className="text-[11px] text-graphite/70">Provide clear photos or video showing the outer shipping label, packaging condition, and the garment flaw.</p>
                </div>
                <div className="p-4 rounded-xl border border-sandstone bg-ivory space-y-1">
                  <span className="text-gold font-bold text-[10px] uppercase tracking-wider block">STEP 3</span>
                  <p className="font-bold text-obsidian text-xs">Prompt Ateevibes Resolution</p>
                  <p className="text-[11px] text-graphite/70">Once verified by our quality control manager, a replacement piece is immediately dispatched.</p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-sandstone flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-bold text-obsidian text-xs">Questions About Sizing Before Ordering?</p>
                <p className="text-[11px] text-graphite/70">Check our comprehensive <Link to="/size-guide" className="text-gold underline hover:text-obsidian">Size Guide</Link> or chat with our team.</p>
              </div>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi Ateevibes team, I have a question about sizing and ordering.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury"
              >
                <MessageCircle className="w-3.5 h-3.5 text-gold" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
