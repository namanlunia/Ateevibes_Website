import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Feather,
  ShieldCheck,
  Check,
  Award,
  HeartHandshake,
} from 'lucide-react';
import { siteConfig } from '../config/site';

export const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{`About Us • Feel The Vibes | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Learn about Ateevibes - crafted for modern Indian men with architectural China jacquard weaves, waffle textures, and fair-price luxury."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Ateevibes Story</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black text-ink-900 tracking-tight leading-tight">
            Tired of Flat Cotton. Built for Tactile Vibes.
          </h1>

          <p className="text-base sm:text-lg text-ink-700 leading-relaxed font-normal">
            Ateevibes was founded on a simple observation: men’s daily t-shirts had become boring, flat, and disposable. We set out to engineer rich knit architectures that make every day feel like a statement.
          </p>
        </div>

        {/* Brand Narrative Section with Side-by-Side Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 rounded-3xl overflow-hidden aspect-[4/5] bg-surface-tint border border-border shadow-md">
            <img
              src="/catalog/1007-main.webp"
              alt="Ateevibes Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-700">
              Our Creative Foundation
            </span>
            <h2 className="font-display text-3xl font-black text-ink-900">
              Same Print, Different Vibes.
            </h2>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              We believe great design shouldn’t be locked into a single shade. Our signature &ldquo;Same Print, Different Vibes&rdquo; philosophy starts with intricately engineered China jacquard or artistic dye prints, then explores how that exact geometric weave transforms across distinct tones.
            </p>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              Whether you dress in understated sage tones or bold royal golds, the architecture of the garment stays crisp, structured, and unmistakably distinct.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="p-4 rounded-2xl bg-surface-tint border border-border flex-1 min-w-[140px]">
                <span className="font-display text-2xl font-black text-ink-900 block">16+</span>
                <span className="text-xs text-ink-600">Curated Silhouettes</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-tint border border-border flex-1 min-w-[140px]">
                <span className="font-display text-2xl font-black text-ink-900 block">6</span>
                <span className="text-xs text-ink-600">Specialized Weaves</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-tint border border-border flex-1 min-w-[140px]">
                <span className="font-display text-2xl font-black text-ink-900 block">100%</span>
                <span className="text-xs text-ink-600">Pre-Shrunk Washed</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              Guiding Principles
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-900">
              What Sets Ateevibes Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-tint border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900">Architectural Knits</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                We craft dimensional textures—including 3D China jacquards, waffle honeycombs, and pique matty—that look premium and resist body clinging.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-surface-tint border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900">Tailored Indian Fit</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Patterned specifically for Indian body shapes: clean shoulder taper, flattering bicep fit, and balanced hem length that never looks sloppy untucked.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-surface-tint border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900">Radical Honesty</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                No fake certification badges or inflated marketing claims. We deliver honest craftsmanship directly to your doorstep at fair direct-to-consumer prices.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Standard List */}
        <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              The Atelier Standard
            </span>
            <h3 className="font-display text-2xl font-bold text-ink-900">
              Every Ateevibes Garment Includes:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              'Pre-shrunk fabric wash to minimize post-laundry shrinkage',
              'Reinforced rib collar bands that maintain shape wash after wash',
              'Double-needle lockstitch on sleeves and bottom hem',
              'Skin-friendly dyes resistant to color fading in Indian sunshine',
              'Lightweight breathable recovery yarns for hot & humid days',
              'Individual tamper-evident, sealed parcel packaging',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-green/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-accent-700" />
                </div>
                <span className="text-xs sm:text-sm text-ink-800 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-ink-600">
              Experience the difference in texture and drape today.
            </span>
            <Link to="/shop" className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-1.5">
              <span>Shop The Drop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
