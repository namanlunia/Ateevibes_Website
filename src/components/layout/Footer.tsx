import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';
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

    // Trigger champagne gold & ivory confetti dots
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#c9a45c', '#dfca95', '#f7f4ee', '#292925'],
      shapes: ['circle'],
      scalar: 0.9,
    });

    addToast({
      type: 'success',
      message: 'Welcome to the Ateevibes rotation! Check your inbox soon.',
    });
  };

  return (
    <footer className="relative bg-obsidian text-ivory border-t border-sandstone/20 mt-20 pt-16 pb-12 overflow-hidden">
      {/* Subtle ambient gold atmospheric glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Assurance Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-sandstone/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-graphite text-gold border border-gold/30 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ivory">Free Express Shipping</p>
              <p className="text-[11px] text-ivory/60">On all orders above ₹1,499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-graphite text-gold border border-gold/30 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ivory">Ateevibes Direct</p>
              <p className="text-[11px] text-ivory/60">Crafted in Mumbai, Maharashtra</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-graphite text-gold border border-gold/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ivory">100% Quality Assured</p>
              <p className="text-[11px] text-ivory/60">Premium knits & lasting prints</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-graphite text-gold border border-gold/30 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ivory">Flexible Payments</p>
              <p className="text-[11px] text-ivory/60">UPI, Cards & Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter: 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-8 lg:gap-10 items-start py-14">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="Ateevibes Home">
              <img src="/brand/emblem.svg" alt="" className="h-9 w-9 object-contain" />
              <span className="font-display text-2xl font-bold tracking-widest text-gold">ATEEVIBES</span>
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-sans">
              Feel the Vibes
            </p>
            <p className="text-xs text-ivory/70 leading-relaxed max-w-sm font-sans">
              Same Print, Different Vibes. Crafting contemporary men's t-shirts in China jacquard, waffle knits, ultra-soft matty, and vivid tie-dye.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-graphite border border-sandstone/20 text-ivory/80 hover:text-gold hover:border-gold/50 transition-colors"
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
                className="p-2.5 rounded-full bg-graphite border border-sandstone/20 text-ivory/80 hover:text-gold hover:border-gold/50 transition-colors"
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
                className="p-2.5 rounded-full bg-graphite border border-sandstone/20 text-ivory/80 hover:text-gold hover:border-gold/50 transition-colors"
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
                className="p-2.5 rounded-full bg-graphite border border-sandstone/20 text-ivory/80 hover:text-gold hover:border-gold/50 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gold uppercase tracking-[0.1em]">Shop</p>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory/70">
              <li><Link to="/shop" className="hover:text-gold transition-colors">All T-Shirts</Link></li>
              <li><Link to="/shop/round-neck" className="hover:text-gold transition-colors">Round Neck</Link></li>
              <li><Link to="/shop/polo-collar" className="hover:text-gold transition-colors">Polo & Collar</Link></li>
              <li><Link to="/shop/jacquard" className="hover:text-gold transition-colors">Jacquard Knits</Link></li>
              <li><Link to="/shop/printed" className="hover:text-gold transition-colors">Printed & Tai Dai</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gold uppercase tracking-[0.1em]">Help</p>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory/70">
              <li><Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-gold transition-colors">Shipping & Order Policy</Link></li>
              <li><Link to="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gold uppercase tracking-[0.1em]">Stay in the Loop</p>
            <p className="text-xs text-ivory/70 leading-relaxed font-sans">
              Subscribe for limited-batch seasonal drops, architectural fabric stories, and exclusive member releases.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-graphite border border-gold/40 flex items-center gap-2.5 text-xs text-ivory font-medium">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span>You're in! Welcome to the Ateevibes community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="relative flex items-center bg-graphite border border-sandstone/25 focus-within:border-gold rounded-full p-1.5 transition-colors shadow-sm">
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
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-3 py-2 text-xs sm:text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe"
                    className="btn-gold px-5 py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-full shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-medium pl-4">
                    {errors.email.message}
                  </p>
                )}
              </form>
            )}

            {/* Payment Method Badges */}
            <div className="pt-3">
              <p className="text-[10px] font-bold text-ivory/50 uppercase tracking-wider mb-2">Accepted Payments</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 bg-graphite rounded-md border border-sandstone/20 text-ivory/80">UPI</span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-graphite rounded-md border border-sandstone/20 text-ivory/80">Cards</span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-graphite rounded-md border border-sandstone/20 text-ivory/80">NetBanking</span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-graphite rounded-md border border-sandstone/20 text-ivory/80">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Line */}
        <div className="pt-8 border-t border-sandstone/15 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>© {new Date().getFullYear()} Ateevibes Apparels. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gold transition-colors">Our Story</Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
