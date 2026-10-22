import React from 'react';

export const PageFallback: React.FC = () => {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand-green/30 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-brand-green border-t-ink-900 animate-spin" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-600 animate-pulse">
        Loading vibes...
      </p>
    </div>
  );
};
