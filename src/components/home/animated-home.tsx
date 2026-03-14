"use client";

import { motion } from "motion/react";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export const AnimatedHome = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-10"
    >
      {children}
    </motion.div>
  );
};

export const AnimatedHeroTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedSection = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCategorySection = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.4 + index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="mb-10"
    >
      {children}
    </motion.div>
  );
};
