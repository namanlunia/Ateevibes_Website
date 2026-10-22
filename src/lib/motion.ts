import { Transition, Variants } from 'framer-motion';

// Motion Tokens
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const easeInOutWipe = [0.76, 0, 0.24, 1] as const;

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
};

export const microTransition: Transition = {
  duration: 0.2,
  ease: easeOutExpo,
};

export const standardTransition: Transition = {
  duration: 0.35,
  ease: easeOutExpo,
};

// Page content entry after curtain wipe
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easeOutExpo,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.2,
      ease: easeOutExpo,
    },
  },
};

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const cardHoverVariants = {
  initial: { y: 0, boxShadow: '0 1px 2px rgba(28,36,26,.06), 0 8px 24px rgba(28,36,26,.08)' },
  hover: {
    y: -6,
    boxShadow: '0 16px 40px rgba(28,36,26,.14)',
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};
