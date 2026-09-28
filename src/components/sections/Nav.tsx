import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { cta, nav, profile } from "../../content";
import { useTheme } from "../../lib/useTheme";
import { easeOut } from "../../lib/motion";
import { Button } from "../ui/Button";

export function Nav() {
  const { theme, toggle } = useTheme();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  // Aggiorna lo stato solo quando si supera la soglia, non a ogni frame.
  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > 24 !== scrolled) setScrolled(y > 24);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-3 md:px-6"
    >
      <nav
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-3 pl-5 transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? "border border-line bg-surface/75 shadow-[0_10px_40px_-20px_var(--shadow)] backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-3" aria-label="Torna all'inizio">
          <span className="grid size-9 place-items-center rounded-full bg-fg font-display text-sm font-bold text-bg">
            {profile.initials}
          </span>
          <span className="hidden font-display text-sm font-semibold sm:block">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
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
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
          </button>
          <Button href="#contatti" className="px-5 py-2.5">
            {cta.contact}
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
