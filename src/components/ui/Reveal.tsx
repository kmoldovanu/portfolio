import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { easeOut } from "../../lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Comparsa breve all'ingresso nel viewport, una sola volta. Spostamento piccolo: si legge come dissolvenza. */
export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}
