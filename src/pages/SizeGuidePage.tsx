import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Ruler,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { SIZE_CHART, FIT_NOTES } from '../data/sizeChart';
import { siteConfig } from '../config/site';

export const SizeGuidePage: React.FC = () => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <>
      <Helmet>
        <title>{`Size Guide & Fit Chart | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Find your perfect fit with our comprehensive men's t-shirt size chart in inches and centimeters. Tips on chest, length, and shoulder measurements."
        />
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-wider">
            <Ruler className="w-3.5 h-3.5" />
            <span>Tailored Fit System</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-ink-900 tracking-tight">
            Size Guide & Fit Chart
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-lg mx-auto">
            Ateevibes silhouettes are patterned specifically for modern Indian body proportions, offering clean contours without uncomfortable cling.
          </p>
        </div>

        {/* Interactive Measurement Table */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-normal text-ink-900">
                Garment Measurements
              </h2>
              <p className="text-xs text-ink-600">Measured flat across relaxed garments</p>
            </div>

            {/* Unit Toggle Switch */}
            <div className="flex items-center gap-1 p-1 bg-surface-tint rounded-xl border border-border self-start sm:self-auto">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  unit === 'in'
                    ? 'bg-tab-active-bg text-tab-active-text shadow-sm'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  unit === 'cm'
                    ? 'bg-tab-active-bg text-tab-active-text shadow-sm'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold uppercase text-ink-600 tracking-wider">
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Chest ({unit})</th>
                  <th className="py-3 px-3">Length ({unit})</th>
                  <th className="py-3 px-3">Shoulder ({unit})</th>
                  <th className="py-3 px-3">Half Sleeve ({unit})</th>
                  <th className="py-3 px-3">Full Sleeve ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-surface-tint/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-ink-900 font-display text-base">
                      {row.size}
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-semibold text-ink-800">
                      {unit === 'in' ? `${row.chestInches}"` : `${row.chestCm} cm`}
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-semibold text-ink-800">
                      {unit === 'in' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-semibold text-ink-800">
                      {unit === 'in' ? `${row.shoulderInches}"` : `${row.shoulderCm} cm`}
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-semibold text-ink-800">
                      {unit === 'in' ? `${row.sleeveHalfInches}"` : `${Math.round(row.sleeveHalfInches * 2.54 * 10) / 10} cm`}
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-semibold text-ink-800">
                      {unit === 'in' ? `${row.sleeveFullInches}"` : `${Math.round(row.sleeveFullInches * 2.54 * 10) / 10} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-ink-500 italic pt-2">
            * All measurements are taken on un-stretched garments lying flat. A tolerance of ±0.5 inches (±1.2 cm) is normal across industrial knitting batches.
          </p>
        </div>

        {/* How to Measure Section */}
        <div className="bg-surface-tint rounded-3xl border border-border p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              Measuring Instructions
            </span>
            <h3 className="font-display text-2xl font-normal text-ink-900">
              How To Measure Accurately
            </h3>
            <p className="text-xs text-ink-600">
              Take a t-shirt that fits you best at home, lay it flat on a table, and compare its dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-border space-y-1 shadow-sm">
              <h4 className="font-bold text-xs sm:text-sm text-ink-900">1. Chest Width</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Measure straight across the chest from armpit seam to armpit seam, then double that measurement for the full circumference.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-border space-y-1 shadow-sm">
              <h4 className="font-bold text-xs sm:text-sm text-ink-900">2. Garment Length</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Measure from the highest point where the collar rib meets the shoulder seam, straight down to the bottom hemline.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-border space-y-1 shadow-sm">
              <h4 className="font-bold text-xs sm:text-sm text-ink-900">3. Shoulder Width</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Measure straight across the back from the tip of the left shoulder seam to the tip of the right shoulder seam.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-border space-y-1 shadow-sm">
              <h4 className="font-bold text-xs sm:text-sm text-ink-900">4. Sleeve Length</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Measure along the outside of the sleeve, starting from the shoulder top seam down to the sleeve cuff opening.
              </p>
            </div>
          </div>
        </div>

        {/* Fit Guidelines & WhatsApp Concierge */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-6">
          <h3 className="font-display text-xl font-normal text-ink-900">
            Fit Recommendations
          </h3>

          <div className="space-y-3">
            {FIT_NOTES.map((note, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-xs text-ink-900">Still unsure of which size to pick?</p>
              <p className="text-xs text-ink-600">Our fit specialists can recommend your ideal size in 2 minutes.</p>
            </div>

            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi Ateevibes team, can you help me choose the right size?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-5 py-2 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Sizing Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
