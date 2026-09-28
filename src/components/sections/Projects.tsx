import { ArrowUpRight, GithubLogo, Hammer } from "@phosphor-icons/react";
import { headings, projects, projectSlots, type Project } from "../../content";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-[28px] bg-surface-2">
        <img
          src={project.image}
          alt={`Anteprima del progetto ${project.title}`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>
      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
      <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tool) => (
          <li key={tool} className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-muted">
            {tool}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium">
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
            Demo <ArrowUpRight size={14} weight="bold" />
          </a>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
            <GithubLogo size={16} /> Codice
          </a>
        )}
      </div>
    </article>
  );
}

/** Spazio riservato a un progetto non ancora pubblicato. Il riflesso che scorre indica "in lavorazione". */
function ProjectPlaceholder() {
  return (
    <article>
      <div className="shimmer relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[28px] border border-dashed border-fg/20 bg-surface">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-surface-2 text-accent">
            <Hammer size={24} />
          </span>
          <p className="font-display text-2xl font-semibold tracking-tight">Progetto in arrivo</p>
          <p className="max-w-[34ch] text-sm leading-relaxed text-muted">
            Ci sto lavorando. Presto qui trovi descrizione, codice e demo.
          </p>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const placeholders = Math.max(0, projectSlots - projects.length);

  return (
    <section id="progetti" className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <SectionHeading className="max-w-3xl">{headings.projects}</SectionHeading>
      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-8">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
        {Array.from({ length: placeholders }, (_, i) => (
          <Reveal key={`slot-${i}`} delay={(projects.length + i) * 0.1}>
            <ProjectPlaceholder />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
