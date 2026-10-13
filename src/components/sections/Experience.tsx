import { useInView, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { headings, jobs, milestones, type Job } from "../../content";
import { easeOut } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";
import { ScrambleText } from "../ui/ScrambleText";
import { SectionHeading } from "../ui/SectionHeading";

/** L'anno si decodifica quando la tappa entra in vista. */
function Year({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  return (
    <p
      ref={ref}
      className="text-[clamp(2.6rem,5vw,4rem)] font-black leading-none tracking-[-0.03em] font-stretch-[125%]"
    >
      <ScrambleText text={text} play={inView} delay={delay} duration={700} />
    </p>
  );
}

/** La linea si disegna mentre scorri; ogni tappa si accende quando la raggiungi. */
function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative mt-14 grid gap-10 pl-8 md:grid-cols-3 md:gap-8 md:pl-0 md:pt-10">
      {/* Mobile: linea verticale */}
      <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-0.5 bg-line md:hidden" />
      <m.span
        aria-hidden
        style={{ scaleY: fill }}
        className="absolute bottom-2 left-[5px] top-2 w-0.5 origin-top bg-accent md:hidden"
      />
      {/* Desktop: linea orizzontale */}
      <span aria-hidden className="absolute inset-x-0 top-[5px] hidden h-0.5 bg-line md:block" />
      <m.span
        aria-hidden
        style={{ scaleX: fill }}
        className="absolute inset-x-0 top-[5px] hidden h-0.5 origin-left bg-accent md:block"
      />

      {milestones.map((item, i) => (
        <m.li
          key={item.year}
          className="relative"
          initial="off"
          whileInView="on"
          viewport={{ once: true, amount: 0.8 }}
        >
          <span
            aria-hidden
            className="absolute -left-8 top-2 grid size-3 place-items-center rounded-full border-2 border-accent bg-bg md:-top-10 md:left-0"
          >
            <m.span
              variants={{ off: { scale: 0 }, on: { scale: 1 } }}
              transition={{ duration: 0.35, delay: i * 0.15 + 0.1 }}
              className="size-1.5 rounded-full bg-accent"
            />
          </span>
          <m.div
            variants={{ off: { opacity: 0, y: 16 }, on: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: easeOut, delay: i * 0.15 }}
          >
            <Year text={item.year} delay={i * 150} />
            <p className="mt-3 max-w-[34ch] leading-relaxed text-muted">{item.text}</p>
          </m.div>
        </m.li>
      ))}
    </ol>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Reveal>
      <article className="grid gap-8 rounded-[28px] border border-line bg-surface p-7 md:grid-cols-12 md:p-10">
        <header className="md:col-span-4">
          <h3 className="text-2xl font-bold leading-tight font-stretch-[110%] md:text-3xl">{job.role}</h3>
          <p className="mt-1 text-lg text-muted">
            {job.company}, {job.location}
          </p>
          <p className="mt-5 text-[0.9375rem] font-semibold">{job.period}</p>
          {job.current ? (
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-sm font-medium text-accent">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              Posizione attuale
            </span>
          ) : null}
        </header>
        <div className="md:col-span-8">
          <p className="max-w-[60ch] text-lg leading-relaxed">{job.summary}</p>
          <ul className="mt-6 grid gap-3">
            {job.highlights.map((item, i) => (
              <m.li
                key={item}
                className="flex max-w-[64ch] gap-3 leading-relaxed text-muted"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.9 }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.05 }}
              >
                <span aria-hidden className="mt-[0.75em] h-0.5 w-3 shrink-0 bg-accent" />
                {item}
              </m.li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export function Experience() {
  return (
    <section
      id="esperienza"
      aria-labelledby="esperienza-titolo"
      className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32"
    >
      <SectionHeading id="esperienza-titolo">{headings.experience}</SectionHeading>
      <Timeline />
      <div className="mt-20 grid gap-5">
        {jobs.map((job) => (
          <JobCard key={`${job.company}-${job.period}`} job={job} />
        ))}
      </div>
    </section>
  );
}
