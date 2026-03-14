"use client";

import { motion } from "motion/react";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
}

export const StaggerChildren = ({
  children,
  className,
  baseDelay = 0,
  staggerDelay = 0.12,
}: StaggerChildrenProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: baseDelay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
