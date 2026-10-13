import { useEffect, useRef } from "react";

/*
 * Griglia che si piega verso il cursore e fa un'onda a ogni clic.
 * Adattata da "Kinetic Grid" di satoriui (21st.dev):
 * - limitata alla sezione che la contiene, non a tutta la finestra;
 * - nitida sugli schermi ad alta densità (devicePixelRatio);
 * - colori presi dai token del tema (--fg, --accent), aggiornati al cambio tema;
 * - il ciclo di disegno si ferma quando nulla si muove o la sezione è fuori vista;
 * - con "riduci movimento" la griglia resta ferma.
 */

type Point = { x: number; y: number };
type Ripple = { x: number; y: number; born: number; radius: number; strength: number };
type Rgb = [number, number, number];

const CELL = 56;
const INFLUENCE = 260;
const MAX_WARP = 26;
const LERP = 0.1;
const RIPPLE_SPEED = 420;
const RIPPLE_LIFE = 1 / 1.1;
const WAVE = 60;
const MAX_RIPPLES = 6;

function readRgb(style: CSSStyleDeclaration, name: string, fallback: Rgb): Rgb {
  const hex = style.getPropertyValue(name).trim();
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fallback;
}

const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a.toFixed(3)})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export function KineticGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    let width = 0;
    let height = 0;
    let fg: Rgb = [20, 20, 21];
    let accent: Rgb = [184, 70, 22];
    let visible = true;
    let raf = 0;

    const mouse: Point = { x: 0, y: 0 };
    const target: Point = { x: 0, y: 0 };
    let presence = 0; // 0 = cursore fuori, 1 = dentro: sfuma la deformazione invece di farla sparire di colpo
    let targetPresence = 0;
    const ripples: Ripple[] = [];

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      fg = readRgb(style, "--fg", fg);
      accent = readRgb(style, "--accent", accent);
    };

    const warp = (gx: number, gy: number, col: number, row: number, cols: number, rows: number) => {
      // I bordi restano fermi: la griglia si piega dentro, non si stacca dai lati.
      const pin = Math.min(col / 1.5, (cols - 1 - col) / 1.5, 1) * Math.min(row / 1.5, (rows - 1 - row) / 1.5, 1);
      const pinFactor = pin * pin;
      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.hypot(dx, dy);
      const proximity = Math.max(0, 1 - dist / INFLUENCE) * pinFactor * presence;

      let x = gx;
      let y = gy;
      for (const r of ripples) {
        const rdx = gx - r.x;
        const rdy = gy - r.y;
        const rdist = Math.hypot(rdx, rdy) || 1;
        const diff = rdist - r.radius;
        if (Math.abs(diff) < WAVE) {
          const s = (1 - Math.abs(diff) / WAVE) * r.strength * 18 * pinFactor * (diff < 0 ? 1 : -1);
          x += (rdx / rdist) * s;
          y += (rdy / rdist) * s;
        }
      }
      if (dist > 0 && dist < INFLUENCE) {
        const t = dist / INFLUENCE;
        const amount = (1 - t) * (1 - t) * Math.min(1, dist / 60) * MAX_WARP * pinFactor * presence;
        x -= (dx / dist) * amount;
        y -= (dy / dist) * amount;
      }
      return { x, y, p: proximity };
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        // Il timestamp del frame può essere di poco precedente al clic: senza il limite a 0
        // il raggio diventa negativo e arc() lancia IndexSizeError.
        const age = Math.max(0, (now - ripples[i].born) / 1000);
        ripples[i].radius = age * RIPPLE_SPEED;
        ripples[i].strength = Math.max(0, 1 - age / RIPPLE_LIFE);
        if (ripples[i].strength <= 0) ripples.splice(i, 1);
      }

      const cols = Math.max(2, Math.ceil(width / CELL)) + 1;
      const rows = Math.max(2, Math.ceil(height / CELL)) + 1;
      const cw = width / (cols - 1);
      const ch = height / (rows - 1);
      const grid: { x: number; y: number; p: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) grid[r][c] = warp(c * cw, r * ch, c, r, cols, rows);
      }

      // Linee a riposo in un solo tracciato; quelle vicine al cursore una per una, con colore e spessore propri.
      const base = new Path2D();
      const segment = (a: { x: number; y: number; p: number }, b: { x: number; y: number; p: number }) => {
        const t = smooth((a.p + b.p) / 2);
        if (t < 0.01) {
          base.moveTo(a.x, a.y);
          base.lineTo(b.x, b.y);
          return;
        }
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = rgba(accent, lerp(0.1, 0.9, t));
        ctx.lineWidth = lerp(1, 1.6, t);
        ctx.stroke();
      };
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols - 1; c++) segment(grid[r][c], grid[r][c + 1]);
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows - 1; r++) segment(grid[r][c], grid[r + 1][c]);
      ctx.strokeStyle = rgba(fg, 0.08);
      ctx.lineWidth = 1;
      ctx.stroke(base);

      const dots = new Path2D();
      for (const row of grid) {
        for (const pt of row) {
          const t = smooth(pt.p);
          if (t < 0.01) {
            dots.moveTo(pt.x + 1.6, pt.y);
            dots.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
            continue;
          }
          const radius = lerp(1.6, 3.4, t);
          if (t > 0.3) {
            const glow = radius + 7 * ((t - 0.3) / 0.7);
            const g = ctx.createRadialGradient(pt.x, pt.y, radius * 0.5, pt.x, pt.y, glow);
            g.addColorStop(0, rgba(accent, t * 0.35));
            g.addColorStop(1, rgba(accent, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, glow, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = rgba(accent, lerp(0.3, 1, t));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = rgba(fg, 0.16);
      ctx.fill(dots);

      for (const r of ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(accent, r.strength * 0.35);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      // Azzerato prima di disegnare: se il disegno fallisse, wake() potrebbe ripartire invece di restare bloccato.
      raf = 0;
      mouse.x = lerp(mouse.x, target.x, LERP);
      mouse.y = lerp(mouse.y, target.y, LERP);
      presence = lerp(presence, targetPresence, LERP);
      draw(now);
      const settled =
        Math.abs(mouse.x - target.x) < 0.1 &&
        Math.abs(mouse.y - target.y) < 0.1 &&
        Math.abs(presence - targetPresence) < 0.005 &&
        ripples.length === 0;
      raf = settled || !visible ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf && visible && !reduce.matches) raf = requestAnimationFrame(tick);
    };
    const redraw = () => {
      if (raf) return;
      draw(performance.now());
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };

    const local = (e: PointerEvent): Point => {
      const rect = host.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (targetPresence === 0) {
        // Entrando, la deformazione nasce dove è il cursore invece di attraversare la griglia.
        mouse.x = p.x;
        mouse.y = p.y;
      }
      target.x = p.x;
      target.y = p.y;
      targetPresence = 1;
      wake();
    };
    const onLeave = () => {
      targetPresence = 0;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      ripples.push({ x: p.x, y: p.y, born: performance.now(), radius: 0, strength: 1 });
      // Clic a raffica: tengo solo le onde più recenti, il costo per frame resta limitato.
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      wake();
    };
    const onTheme = () => {
      readColors();
      redraw();
    };

    readColors();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(host);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    darkQuery.addEventListener("change", onTheme);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      darkQuery.removeEventListener("change", onTheme);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
