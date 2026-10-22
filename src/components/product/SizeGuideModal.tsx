import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Info } from 'lucide-react';
import { SIZE_CHART, FIT_NOTES } from '../../data/sizeChart';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size & Fit Guide"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-border p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-brand-green/50 text-ink-900">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-900">
                  Size & Measurement Guide
                </h3>
                <p className="text-xs text-ink-600">Standard Men's Regular Fit</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close size guide"
              className="p-2 rounded-full hover:bg-black/5 text-ink-700 hover:text-ink-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-700">
              Garment Dimensions
            </span>
            <div className="flex items-center bg-surface-tint border border-border rounded-full p-1">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  unit === 'in' ? 'bg-ink-900 text-brand-cream' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  unit === 'cm' ? 'bg-ink-900 text-brand-cream' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface-tint">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/80 border-b border-border text-ink-900 font-bold">
                <tr>
                  <th className="p-3.5">Size</th>
                  <th className="p-3.5">Chest</th>
                  <th className="p-3.5">Length</th>
                  <th className="p-3.5">Shoulder</th>
                  <th className="p-3.5">Half Sleeve</th>
                  <th className="p-3.5">Full Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-ink-700 font-medium tabular-nums">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-white/50 transition-colors">
                    <td className="p-3.5 font-bold text-ink-900">{row.size}</td>
                    <td className="p-3.5">{unit === 'in' ? `${row.chestInches}"` : `${row.chestCm} cm`}</td>
                    <td className="p-3.5">{unit === 'in' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}</td>
                    <td className="p-3.5">{unit === 'in' ? `${row.shoulderInches}"` : `${row.shoulderCm} cm`}</td>
                    <td className="p-3.5">{unit === 'in' ? `${row.sleeveHalfInches}"` : `${(row.sleeveHalfInches * 2.54).toFixed(1)} cm`}</td>
                    <td className="p-3.5">{unit === 'in' ? `${row.sleeveFullInches}"` : `${(row.sleeveFullInches * 2.54).toFixed(1)} cm`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Block */}
          <div className="p-4 rounded-2xl bg-white border border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ink-900 uppercase tracking-wide">
              <Info className="w-4 h-4 text-accent-700" />
              <span>How to Measure Your Best-Fitting T-Shirt</span>
            </div>
            <ul className="text-xs text-ink-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Chest:</strong> Measure across the garment 1 inch below the armholes, then double the measurement.</li>
              <li><strong>Length:</strong> Measure from the highest point of the shoulder seam straight down to the bottom hem.</li>
              <li><strong>Shoulder:</strong> Measure straight across the back from the tip of one shoulder seam to the other.</li>
            </ul>
          </div>

          {/* Fit Notes */}
          <div className="space-y-1.5 text-xs text-ink-600">
            <p className="font-bold text-ink-900">Fit Philosophy:</p>
            {FIT_NOTES.map((note, i) => (
              <p key={i}>• {note}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
