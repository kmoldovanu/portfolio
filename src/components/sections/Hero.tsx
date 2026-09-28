import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { cta, profile } from "../../content";
import { easeOut } from "../../lib/motion";
import { Button } from "../ui/Button";

/** Lettere che salgono da una maschera, una dopo l'altra. */
function MaskedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span className="block overflow-hidden whitespace-nowrap pb-[0.08em]" aria-hidden>
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: delay + i * 0.035 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const [first, last] = profile.name.split(" ");

  return (
    <section
      id="top"
      ref={ref}
      className="mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-12 px-4 pb-16 pt-28 md:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-24"
    >
      <div className="lg:col-span-7">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted"
        >
          {profile.role}
        </motion.p>

        <h1
          className="font-display text-[clamp(3rem,6.3vw,6rem)] font-bold leading-[0.95] tracking-[-0.035em]"
          aria-label={profile.name}
        >
          <MaskedWord word={first} delay={0.4} />
          <MaskedWord word={last} delay={0.65} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 1.1 }}
          className="mt-8 max-w-[38ch] text-lg leading-relaxed text-muted md:text-xl"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 1.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button href="#contatti" icon={ArrowUpRight} magnetic>
            {cta.contact}
          </Button>
          <Button href="#esperienza" variant="ghost" icon={ArrowDown}>
            {cta.experience}
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0% round 28px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
        transition={{ duration: 1.4, ease: easeOut, delay: 0.5 }}
        className="relative aspect-[4/5] max-h-[72dvh] w-full overflow-hidden rounded-[28px] bg-surface-2 lg:col-span-5"
      >
        <motion.img
          src={profile.heroImage}
          alt="Postazione di lavoro con portatile e taccuino"
          style={{ scale: imageScale, y: imageY }}
          className="size-full object-cover"
          fetchPriority="high"
        />
      </motion.div>
    </section>
  );
}
