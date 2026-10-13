import { useEffect, useRef, useState } from "react";

type ScrambleTextProps = {
  text: string;
  /** Quando diventa true parte la decodifica (una volta per ogni passaggio a true). */
  play?: boolean;
  /** Ripete la decodifica al passaggio del mouse. */
  replayOnHover?: boolean;
  /** Ritardo prima di partire, in millisecondi. */
  delay?: number;
  duration?: number;
  className?: string;
};

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789<>/{}[]=+*#_";

/**
 * Testo che si decodifica da caratteri casuali, da sinistra a destra.
 * Gli screen reader leggono sempre il testo finale; con "riduci movimento" compare direttamente.
 */
export function ScrambleText({ text, play = true, replayOnHover = false, delay = 0, duration = 900, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const [run, setRun] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    // Parte se richiesto da `play` oppure da un passaggio del mouse (run > 0).
    if ((!play && run === 0) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }
    let start = 0;
    const frame = (now: number) => {
      start ||= now;
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < settled || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (progress < 1) raf.current = requestAnimationFrame(frame);
    };
    const t = setTimeout(() => (raf.current = requestAnimationFrame(frame)), delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
    };
  }, [text, play, delay, duration, run]);

  return (
    <span className={className} onMouseEnter={replayOnHover ? () => setRun((n) => n + 1) : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </span>
  );
}
