import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { useUIStore } from '../../store/uiStore';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

interface NewsletterForm {
  email: string;
}

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const addToast = useUIStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterForm>();

  const onSubmit = async (_data: NewsletterForm) => {
    await new Promise((r) => setTimeout(r, 400));
    setSubscribed(true);
    reset();

    // Trigger green & cream confetti dots as specified in Section 6.2
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#cdf0a7', '#faf3d0', '#8fbf5a', '#1c241a'],
      shapes: ['circle'],
      scalar: 0.9,
    });

    addToast({
      type: 'success',
      message: 'Welcome to the Ateevibes rotation! Check your inbox soon.',
    });
  };

  return (
    <footer className="relative bg-gradient-to-b from-surface via-surface-tint to-brand-green/25 border-t border-border mt-20 pt-16 pb-12 overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Assurance Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-brand-green/50 text-ink-900 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink-900">Free Express Shipping</p>
              <p className="text-[11px] text-ink-600">On all orders above ₹1,499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-brand-cream text-ink-900 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink-900">7-Day Easy Returns</p>
              <p className="text-[11px] text-ink-600">Hassle-free exchange policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-brand-green/50 text-ink-900 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink-900">100% Quality Assured</p>
              <p className="text-[11px] text-ink-600">Premium knits & lasting prints</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-brand-cream text-ink-900 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink-900">Secure Payments</p>
              <p className="text-[11px] text-ink-600">UPI, Cards & Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter: 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-8 lg:gap-10 items-start py-14">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src="/brand/logo.png" alt="Ateevibes" className="h-9 w-auto" />
            </Link>
            <p className="text-sm font-medium text-ink-700 italic font-display">
              "Feel the Vibes"
            </p>
            <p className="text-xs text-ink-600 leading-relaxed max-w-sm">
              Same Print, Different Vibes. Crafting contemporary men's t-shirts in China jacquard, waffle knits, ultra-soft matty, and vivid tie-dye.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-surface border border-border text-ink-700 hover:text-ink-900 hover:border-ink-900 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-surface border border-border text-ink-700 hover:text-ink-900 hover:border-ink-900 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href={siteConfig.socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2.5 rounded-full bg-surface border border-border text-ink-700 hover:text-ink-900 hover:border-ink-900 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="p-2.5 rounded-full bg-surface border border-border text-ink-700 hover:text-ink-900 hover:border-ink-900 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-ink-900 uppercase tracking-wider">Shop</p>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-700">
              <li><Link to="/shop" className="hover:text-ink-900 transition-colors">All T-Shirts</Link></li>
              <li><Link to="/shop/round-neck" className="hover:text-ink-900 transition-colors">Round Neck</Link></li>
              <li><Link to="/shop/polo-collar" className="hover:text-ink-900 transition-colors">Polo & Collar</Link></li>
              <li><Link to="/shop/jacquard" className="hover:text-ink-900 transition-colors">Jacquard Knits</Link></li>
              <li><Link to="/shop/printed" className="hover:text-ink-900 transition-colors">Printed & Tai Dai</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-ink-900 uppercase tracking-wider">Help</p>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-700">
              <li><Link to="/track-order" className="hover:text-ink-900 transition-colors">Track Order</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-ink-900 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="hover:text-ink-900 transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-ink-900 transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-ink-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-ink-900 uppercase tracking-wider">Stay in the Loop</p>
            <p className="text-xs text-ink-600">
              Subscribe for weekly style drops, fabric stories, and exclusive insider promo codes.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-brand-green/40 border border-brand-green flex items-center gap-2.5 text-xs text-ink-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-accent-700 shrink-0" />
                <span>You're in! Welcome to the Ateevibes community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="relative flex items-center bg-white border border-border focus-within:border-ink-900 rounded-full p-1.5 transition-colors shadow-sm">
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Please enter a valid email address',
                      pattern: {
                        value: EMAIL_REGEX,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 bg-transparent pl-5 pr-3 py-2 text-xs sm:text-sm text-ink-900 placeholder:text-ink-600/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe"
                    className="btn-primary px-5 py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-full shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errors.email && (
                  <p className="text-[11px] text-status-error font-medium pl-4">
                    {errors.email.message}
                  </p>
                )}
              </form>
            )}

            {/* Payment Method Badges */}
            <div className="pt-3">
              <p className="text-[10px] font-bold text-ink-600 uppercase tracking-wider mb-2">Accepted Payments</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 bg-white rounded-md border border-border text-ink-900">UPI</span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-white rounded-md border border-border text-ink-900">Cards</span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-white rounded-md border border-border text-ink-900">NetBanking</span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-white rounded-md border border-border text-ink-900">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Line */}
        <div className="pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-600 gap-4">
          <p>© {new Date().getFullYear()} Ateevibes Apparels. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-ink-900 transition-colors">Our Story</Link>
            <Link to="/privacy" className="hover:text-ink-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
