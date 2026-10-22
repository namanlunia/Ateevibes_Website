import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageCurtainProps {
  children: React.ReactNode;
}

export const PageCurtain: React.FC<PageCurtainProps> = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [failsafeActive, setFailsafeActive] = useState(false);

  // Hard failsafe: auto-clear any stuck curtain state after 1.2s
  useEffect(() => {
    setFailsafeActive(false);
    const timer = setTimeout(() => {
      setFailsafeActive(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
        className="w-full flex-1 flex flex-col relative"
      >
        {/* Only render sliding curtain panels if failsafe has not force-cleared */}
        {!failsafeActive && (
          <>
            {/* Panel 1: Brand Green #cdf0a7 */}
            <motion.div
              className="fixed inset-x-0 top-0 bottom-0 z-[45] bg-brand-green pointer-events-none"
              initial={{ y: '100%' }}
              animate={{ y: '-100%' }}
              exit={{ y: '0%' }}
              transition={{
                duration: 0.32,
                ease: [0.76, 0, 0.24, 1],
                delay: 0,
              }}
            />

            {/* Panel 2: Brand Cream #faf3d0 */}
            <motion.div
              className="fixed inset-x-0 top-0 bottom-0 z-[46] bg-brand-cream pointer-events-none"
              initial={{ y: '100%' }}
              animate={{ y: '-100%' }}
              exit={{ y: '0%' }}
              transition={{
                duration: 0.32,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.05,
              }}
            />

            {/* Panel 3: Brand White #ffffff + Official Logo */}
            <motion.div
              className="fixed inset-x-0 top-0 bottom-0 z-[47] bg-white flex items-center justify-center pointer-events-none"
              initial={{ y: '100%' }}
              animate={{ y: '-100%' }}
              exit={{ y: '0%' }}
              transition={{
                duration: 0.35,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.1,
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <img src="/brand/logo.png" alt="Ateevibes" className="h-10 w-auto" />
                <p className="text-[11px] font-bold text-accent-700 uppercase tracking-widest">
                  Feel the Vibes
                </p>
              </div>
            </motion.div>
          </>
        )}

        {/* Route Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
