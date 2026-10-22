import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'atv:v1:cookie_consent';

export const CookieNotice: React.FC = () => {
  const [accepted, setAccepted] = useState(() => {
    return typeof window !== 'undefined' ? Boolean(localStorage.getItem(COOKIE_KEY)) : false;
  });

  const handleAccept = () => {
    setAccepted(true);
    try {
      localStorage.setItem(COOKIE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (accepted) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Cookie consent banner"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 p-4 rounded-2xl glass-tint bg-white/95 border border-border shadow-soft-hover"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-700">
          <p className="leading-relaxed">
            We use cookies to personalize your shopping vibes and optimize site speed.{' '}
            <Link to="/privacy" className="underline font-medium text-ink-900 hover:text-accent-700">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={handleAccept}
            className="btn-primary px-4 py-1.5 text-xs font-semibold whitespace-nowrap self-end sm:self-center"
          >
            Got it
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
