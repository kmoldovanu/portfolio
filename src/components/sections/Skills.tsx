import * as m from "motion/react-m";
import { headings, skillAreas, strengths, yearsScale } from "../../content";
import { easeOut } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TiltCard } from "../ui/TiltCard";

/** Barra degli anni: si riempie quando la riga entra in vista. */
function YearsMeter({ years, delay }: { years: number; delay: number }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-2 w-28 overflow-hidden rounded-full bg-fg/10">
        <m.span
          className="block h-full origin-left rounded-full bg-accent"
          style={{ width: `${(years / yearsScale) * 100}%` }}
          variants={{ off: { scaleX: 0 }, on: { scaleX: 1 } }}
          transition={{ duration: 0.9, ease: easeOut, delay: delay + 0.15 }}
        />
      </span>
      <span className="text-[0.9375rem] font-semibold tabular-nums">
        {years} {years === 1 ? "anno" : "anni"}
      </span>
    </div>
  );
}

export function Skills() {
  return (
    <section id="competenze" aria-labelledby="competenze-titolo" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <div className="grid gap-6 lg:grid-cols-12">
          <SectionHeading id="competenze-titolo" className="lg:col-span-6">
            {headings.skills}
          </SectionHeading>
          <Reveal className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="max-w-[48ch] text-lg leading-relaxed text-muted">{headings.skillsBody}</p>
          </Reveal>
        </div>

        {/* Una vera tabella: area, anni, cosa ci faccio, strumenti. */}
        <table className="mt-14 w-full border-collapse text-left">
          <caption className="sr-only">Competenze per area, con anni di esperienza e strumenti</caption>
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-fg/25 text-sm text-muted">
              <th scope="col" className="pb-3 pr-6 font-medium">
                Area
              </th>
              <th scope="col" className="pb-3 pr-6 font-medium">
                Esperienza
              </th>
              <th scope="col" className="pb-3 pr-6 font-medium">
                Cosa ci faccio
              </th>
              <th scope="col" className="pb-3 font-medium">
                Strumenti
              </th>
            </tr>
          </thead>
          <tbody>
            {skillAreas.map((area, i) => (
              <m.tr
                key={area.title}
                initial="off"
                whileInView="on"
                viewport={{ once: true, amount: 0.6 }}
                variants={{ off: { opacity: 0, y: 14 }, on: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.06 }}
                className="group grid gap-3 border-b border-line py-6 md:table-row"
              >
                <th
                  scope="row"
                  className="pr-6 align-top text-2xl font-bold font-stretch-[112%] transition-colors duration-200 group-hover:text-accent md:py-6"
                >
                  {area.title}
                </th>
                <td className="pr-6 align-top md:py-6 md:pt-8">
                  <YearsMeter years={area.years} delay={i * 0.06} />
                </td>
                <td className="max-w-[44ch] pr-6 align-top leading-relaxed text-muted md:py-6">{area.body}</td>
                <td className="align-top md:py-6">
                  <ul className="flex flex-wrap gap-1.5">
                    {area.tools.map((tool) => (
                      <li key={tool} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-medium">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </td>
              </m.tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-24 text-2xl font-bold font-stretch-[112%] md:text-3xl">{headings.strengths}</h3>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {strengths.map((item, i) => (
            <m.li
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}
            >
              {/* Nessuna inclinazione: solo la luce che segue il cursore. */}
              <TiltCard max={0} scale={1} className="h-full overflow-hidden rounded-[24px]">
                <div className="h-full rounded-[24px] border border-line bg-bg p-7 transition-colors duration-300 hover:border-accent/50">
                  <p className="text-xl font-bold font-stretch-[108%]">{item.title}</p>
                  <p className="mt-3 max-w-[38ch] leading-relaxed text-muted">{item.body}</p>
                </div>
              </TiltCard>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
