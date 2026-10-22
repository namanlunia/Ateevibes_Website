import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { siteConfig } from '../config/site';
import { contactSchema } from '../lib/validators';

const SUBJECT_OPTIONS = [
  'Order Status & Tracking Inquiry',
  'Size & Fit Recommendation',
  'Exchange or Return Request',
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
          content="Get in touch with the Ateevibes concierge team for order help, sizing guidance, exchanges, or questions."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Concierge & Support</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-ink-900 tracking-tight">
            We&apos;re Here To Help
          </h1>
          <p className="text-xs sm:text-base text-ink-600 leading-relaxed">
            Have a question about an order, fabric textures, or finding your ideal size? Reach out through any of our channels below.
          </p>
        </div>

        {/* Main Grid: Form + Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Information & Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi Ateevibes team, I would like some assistance.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl bg-surface-tint border border-border hover:border-ink-900 transition-colors block group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900">
                    Instant WhatsApp Support
                  </h3>
                  <p className="text-xs text-ink-600 mt-0.5">
                    Fastest responses for sizing advice and active order status.
                  </p>
                  <span className="text-xs font-bold text-accent-700 inline-block mt-2">
                    Chat with Concierge →
                  </span>
                </div>
              </div>
            </a>

            {/* Email Support */}
            <div className="p-6 rounded-3xl bg-surface-tint border border-border space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink-900">Email Concierge</h4>
                  <a
                    href="mailto:support@ateevibes.com"
                    className="text-xs font-semibold text-accent-700 hover:underline"
                  >
                    support@ateevibes.com
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-ink-600 pl-13">
                Average reply time: within 12–24 business hours.
              </p>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-3xl bg-surface-tint border border-border space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink-900">Operating Hours</h4>
                  <p className="text-xs font-bold text-ink-900">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
              <p className="text-[11px] text-ink-600 pl-13">
                Closed on Sundays and national public holidays.
              </p>
            </div>

            {/* Atelier & Hub */}
            <div className="p-6 rounded-3xl bg-surface-tint border border-border space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink-900">Dispatch & Design Hub</h4>
                  <p className="text-xs font-medium text-ink-700">Surat, Gujarat - 395002, India</p>
                </div>
              </div>
              <p className="text-[11px] text-ink-500 pl-13">
                Direct-from-atelier fulfillment with zero retail middlemen.
              </p>
            </div>
          </div>

          {/* Right: Validated Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-ink-900">
                  Message Sent Successfully
                </h3>
                <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
                  Thank you for getting in touch, <strong className="text-ink-900">{formData.name}</strong>. A support specialist has received your message regarding &ldquo;{formData.subject}&rdquo; and will respond shortly to <strong className="text-ink-900">{formData.email}</strong>.
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
                  className="btn-secondary px-6 py-2.5 text-xs font-bold inline-block"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-ink-900 pb-2 border-b border-border">
                  Send Us A Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-status-error">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-status-error">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900 tabular-nums"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-status-error">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-ink-900">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can assist you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900 resize-none"
                  />
                  {errors.message && (
                    <p className="text-[10px] text-status-error">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
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
