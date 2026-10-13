import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { easeOut } from "../../lib/motion";

type SectionHeadingProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

/**
 * Titolo di sezione che sale da una maschera quando entra nel viewport.
 * L'osservatore sta sull'h2: lo span è nascosto dalla maschera e non verrebbe mai "visto".
 */
export function SectionHeading({ children, id, className = "" }: SectionHeadingProps) {
  return (
    <m.h2
      id={id}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      className={`overflow-hidden pb-[0.08em] text-[clamp(2.1rem,4.8vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.025em] font-stretch-[118%] ${className}`}
    >
      <m.span
        className="block text-balance"
        variants={{ hidden: { y: "105%" }, shown: { y: 0 } }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        {children}
      </m.span>
    </m.h2>
  );
}
