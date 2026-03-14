"use client";

import { motion } from "motion/react";

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInUp = ({ children, delay = 0, className }: FadeInUpProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 22,
        mass: 1,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
