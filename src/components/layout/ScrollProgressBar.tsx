import React, { useEffect, useRef } from 'react';
import { addScrollListener } from '../../lib/scrollListener';

export const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = addScrollListener(({ progress }) => {
      if (barRef.current) {
        barRef.current.style.width = `${progress}%`;
      }
    }, true);

    return unsubscribe;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[120] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-brand-green via-brand-cream to-accent-500 transition-all duration-75 ease-out"
        style={{ width: '0%' }}
      />
    </div>
  );
};
