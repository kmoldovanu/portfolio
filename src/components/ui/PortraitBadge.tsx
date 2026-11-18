import { useId, useState } from "react";
import * as m from "motion/react-m";
import { profile } from "../../content";
import { easeOut } from "../../lib/motion";

/*
 * Bollino con la foto: disco arancione, la testa esce dal bordo superiore
 * e intorno gira una scritta circolare. Al passaggio del mouse la foto sale
 * un poco; al clic saluta con un piccolo dondolio.
 *
 * La foto è ritagliata con una maschera a due livelli: un rettangolo per la parte
 * sopra il centro del disco e un cerchio per quella sotto. Così le spalle restano
 * dentro il disco e la testa può uscirne. Con "riduci movimento" la scritta sta ferma.
 */

const RING_TEXT = "Full-stack · Django · React · htmx · Cuneo · ";
// Circonferenza del percorso (raggio 86): la scritta la riempie esattamente, senza buchi.
const RING_LENGTH = 2 * Math.PI * 86;

// La foto è alta 1,4 volte il disco: il centro del disco cade al 64,29% della sua altezza.
const CENTER = (0.4 + 0.5) / 1.4;
const mask = [
  `linear-gradient(#000, #000) top / 100% ${CENTER * 100}% no-repeat`,
  `radial-gradient(circle closest-side at 50% ${CENTER * 100}%, #000 99%, transparent 100%)`,
].join(", ");

export function PortraitBadge({ className = "" }: { className?: string }) {
  const ringId = useId();
  const [waves, setWaves] = useState(0);

  return (
    <m.button
      type="button"
      aria-label={`Foto di ${profile.name}`}
      onClick={() => setWaves((n) => n + 1)}
      initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ duration: 1, ease: easeOut, delay: 0.85 }}
      className={`group/badge relative block aspect-square w-full cursor-pointer rounded-full ${className}`}
    >
      {/* Scritta circolare */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="badge-ring absolute inset-0 size-full text-fg"
      >
        <defs>
          <path id={ringId} d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
        </defs>
        <text className="fill-current text-[13px] font-semibold uppercase">
          <textPath href={`#${ringId}`} textLength={RING_LENGTH} lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>

      {/* Disco + foto */}
      <span className="absolute inset-[17%] rounded-full bg-accent shadow-[0_18px_40px_-12px_var(--shadow)]">
        <span
          aria-hidden
          className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_35%_30%,color-mix(in_srgb,white_28%,transparent),transparent_60%)]"
        />
        <span className="absolute inset-x-0 bottom-0 h-[140%]" style={{ mask, WebkitMask: mask }}>
          <span className="absolute inset-0 transition-transform duration-500 ease-out group-hover/badge:-translate-y-[4%] group-hover/badge:scale-[1.04]">
            <m.img
              key={waves}
              src={profile.photo}
              alt=""
              width={441}
              height={673}
              decoding="async"
              animate={waves ? { rotate: [0, -7, 6, -4, 0] } : undefined}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              style={{ transformOrigin: "50% 100%" }}
              className="absolute inset-0 size-full object-contain object-bottom"
            />
          </span>
        </span>
      </span>
    </m.button>
  );
}
