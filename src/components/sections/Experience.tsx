import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { headings, jobs, milestones, type Job } from "../../content";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

/** Linea del tempo che si riempie mentre scorri: racconta la crescita nel tempo. */
function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative mt-16 grid gap-10 pl-8 md:grid-cols-3 md:gap-8 md:pl-0 md:pt-10">
      {/* Mobile: linea verticale */}
      <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line md:hidden" />
      <motion.span
        aria-hidden
        style={{ scaleY: fill }}
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent md:hidden"
      />
      {/* Desktop: linea orizzontale */}
      <span aria-hidden className="absolute inset-x-0 top-[5px] hidden h-px bg-line md:block" />
      <motion.span
        aria-hidden
        style={{ scaleX: fill }}
        className="absolute inset-x-0 top-[5px] hidden h-px origin-left bg-accent md:block"
      />

      {milestones.map((m, i) => (
        <li key={m.year} className="relative">
          <span
            aria-hidden
            className="absolute -left-8 top-2 size-[11px] rounded-full border-2 border-accent bg-bg md:-top-10 md:left-0"
          />
          <Reveal delay={i * 0.12}>
            <p className="font-display text-5xl font-semibold tracking-tight md:text-6xl">{m.year}</p>
            <p className="mt-3 max-w-[32ch] leading-relaxed text-muted">{m.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Reveal>
      <article className="grid gap-8 rounded-[28px] border border-line bg-surface p-7 md:grid-cols-12 md:p-10">
        <div className="md:col-span-4">
          <p className="font-mono text-sm text-muted">{job.period}</p>
          {job.current && (
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-xs font-medium text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              Posizione attuale
            </span>
          )}
        </div>
        <div className="md:col-span-8">
          <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{job.role}</h3>
          <p className="mt-1 text-lg text-muted">
            {job.company}, {job.location}
          </p>
          <p className="mt-5 max-w-[60ch] leading-relaxed">{job.summary}</p>
          <ul className="mt-6 grid gap-3">
            {job.highlights.map((item) => (
              <li key={item} className="flex max-w-[64ch] gap-3 leading-relaxed text-muted">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-wrap gap-2">
            {job.stack.map((tool) => (
              <li key={tool} className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-muted">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export function Experience() {
  return (
    <section id="esperienza" className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <SectionHeading className="max-w-3xl">{headings.experience}</SectionHeading>
      <Timeline />
      <div className="mt-20 grid gap-5">
        {jobs.map((job) => (
          <JobCard key={`${job.company}-${job.period}`} job={job} />
        ))}
      </div>
    </section>
  );
}
