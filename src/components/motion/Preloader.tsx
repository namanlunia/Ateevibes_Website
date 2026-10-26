import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

export const Preloader: React.FC = () => {
  const preloaderFinished = useUIStore((state) => state.preloaderFinished);
  const setPreloaderFinished = useUIStore((state) => state.setPreloaderFinished);
  const shouldReduceMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(!preloaderFinished && !shouldReduceMotion);

  useEffect(() => {
    if (preloaderFinished || shouldReduceMotion) {
      if (shouldReduceMotion && !preloaderFinished) {
        setPreloaderFinished(true);
      }
      setShouldRender(false);
      return;
    }

    // Auto complete after 1.5s
    const timer = setTimeout(() => {
      setPreloaderFinished(true);
      setTimeout(() => setShouldRender(false), 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [preloaderFinished, setPreloaderFinished, shouldReduceMotion]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!preloaderFinished && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[140] bg-ink-900 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Animated Brand Logo Mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-28 h-28 flex items-center justify-center"
          >
            <img
              src="/brand/emblem.png"
              alt="Ateevibes"
              width={96}
              height={96}
              className="w-24 h-24 object-contain drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)]"
            />
          </motion.div>

          {/* Wordmark and Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h2 className="font-display text-2xl font-normal tracking-widest text-gold">
              ATEEVIBES
            </h2>
            <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-gold uppercase mt-1">
              Feel the Vibes
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
