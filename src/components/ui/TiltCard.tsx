import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

/*
 * Card che si inclina verso il cursore, con un riflesso arancione che lo segue.
 * Adattata da "Optimized Tilt Card" (21st.dev):
 * - solo mouse: su touch l'inclinazione disturberebbe lo scroll (anche quello orizzontale del codice);
 * - tutto passa da variabili CSS, quindi nessun re-render durante il movimento;
 * - con "riduci movimento" resta solo il riflesso, niente rotazione.
 */

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Inclinazione massima in gradi. */
  max?: number;
  scale?: number;
};

const baseStyle = {
  transform:
    "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--scale, 1))",
  transition: "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
} as CSSProperties;

export function TiltCard({ children, className = "", max = 7, scale = 1.015 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const set = (vars: Record<string, string>) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      for (const [key, value] of Object.entries(vars)) el.style.setProperty(key, value);
    });
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const tilt = reduce.current ? 0 : max;
    set({
      "--px": `${px * 100}%`,
      "--py": `${py * 100}%`,
      "--rx": `${(0.5 - py) * 2 * tilt}deg`,
      "--ry": `${(px - 0.5) * 2 * tilt}deg`,
      "--scale": reduce.current ? "1" : String(scale),
    });
  };

  const onLeave = () => set({ "--rx": "0deg", "--ry": "0deg", "--scale": "1" });

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={baseStyle} className={`group/tilt relative ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--px, 50%) var(--py, 50%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}
