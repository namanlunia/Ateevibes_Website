import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Feather,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { siteConfig } from '../config/site';

export const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{`About Us • Feel The Vibes | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Learn about Ateevibes — premium quality t-shirts engineered with dimensional knits, all-day comfort, and our signature Same Print, Different Vibes concept."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Ateevibes Story</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-normal text-ink-900 tracking-tight leading-tight">
            Knitted for Texture. Built for Comfort.
          </h1>

          <p className="text-base sm:text-lg text-ink-700 leading-relaxed font-normal">
            Ateevibes brings together modern fit, durable craftsmanship, and premium quality knits. From textured China jacquards to soft waffle weaves, our collection is engineered for effortless all-day comfort.
          </p>
        </div>

        {/* Brand Narrative Section with Side-by-Side Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 rounded-3xl overflow-hidden aspect-[4/5] bg-surface-tint border border-border shadow-md">
            <img
              src="/catalog/about-craft.jpg"
              alt="Ateevibes Knitwear Craftsmanship"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="md:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-700">
              Our Core Concept
            </span>
            <h2 className="font-display text-3xl font-normal text-ink-900">
              Same Print, Different Vibes.
            </h2>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              We believe great design shouldn’t be locked into a single mood. Our signature &ldquo;Same Print, Different Vibes&rdquo; philosophy explores how an intricately engineered knit pattern or graphic motif transforms across distinct, curated color palettes.
            </p>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              Whether you choose subtle muted neutrals or vibrant statement colorways, each garment delivers a perfect fit with bright and long-lasting prints that maintain their vibrancy wear after wear.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="p-4 rounded-2xl bg-surface-tint border border-border flex-1 min-w-[140px]">
                <span className="font-display text-2xl font-normal text-ink-900 block">16+</span>
                <span className="text-xs text-ink-600">Curated Silhouettes</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-tint border border-border flex-1 min-w-[140px]">
                <span className="font-display text-2xl font-normal text-ink-900 block">6</span>
                <span className="text-xs text-ink-600">Specialized Weaves</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-tint border border-border flex-1 min-w-[140px]">
                <span className="font-display text-2xl font-normal text-ink-900 block">100%</span>
                <span className="text-xs text-ink-600">Shape Retention</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              Design Philosophy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-ink-900">
              What Defines Our Garments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-tint border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-normal text-ink-900">Breathable Knits</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                We craft dimensional textures—including China jacquards, waffle honeycombs, and pique matty—that are lightweight, breathable, and moisture friendly.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-surface-tint border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-normal text-ink-900">Modern Fit</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Designed for contemporary silhouettes: balanced shoulder structure, clean drape, and a trendy look that offers all-day comfort.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-surface-tint border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-normal text-ink-900">Premium Quality</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                Soft and comfortable fabric blends engineered for durability and reliable shape retention throughout everyday rotation.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Standard List */}
        <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              Garment Standards
            </span>
            <h3 className="font-display text-2xl font-normal text-ink-900">
              Engineered For Everyday Wear:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              'Soft and comfortable fabric blends for daily wear',
              'Shape retention construction that maintains its modern fit',
              'Breathable, lightweight knitwear for active comfort',
              'Skin friendly materials with smooth touch feel',
              'Bright and long-lasting print and dye quality',
              'Stretchable fabric for ease of movement and flexibility',
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
