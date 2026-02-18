"use client";

import { motion } from "motion/react";

interface AppearBottomProps {
  children: React.ReactNode;
}

export const AppearBottom = ({ children }: AppearBottomProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  );
};
