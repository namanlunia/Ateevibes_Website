import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';

export const FlyToCart: React.FC = () => {
  const flyData = useCartStore((state) => state.flyData);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (flyData) {
      const cartBtn = document.getElementById('nav-cart-btn');
      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        setTargetPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    } else {
      setTargetPos(null);
    }
  }, [flyData]);

  if (!flyData || !targetPos) return null;

  return (
    <AnimatePresence>
      <motion.div
        aria-hidden="true"
        initial={{
          position: 'fixed',
          left: flyData.startX,
          top: flyData.startY,
          x: '-50%',
          y: '-50%',
          scale: 1,
          opacity: 1,
          zIndex: 100,
          pointerEvents: 'none',
        }}
        animate={{
          left: targetPos.x,
          top: targetPos.y,
          scale: 0.18,
          opacity: 0.3,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-20 h-24 rounded-xl overflow-hidden shadow-2xl border-2 border-brand-green bg-white pointer-events-none"
      >
        <img
          src={flyData.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
};
