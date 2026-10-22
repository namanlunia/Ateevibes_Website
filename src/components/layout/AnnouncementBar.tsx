import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(() => {
    return typeof window !== 'undefined' ? Boolean(sessionStorage.getItem('atv:announcement_dismissed')) : false;
  });

  const messages = siteConfig.announcements;

  useEffect(() => {
    if (isDismissed || messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isDismissed, messages.length]);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('atv:announcement_dismissed', 'true');
  };

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="relative z-50 bg-gradient-to-r from-brand-green via-brand-cream to-brand-green text-ink-900 text-xs sm:text-sm font-medium py-2 px-4 shadow-sm border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center relative overflow-hidden h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center tracking-wide font-medium flex items-center gap-2"
          >
            <span>{messages[currentIndex]}</span>
          </motion.p>
        </AnimatePresence>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-0 text-ink-700 hover:text-ink-900 transition-colors p-1 rounded-full hover:bg-black/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
