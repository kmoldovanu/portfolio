import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { Heart } from "@phosphor-icons/react";
import { headings, skillAreas } from "../../content";
import { easeOut } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";
import { BrandLogo } from "../ui/BrandLogo";
import { SectionHeading } from "../ui/SectionHeading";

type Area = (typeof skillAreas)[number];

function area(id: string): Area {
  const found = skillAreas.find((a) => a.id === id);
  if (!found) throw new Error(`Area di competenza mancante in content.ts: ${id}`);
  return found;
}

/** Cella della griglia con un alone che segue il cursore. */
function SpotlightCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      onMouseMove={handleMove}
      className={`relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border border-line p-7 md:p-9 ${className}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      {children}
    </div>
  );
}

/** Anni di esperienza in evidenza: il dato che un selezionatore cerca per primo. */
function Years({ area, light = false }: { area: Area; light?: boolean }) {
  return (
    <p className="mb-auto flex items-baseline gap-3 pb-10">
      <span className={`font-display text-7xl font-semibold leading-none tracking-tight ${light ? "text-white" : "text-accent"}`}>
        {area.years}
      </span>
      <span className={`text-sm ${light ? "text-white/80" : "text-muted"}`}>
        {area.years === 1 ? "anno" : "anni"} {area.yearsLabel}
      </span>
    </p>
  );
}

function AreaText({ area, light = false }: { area: Area; light?: boolean }) {
  return (
    <>
      <h3 className="font-display text-3xl font-semibold tracking-tight">{area.title}</h3>
      <p className={`mt-3 max-w-[40ch] leading-relaxed ${light ? "text-white/80" : "text-muted"}`}>{area.body}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {area.tools.map((tool) => (
          <li
            key={tool}
            className={`rounded-full px-3 py-1 font-mono text-xs ${light ? "bg-white/15 text-white" : "bg-surface-2 text-muted"}`}
          >
            {tool}
          </li>
        ))}
      </ul>
    </>
  );
}

/** Demo reale: un click aggiorna solo il pezzo di pagina interessato, come farebbe htmx. */
function HtmxDemo() {
  const [likes, setLikes] = useState(12);
  const [liked, setLiked] = useState(false);

  const toggle = () => {
    setLiked(!liked);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  return (
    <div className="mt-8 rounded-2xl bg-surface-2 p-4">
      <code className="block overflow-x-auto whitespace-nowrap font-mono text-xs text-muted">
        {'<button hx-post="/like" hx-swap="outerHTML">'}
      </code>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={liked}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm transition-transform active:scale-[0.96]"
      >
        <motion.span animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
          <Heart size={16} weight={liked ? "fill" : "regular"} className={liked ? "text-accent" : ""} />
        </motion.span>
        <span className="relative inline-flex h-5 w-6 overflow-hidden font-mono tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={likes}
              initial={{ y: liked ? 16 : -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: liked ? -16 : 16, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              {likes}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  );
}

export function Skills() {
  const backend = area("backend");
  const frontend = area("frontend");
  const hypermedia = area("hypermedia");
  const basi = area("basi");
  const server = area("server");

  return (
    <section id="competenze" className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <SectionHeading eyebrow={headings.skillsEyebrow} className="max-w-3xl">
        {headings.skills}
      </SectionHeading>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
        {/* Backend: cella larga con immagine */}
        <Reveal className="md:col-span-4">
          <SpotlightCell className="min-h-[380px] border-transparent text-white">
            <img
              src="https://picsum.photos/id/26/1400/800"
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 size-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0f0f10]/95 via-[#0f0f10]/70 to-[#0f0f10]/50" />
            <Years area={backend} light />
            <AreaText area={backend} light />
          </SpotlightCell>
        </Reveal>

        {/* Frontend: gradiente nel colore d'accento */}
        <Reveal className="md:col-span-2" delay={0.08}>
          <SpotlightCell className="min-h-[380px] bg-surface bg-[radial-gradient(120%_90%_at_100%_0%,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_60%)]">
            <Years area={frontend} />
            <AreaText area={frontend} />
          </SpotlightCell>
        </Reveal>

        {/* Hypermedia: demo interattiva */}
        <Reveal className="md:col-span-3" delay={0.04}>
          <SpotlightCell className="bg-surface">
            <Years area={hypermedia} />
            <AreaText area={hypermedia} />
            <HtmxDemo />
          </SpotlightCell>
        </Reveal>

        {/* Fondamenta: trama a punti */}
        <Reveal className="md:col-span-3" delay={0.12}>
          <SpotlightCell className="bg-surface bg-[radial-gradient(var(--line)_1.2px,transparent_1.2px)] [background-size:18px_18px]">
            <Years area={basi} />
            <AreaText area={basi} />
          </SpotlightCell>
        </Reveal>

        {/* Server e stampa: riga intera con il logo Debian come filigrana */}
        <Reveal className="md:col-span-6" delay={0.08}>
          <SpotlightCell className="bg-surface">
            <BrandLogo
              name="Debian"
              slug="debian"
              className="absolute -bottom-10 -right-6 -z-10 size-56 bg-accent/15 md:-bottom-16 md:right-10 md:size-80"
            />
            <Years area={server} />
            <AreaText area={server} />
          </SpotlightCell>
        </Reveal>
      </div>
    </section>
  );
}
