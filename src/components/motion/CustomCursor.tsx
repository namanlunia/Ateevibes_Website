import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isOverFormField, setIsOverFormField] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);

  const location = useLocation();

  const cursorMode = useUIStore((state) => state.cursorMode);
  const cursorText = useUIStore((state) => state.cursorText);
  const resetCursor = useUIStore((state) => state.resetCursor);
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);

  // Auto-reset cursor label whenever navigating to prevent stuck labels
  useEffect(() => {
    resetCursor();
  }, [location.pathname, resetCursor]);

  useEffect(() => {
    // Only show on desktop with fine pointer and no reduced motion preference
    const fineMatch = window.matchMedia('(pointer: fine)');
    const reducedMotionMatch = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkCapabilities = () => {
      setIsFinePointer(fineMatch.matches && !reducedMotionMatch.matches);
    };

    checkCapabilities();
    fineMatch.addEventListener('change', checkCapabilities);
    reducedMotionMatch.addEventListener('change', checkCapabilities);

    const onMouseMove = (e: MouseEvent) => {
      setIsOffscreen(false);
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect form fields to yield back native caret and prevent blocking typing
      const isFormInput = Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
      setIsOverFormField(isFormInput);

      const interactive = target.closest('a, button, [role="button"], label');
      setIsPointer(Boolean(interactive));
    };

    const onMouseLeave = () => {
      setIsOffscreen(true);
      resetCursor();
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      fineMatch.removeEventListener('change', checkCapabilities);
      reducedMotionMatch.removeEventListener('change', checkCapabilities);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [resetCursor]);

  if (!isFinePointer) return null;

  const isHidden = isOverFormField || isOffscreen || isSearchOpen || isCartOpen || isMobileMenuOpen;
  const isView = cursorMode === 'view' && !isHidden;
  const isActive = (cursorMode === 'pointer' || isPointer) && !isHidden;

  return (
    <>
      {/* 10px Center Dot */}
      <div
        className="cursor-dot hidden lg:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isHidden || isView ? 0 : 1,
        }}
      />

      {/* Follower Ring */}
      <div
        className={`cursor-ring hidden lg:flex ${isActive && !isView ? 'cursor-active' : ''} ${
          isView ? 'cursor-view' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isHidden ? 0 : 1,
        }}
      >
        {isView && <span>{cursorText || 'VIEW'}</span>}
      </div>
    </>
  );
};
