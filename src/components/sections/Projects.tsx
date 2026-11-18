import * as m from "motion/react-m";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { Hammer } from "@phosphor-icons/react/dist/csr/Hammer";
import { headings, projects, projectSlots, type Project } from "../../content";
import { easeOut } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";
import { TiltCard } from "../ui/TiltCard";

const cardIn = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: easeOut, delay: i * 0.1 },
});

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <m.div {...cardIn(index)} className={project.featured ? "md:col-span-2" : undefined}>
      <TiltCard className="h-full rounded-[28px]" max={project.featured ? 3 : 7}>
        <article className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-7 transition-[border-color] duration-300 hover:border-accent/60 md:p-9">
          {/* Alone arancione che sale dal fondo al passaggio del mouse */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 translate-y-full bg-[radial-gradient(70%_100%_at_50%_100%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent)] transition-transform duration-500 ease-out group-hover:translate-y-0"
          />
          <p className="relative text-sm font-semibold uppercase tracking-[0.12em] text-accent">{project.kind}</p>
          <h3 className="relative mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] font-stretch-[115%]">
            {project.title}
          </h3>
          <p className={`relative mt-4 leading-relaxed text-muted ${project.featured ? "max-w-[68ch] md:text-lg" : "max-w-[52ch]"}`}>{project.summary}</p>
          <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-8">
            {project.stack.map((tool) => (
              <li key={tool} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-medium">
                {tool}
              </li>
            ))}
          </ul>
          {project.demo || project.repo ? (
            <div className="relative mt-4 flex flex-wrap gap-5 text-[0.9375rem]">
              {project.demo ? (
                <a href={project.demo} target="_blank" rel="noreferrer" className={linkClass}>
                  Apri la demo <ArrowUpRight size={16} weight="bold" aria-hidden />
                </a>
              ) : null}
              {project.repo ? (
                <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>
                  <GithubLogo size={18} aria-hidden /> Leggi il codice
                </a>
              ) : null}
            </div>
          ) : null}
        </article>
      </TiltCard>
    </m.div>
  );
}

/** Spazio riservato a un progetto non ancora pubblicato. */
function ProjectPlaceholder({ index }: { index: number }) {
  return (
    <m.article
      {...cardIn(index)}
      className="flex min-h-[22rem] flex-col items-start justify-end rounded-[28px] border border-dashed border-fg/20 p-7 md:p-9"
    >
      <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-accent">
        <Hammer size={22} aria-hidden />
      </span>
      <h3 className="mt-5 text-2xl font-bold font-stretch-[110%]">In lavorazione</h3>
      <p className="mt-2 max-w-[36ch] leading-relaxed text-muted">
        Il prossimo progetto personale arriva qui, con descrizione, codice e demo.
      </p>
    </m.article>
  );
}

export function Projects() {
  const placeholders = Math.max(0, projectSlots - projects.length);

  return (
    <section id="progetti" aria-labelledby="progetti-titolo" className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <SectionHeading id="progetti-titolo">{headings.projects}</SectionHeading>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
        {Array.from({ length: placeholders }, (_, i) => (
          <ProjectPlaceholder key={`slot-${i}`} index={projects.length + i} />
        ))}
      </div>
    </section>
  );
}
