import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { cta, profile } from "../../content";
import { easeOut } from "../../lib/motion";
import { Button } from "../ui/Button";
import { CvDownload } from "../ui/CvDownload";
import { CodeWindow } from "../ui/CodeWindow";
import { KineticGrid } from "../ui/KineticGrid";
import { PortraitBadge } from "../ui/PortraitBadge";
import { ScrambleText } from "../ui/ScrambleText";
import { TiltCard } from "../ui/TiltCard";

const [firstName, lastName] = profile.name.split(" ");

/** Lettere che salgono da una maschera, una dopo l'altra. Solo per il nome: è breve. */
function RisingWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span aria-hidden className="block overflow-hidden whitespace-nowrap pb-[0.06em]">
      {Array.from(word, (char, i) => (
        <m.span
          key={i}
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: delay + i * 0.03 }}
        >
          {char}
        </m.span>
      ))}
    </span>
  );
}

function FadeUp({ children, delay, className }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut, delay }}
    >
      {children}
    </m.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Uscendo dalla vista il nome sale più lento della pagina e si attenua: profondità senza distrarre.
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  // La foto sale più in fretta del nome: due piani a velocità diverse.
  const badgeY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section id="top" ref={ref} className="relative isolate overflow-hidden">
      {/* La griglia sfuma verso i bordi così la sezione si fonde con il resto della pagina. */}
      <KineticGrid className="-z-10 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_40%,black_35%,transparent_100%)]" />
      <div className="@container mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pb-28 md:pt-36">
        <div className="relative">
          <FadeUp
            delay={0.2}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 pr-32 text-[0.9375rem] text-muted sm:pr-0"
          >
            <span>
              <ScrambleText text={profile.role} delay={250} duration={1000} />, {profile.base}
            </span>
            <a
              href="#contatti"
              className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 font-medium text-accent transition-colors duration-200 hover:bg-accent/20"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {profile.availability}
            </a>
          </FadeUp>

          {/*
          Dimensione legata alla larghezza della colonna (cqi), non della finestra: la colonna smette di crescere
          a max-w-7xl, la finestra no. "Konstantinos" occupa circa 8,3 volte la dimensione del font, quindi
          11,8cqi lo tiene sempre dentro con un piccolo margine. Se cambi il nome, ricalcola questo valore.
        */}
          <m.h1
            aria-label={profile.name}
            style={{ y: nameY, opacity: nameOpacity }}
            className="mt-6 text-[min(11.8cqi,9.5rem)] font-black leading-[0.86] tracking-[-0.035em] font-stretch-[125%]"
          >
            <RisingWord word={firstName} delay={0.3} />
            <RisingWord word={lastName} delay={0.5} />
          </m.h1>

          {/*
          Sul telefono accanto alla riga del ruolo, dove c'è posto per una dimensione leggibile.
          Da sm in su nello spazio libero a destra del cognome, che è più corto del nome.
        */}
          <m.div
            style={{ y: badgeY }}
            className="absolute -top-7 right-0 w-28 sm:top-auto sm:bottom-[-7.5cqi] sm:right-[-0.5cqi] sm:w-[17cqi]"
          >
            <PortraitBadge />
          </m.div>
        </div>

        <div className="mt-14 grid items-start gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-4">
            <FadeUp delay={0.9}>
              <p className="max-w-[40ch] text-lg leading-relaxed text-muted md:text-xl">{profile.intro}</p>
            </FadeUp>
            <FadeUp delay={1.05} className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#contatti" icon={ArrowUpRight}>
                {cta.contact}
              </Button>
              <CvDownload />
            </FadeUp>
          </div>

          <m.div
            className="min-w-0 lg:col-span-7"
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, ease: easeOut, delay: 0.75 }}
            style={{ transformPerspective: 1200 }}
          >
            <TiltCard className="rounded-2xl" max={5}>
              <CodeWindow />
            </TiltCard>
          </m.div>
        </div>
        <FadeUp delay={1.6} className="mt-10 hidden text-sm text-muted [@media(hover:hover)]:block">
          Muovi il cursore sulla griglia, clicca per mandare un'onda.
        </FadeUp>
      </div>
    </section>
  );
}
