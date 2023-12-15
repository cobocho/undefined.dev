import { AnimationProps, Variants } from 'framer-motion';

const springTransition = {
  type: 'spring',
  stiffness: 100,
};

const defaultProperties = {
  initial: 'hidden',
  animate: 'visible',
};

const fromLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

const fromBottom = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

const exitToBottom = {
  opacity: 0,
  y: 30,
  transition: {
    duration: 0.1,
  },
};

export const appearFromLeft: AnimationProps = {
  ...defaultProperties,
  variants: fromLeft,
};

export const appearFromBottom: AnimationProps = {
  ...defaultProperties,
  variants: fromBottom,
  exit: exitToBottom,
};

export const orchestrate = {
  visible: {
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.4,
    },
  },
};

export const orchestrateTags = {
  visible: {
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
};
