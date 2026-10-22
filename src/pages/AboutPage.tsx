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

      <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Ateevibes Story</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-obsidian tracking-tight leading-tight">
            Knitted for Texture. Built for Distinction.
          </h1>

          <p className="text-base sm:text-lg text-graphite/80 leading-relaxed font-sans max-w-2xl mx-auto">
            Ateevibes brings together modern tailored fits, enduring craftsmanship, and signature jacquard knits. From textured dimensional weaves to soft waffle structures, our collection is engineered for confident contemporary menswear.
          </p>
        </div>

        {/* Brand Narrative Section with Side-by-Side Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-6 rounded-3xl overflow-hidden aspect-[4/5] bg-ivory border border-sandstone shadow-luxury">
            <img
              src="/catalog/about-craft.jpg"
              alt="Ateevibes Knitwear Craftsmanship"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="md:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Our Core Concept
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-obsidian tracking-tight">
              Same Print, Different Vibes.
            </h2>
            <p className="text-xs sm:text-sm text-graphite/80 leading-relaxed font-sans">
              We believe great design shouldn’t be locked into a single mood. Our signature &ldquo;Same Print, Different Vibes&rdquo; philosophy explores how an intricately engineered knit pattern or graphic motif transforms across distinct, curated color palettes.
            </p>
            <p className="text-xs sm:text-sm text-graphite/80 leading-relaxed font-sans">
              Whether you choose subtle muted neutrals or deep obsidian and rich tones, each garment delivers a structured fit with lasting dye brilliance that endures season after season.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="p-5 rounded-2xl bg-ivory border border-sandstone flex-1 min-w-[130px] shadow-sm">
                <span className="font-serif text-3xl font-normal text-obsidian block">16+</span>
                <span className="text-xs text-graphite/70 font-sans mt-0.5 block">Curated Silhouettes</span>
              </div>
              <div className="p-5 rounded-2xl bg-ivory border border-sandstone flex-1 min-w-[130px] shadow-sm">
                <span className="font-serif text-3xl font-normal text-obsidian block">6</span>
                <span className="text-xs text-graphite/70 font-sans mt-0.5 block">Specialized Weaves</span>
              </div>
              <div className="p-5 rounded-2xl bg-ivory border border-sandstone flex-1 min-w-[130px] shadow-sm">
                <span className="font-serif text-3xl font-normal text-obsidian block">100%</span>
                <span className="text-xs text-graphite/70 font-sans mt-0.5 block">Shape Retention</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Design Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight">
              What Defines Our Garments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-ivory border border-sandstone space-y-3.5 shadow-luxury">
              <div className="w-12 h-12 rounded-2xl bg-white border border-sandstone flex items-center justify-center text-gold shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian tracking-tight">Breathable Knits</h3>
              <p className="text-xs sm:text-sm text-graphite/70 leading-relaxed font-sans">
                We craft dimensional textures—including China jacquards, waffle honeycombs, and pique matty—that are lightweight, breathable, and structured.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-ivory border border-sandstone space-y-3.5 shadow-luxury">
              <div className="w-12 h-12 rounded-2xl bg-white border border-sandstone flex items-center justify-center text-gold shadow-sm">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian tracking-tight">Modern Cut</h3>
              <p className="text-xs sm:text-sm text-graphite/70 leading-relaxed font-sans">
                Designed for contemporary menswear silhouettes: balanced shoulder structure, clean drape, and a confident profile.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-ivory border border-sandstone space-y-3.5 shadow-luxury">
              <div className="w-12 h-12 rounded-2xl bg-white border border-sandstone flex items-center justify-center text-gold shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian tracking-tight">Refined Longevity</h3>
              <p className="text-xs sm:text-sm text-graphite/70 leading-relaxed font-sans">
                Comfort-first blends engineered for shape retention and enduring finish across frequent rotation.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Standard List */}
        <div className="bg-white rounded-3xl border border-sandstone p-8 sm:p-12 shadow-luxury space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Garment Standards
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
              Engineered For Modern Menswear:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              'Soft and comfortable fabric blends for daily rotation',
              'Shape retention construction that maintains its tailored fit',
              'Breathable, lightweight knitwear for active comfort',
              'Skin friendly materials with smooth touch feel',
              'Bright and long-lasting print and dye quality',
              'Stretchable fabric for ease of movement and flexibility',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gold/30">
                  <Check className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="text-xs sm:text-sm text-graphite font-sans font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-sandstone flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-graphite/70 font-sans">
              Experience the difference in texture, fit, and drape today.
            </span>
            <Link to="/shop" className="btn-primary px-7 py-3 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury">
              <span>Shop The Drop</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
