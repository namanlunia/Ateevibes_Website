import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isOverFormField, setIsOverFormField] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const pendingTargetRef = useRef<EventTarget | null>(null);
  const rafId = useRef<number | null>(null);

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

    const updateCursor = () => {
      rafId.current = null;
      const { x, y } = posRef.current;
      const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (dotRef.current) {
        dotRef.current.style.transform = transform;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = transform;
      }

      setIsOffscreen((prev) => (prev ? false : prev));

      const target = pendingTargetRef.current as HTMLElement | null;
      if (target) {
        // Detect form fields to yield back native caret and prevent blocking typing
        const isFormInput = Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
        setIsOverFormField((prev) => (prev !== isFormInput ? isFormInput : prev));

        const interactive = Boolean(target.closest('a, button, [role="button"], label'));
        setIsPointer((prev) => (prev !== interactive ? interactive : prev));
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      pendingTargetRef.current = e.target;

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateCursor);
      }
    };

    const onMouseLeave = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      setIsOffscreen(true);
      resetCursor();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      fineMatch.removeEventListener('change', checkCapabilities);
      reducedMotionMatch.removeEventListener('change', checkCapabilities);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [resetCursor]);

  useEffect(() => {
    if (isFinePointer) {
      const { x, y } = posRef.current;
      const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (dotRef.current) dotRef.current.style.transform = transform;
      if (ringRef.current) ringRef.current.style.transform = transform;
    }
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  const isHidden = isOverFormField || isOffscreen || isSearchOpen || isCartOpen || isMobileMenuOpen;
  const isView = cursorMode === 'view' && !isHidden;
  const isActive = (cursorMode === 'pointer' || isPointer) && !isHidden;

  return (
    <>
      {/* 10px Center Dot */}
      <div
        ref={dotRef}
        className="cursor-dot hidden lg:block"
        style={{
          opacity: isHidden || isView ? 0 : 1,
        }}
      />

      {/* Follower Ring */}
      <div
        ref={ringRef}
        className={`cursor-ring hidden lg:flex ${isActive && !isView ? 'cursor-active' : ''} ${
          isView ? 'cursor-view' : ''
        }`}
        style={{
          opacity: isHidden ? 0 : 1,
        }}
      >
        {isView && <span>{cursorText || 'VIEW'}</span>}
      </div>
    </>
  );
};
