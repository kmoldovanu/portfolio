import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { cta, nav, profile } from "../../content";
import { useTheme } from "../../lib/useTheme";
import { easeOut, spring } from "../../lib/motion";
import { Button } from "../ui/Button";

const HIDE_AFTER = 160;

/** Si nasconde scorrendo verso il basso, torna appena si risale. La barra arancione mostra quanto manca. */
export function Nav() {
  const { theme, toggle } = useTheme();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, spring);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Aggiorna lo stato solo quando cambia davvero, non a ogni frame.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextHidden = y > HIDE_AFTER && y > prev;
    if (nextHidden !== hidden) setHidden(nextHidden);
    if (y > 8 !== scrolled) setScrolled(y > 8);
  });

  return (
    <m.header
      initial={{ y: "-100%" }}
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: hidden ? 0.25 : 0.45, ease: easeOut }}
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Principale" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <a href="#top" className="flex items-center gap-3 font-bold font-stretch-[112%]">
          <span aria-hidden className="relative size-9 overflow-hidden rounded-full bg-accent">
            <img
              src={profile.photo}
              alt=""
              width={441}
              height={673}
              className="absolute inset-x-0 top-[6%] w-full"
            />
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="rounded-full px-4 py-2 text-[0.9375rem] text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
          >
            <m.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              {theme === "dark" ? <Sun size={19} aria-hidden /> : <Moon size={19} aria-hidden />}
            </m.span>
          </button>
          <Button href="#contatti" className="px-5">
            {cta.contact}
          </Button>
        </div>
      </nav>
      <m.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-accent" />
    </m.header>
  );
}
