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
      className="relative z-50 bg-obsidian text-ivory text-xs font-medium py-2 px-4 shadow-subtle border-b border-gold/25"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center relative overflow-hidden h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center tracking-[0.06em] uppercase text-[11px] sm:text-xs font-medium flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>{messages[currentIndex]}</span>
          </motion.p>
        </AnimatePresence>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-0 text-ivory/60 hover:text-gold transition-colors p-1 rounded-full hover:bg-white/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
