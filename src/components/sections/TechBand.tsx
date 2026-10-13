import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { techBand } from "../../content";

function Row({ words, x, outline }: { words: string[]; x: MotionValue<string>; outline: boolean }) {
  // Ripetute due volte: la riga è sempre più larga dello schermo mentre scorre.
  const items = [...words, ...words];
  return (
    <m.ul style={{ x }} className="flex w-max items-center gap-8 whitespace-nowrap md:gap-12">
      {items.map((word, i) => (
        <li key={i} className="flex items-center gap-8 md:gap-12">
          <span className={outline ? "text-outline" : ""}>{word}</span>
          <span aria-hidden className="size-3 rotate-45 bg-accent md:size-4" />
        </li>
      ))}
    </m.ul>
  );
}

/** Due righe di tecnologie che scorrono in direzioni opposte, guidate dallo scroll (non da un timer). */
export function TechBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <section
      ref={ref}
      aria-label={`Tecnologie: ${techBand.flat().join(", ")}`}
      className="overflow-hidden border-y border-line py-10 md:py-14"
    >
      <div aria-hidden className="grid gap-3 text-[clamp(2.4rem,6.5vw,5.5rem)] font-black leading-none tracking-[-0.02em] font-stretch-[125%]">
        <Row words={techBand[0]} x={forward} outline={false} />
        <Row words={techBand[1]} x={backward} outline />
      </div>
    </section>
  );
}
