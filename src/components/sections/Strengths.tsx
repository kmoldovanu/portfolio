import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { headings, strengths } from "../../content";
import { SectionHeading } from "../ui/SectionHeading";

type Strength = (typeof strengths)[number];

type StackCardProps = {
  item: Strength;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

/** Ogni card resta fissata e si rimpicciolisce mentre arriva la successiva. */
function StackCard({ item, index, total, progress }: StackCardProps) {
  const targetScale = 1 - (total - index - 1) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-24 flex h-[78dvh] items-start justify-center md:top-28" style={{ paddingTop: index * 28 }}>
      <motion.article
        style={{ scale }}
        className="grid h-[min(560px,68dvh)] w-full origin-top grid-cols-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_30px_80px_-40px_var(--shadow)] md:grid-cols-2 md:grid-rows-1"
      >
        <div className="flex flex-col justify-end p-7 md:p-12">
          <h3 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">{item.title}</h3>
          <p className="mt-3 max-w-[38ch] leading-relaxed text-muted md:mt-5 md:text-lg">{item.body}</p>
        </div>
        <img src={item.image} alt="" loading="lazy" className="order-first size-full min-h-0 object-cover md:order-none" />
      </motion.article>
    </div>
  );
}

export function Strengths() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 md:px-6 md:pt-32">
      <SectionHeading className="max-w-3xl">{headings.strengths}</SectionHeading>
      <div ref={ref} className="relative mt-6 pb-[10dvh]">
        {strengths.map((item, i) => (
          <StackCard key={item.title} item={item} index={i} total={strengths.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
