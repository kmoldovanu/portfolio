import { motion } from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "../../lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Fa comparire il contenuto quando entra nel viewport (una sola volta). */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
