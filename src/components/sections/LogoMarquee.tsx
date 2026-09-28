import { logos } from "../../content";
import { BrandLogo } from "../ui/BrandLogo";

/** L'unica fascia scorrevole della pagina: le tecnologie che uso ogni giorno. */
export function LogoMarquee() {
  const row = [...logos, ...logos];
  return (
    <section aria-label="Tecnologie" className="marquee relative overflow-hidden border-y border-line py-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-20 pr-20" aria-hidden={copy === 1}>
            {row.map((logo, i) => (
              <BrandLogo
                key={`${logo.slug}-${i}`}
                {...logo}
                className="size-9 bg-muted transition-colors duration-300 hover:bg-accent md:size-11"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
