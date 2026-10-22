import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageCurtainProps {
  children: React.ReactNode;
}

export const PageCurtain: React.FC<PageCurtainProps> = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full flex-1 flex flex-col"
      >
        {/* Panel 1: Brand Green #cdf0a7 */}
        <motion.div
          className="fixed inset-0 z-[91] bg-brand-green pointer-events-none"
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          exit={{ y: '0%' }}
          transition={{
            duration: 0.45,
            ease: [0.76, 0, 0.24, 1],
            delay: 0,
          }}
        />

        {/* Panel 2: Brand Cream #faf3d0 */}
        <motion.div
          className="fixed inset-0 z-[92] bg-brand-cream pointer-events-none"
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          exit={{ y: '0%' }}
          transition={{
            duration: 0.45,
            ease: [0.76, 0, 0.24, 1],
            delay: 0.08,
          }}
        />

        {/* Panel 3: Brand White #ffffff + Logo */}
        <motion.div
          className="fixed inset-0 z-[93] bg-white flex items-center justify-center pointer-events-none"
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          exit={{ y: '0%' }}
          transition={{
            duration: 0.45,
            ease: [0.76, 0, 0.24, 1],
            delay: 0.16,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-2"
          >
            <img src="/brand/logo.png" alt="Ateevibes" className="h-10 w-auto" />
            <p className="text-[11px] font-bold text-accent-700 uppercase tracking-widest">
              Feel the Vibes
            </p>
          </motion.div>
        </motion.div>

        {/* Actual Route Children */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
