import { MotionConfig } from "motion/react";
import { Nav } from "./components/sections/Nav";
import { Hero } from "./components/sections/Hero";
import { LogoMarquee } from "./components/sections/LogoMarquee";
import { Statement } from "./components/sections/Statement";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Skills } from "./components/sections/Skills";
import { Strengths } from "./components/sections/Strengths";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";

/** La pagina è solo composizione: ogni sezione vive nel suo file. */
export default function App() {
  return (
    // reducedMotion="user": con "riduci movimento" attivo le animazioni diventano istantanee.
    <MotionConfig reducedMotion="user">
      <div className="grain overflow-x-clip">
        <Nav />
        <main>
          <Hero />
          <LogoMarquee />
          <Statement />
          <Experience />
          <Skills />
          <Projects />
          <Strengths />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
