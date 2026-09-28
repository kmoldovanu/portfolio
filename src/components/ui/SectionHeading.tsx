import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  children: ReactNode;
  eyebrow?: string;
  className?: string;
};

/** Titolo di sezione standard. L'eyebrow è opzionale: usalo con parsimonia. */
export function SectionHeading({ children, eyebrow, className = "" }: SectionHeadingProps) {
  return (
    <Reveal className={className}>
      {eyebrow && (
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
        {children}
      </h2>
    </Reveal>
  );
}
