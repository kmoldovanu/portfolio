import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { statement } from "../../content";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

/** Le parole si accendono una alla volta seguendo lo scroll: il testo si legge al ritmo di chi scorre. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = statement.split(" ");

  return (
    <section className="mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <p
        ref={ref}
        className="max-w-5xl font-display text-3xl font-medium leading-[1.2] tracking-tight md:text-5xl lg:text-[3.4rem]"
      >
        {words.map((word, i) => (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          />
        ))}
      </p>
    </section>
  );
}
