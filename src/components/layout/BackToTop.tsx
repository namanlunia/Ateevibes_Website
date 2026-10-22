import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { addScrollListener } from '../../lib/scrollListener';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = addScrollListener(({ scrollY, progress }) => {
      setVisible(scrollY > 600);
      setScrollProgress(progress);
    }, true);

    return unsubscribe;
  }, []);

  // Hide on checkout
  if (location.pathname.startsWith('/checkout')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-4 sm:right-6 z-40 p-3 rounded-full bg-white glass shadow-soft-hover border border-border text-ink-900 hover:border-ink-900 group transition-all"
        >
          {/* Progress Ring */}
          <svg className="w-10 h-10 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="var(--border)"
              strokeWidth="2.5"
              fill="none"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="var(--accent-700)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-100 ease-out"
            />
          </svg>

          <ArrowUp className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ink-900 group-hover:-translate-y-2/3 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
