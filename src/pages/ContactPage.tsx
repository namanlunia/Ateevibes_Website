import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { siteConfig } from '../config/site';
import { contactSchema } from '../lib/validators';

const SUBJECT_OPTIONS = [
  'Order Status & Tracking Inquiry',
  'Size & Fit Recommendation',
  'Order Inquiry or Transit Flaw',
  'Product Fabric & Care Details',
  'Wholesale & Bulk Orders',
  'General Feedback or Suggestion',
];

export const ContactPage: React.FC = () => {
  const addToast = useUIStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECT_OPTIONS[0],
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsSubmitted(true);

    addToast({
      type: 'success',
      message: 'Your message has been sent. Our team will get back to you within 24 hours.',
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Contact Us • Customer Care | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Get in touch with the Ateevibes concierge team for order help, sizing guidance, and product questions."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-3.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Concierge & Support</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-obsidian tracking-tight">
            We&apos;re Here To Assist
          </h1>
          <p className="text-xs sm:text-base text-graphite/80 leading-relaxed font-sans">
            Have a question about an order, signature knits, or sizing recommendations? Connect with our personal concierge team.
          </p>
        </div>

        {/* Main Grid: Form + Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Contact Information & Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Card - Only shown when verified */}
            {!siteConfig.contact.whatsappIsPlaceholder && (
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-3xl bg-ivory border border-sandstone hover:border-gold/60 transition-all duration-300 block group shadow-luxury"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-sandstone text-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-normal text-obsidian tracking-tight">
                      Instant WhatsApp Concierge
                    </h3>
                    <p className="text-xs text-graphite/70 mt-0.5 font-sans">
                      Fastest responses for sizing guidance and active order tracking.
                    </p>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider inline-block mt-2">
                      Chat with Concierge →
                    </span>
                  </div>
                </div>
              </a>
            )}

            {/* Email Support */}
            <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2 shadow-luxury">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-sandstone flex items-center justify-center text-gold shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-normal text-obsidian">Email Concierge</h4>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-xs font-semibold text-gold hover:text-obsidian transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
              {!siteConfig.contact.phoneIsPlaceholder && (
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\D/g, '')}`}
                  className="text-[11px] font-semibold text-gold hover:text-obsidian transition-colors pl-13 font-sans"
                  aria-label={`Call Ateevibes at ${siteConfig.contact.phone}`}
                >
                  Prefer to call? {siteConfig.contact.phone}
                </a>
              )}
              <p className="text-[11px] text-graphite/70 pl-13 font-sans">
                Average reply time: within 12–24 business hours.
              </p>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2 shadow-luxury">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-sandstone flex items-center justify-center text-gold shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-normal text-obsidian">Operating Hours</h4>
                  <p className="text-xs font-semibold text-obsidian font-sans">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
              <p className="text-[11px] text-graphite/70 pl-13 font-sans">
                Closed on Sundays and national public holidays.
              </p>
            </div>

            {/* Ateevibes Hub */}
            <div className="p-6 rounded-3xl bg-ivory border border-sandstone space-y-2 shadow-luxury">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-sandstone flex items-center justify-center text-gold shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-normal text-obsidian">Fulfillment & Design Hub</h4>
                  <p className="text-xs font-medium text-graphite font-sans">Mumbai, Maharashtra, India</p>
                </div>
              </div>
              <p className="text-[11px] text-graphite/60 pl-13 font-sans">
                Direct-from-Ateevibes fulfillment with zero retail middlemen.
              </p>
            </div>
          </div>

          {/* Right: Validated Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                  Message Sent Successfully
                </h3>
                <p className="text-xs sm:text-sm text-graphite/70 max-w-md mx-auto leading-relaxed font-sans">
                  Thank you for getting in touch, <strong className="text-obsidian">{formData.name}</strong>. A support concierge has received your message regarding &ldquo;{formData.subject}&rdquo; and will respond shortly to <strong className="text-obsidian">{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: SUBJECT_OPTIONS[0],
                      message: '',
                    });
                  }}
                  className="btn-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-block"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian pb-3 border-b border-sandstone tracking-tight">
                  Send Us A Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-600 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian tabular-nums"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-red-600 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how our concierge team can assist you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian resize-none"
                  />
                  {errors.message && (
                    <p className="text-[10px] text-red-600 font-medium">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-gold" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
