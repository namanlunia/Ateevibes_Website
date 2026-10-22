import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../store/uiStore';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorMode = useUIStore((state) => state.cursorMode);
  const cursorText = useUIStore((state) => state.cursorText);

  useEffect(() => {
    // Check if device supports fine pointer or prefers reduced motion
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, input, select, textarea, [role="button"], label');
      setIsPointer(Boolean(interactive));
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (isTouchDevice) return null;

  const isView = cursorMode === 'view';
  const isActive = cursorMode === 'pointer' || isPointer;

  return (
    <>
      {/* 10px Center Dot */}
      <div
        className="cursor-dot hidden lg:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isView ? 0 : 1,
        }}
      />

      {/* 36px Follower Ring */}
      <div
        className={`cursor-ring hidden lg:flex ${isActive && !isView ? 'cursor-active' : ''} ${
          isView ? 'cursor-view' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {isView && <span>{cursorText || 'VIEW'}</span>}
      </div>
    </>
  );
};
