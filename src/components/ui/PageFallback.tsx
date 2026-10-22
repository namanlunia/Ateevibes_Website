import React from 'react';

export const PageFallback: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Banner / Header Shimmer */}
      <div className="w-full h-36 sm:h-48 rounded-3xl bg-gradient-to-r from-brand-green/20 via-brand-cream/40 to-surface-tint border border-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-brand-green border-t-ink-900 animate-spin" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-ink-700">
            Loading Vibes...
          </span>
        </div>
      </div>

      {/* Grid Shimmer Placeholders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] rounded-2xl bg-brand-cream/30 border border-border/50" />
            <div className="h-4 w-3/4 rounded bg-brand-cream/40" />
            <div className="h-3 w-1/2 rounded bg-brand-cream/30" />
          </div>
        ))}
      </div>
    </div>
  );
};
