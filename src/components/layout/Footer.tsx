import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { activeSocials } from '../../config/site';
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

            {/* Social Links: Confirmed active channels only (Facebook and X) */}
            <div className="flex items-center gap-3 pt-2">
              {activeSocials.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="w-11 h-11 rounded-full border border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-obsidian hover:border-gold focus-visible:bg-gold focus-visible:text-obsidian focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian transition-[background-color,color,border-color] duration-200"
                >
                  {social.key === 'facebook' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                    </svg>
                  )}
                  {social.key === 'x' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                </a>
              ))}
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
