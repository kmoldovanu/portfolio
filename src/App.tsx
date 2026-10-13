import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { Nav } from "./components/sections/Nav";
import { Hero } from "./components/sections/Hero";
import { TechBand } from "./components/sections/TechBand";
import { Experience } from "./components/sections/Experience";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";

/** La pagina è solo composizione: ogni sezione vive nel suo file. */
export default function App() {
  return (
    // LazyMotion + componenti `m`: carica solo le funzioni di animazione DOM usate.
    // reducedMotion="user": con "riduci movimento" attivo le animazioni diventano istantanee.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#esperienza"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Vai al contenuto
        </a>
        <Nav />
        <main className="overflow-x-clip">
          <Hero />
          <TechBand />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  );
}
