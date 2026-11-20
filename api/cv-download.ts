/**
 * POST /api/cv-download — avvisa per email ogni volta che qualcuno scarica il CV.
 *
 * Il sito lo chiama con navigator.sendBeacon al clic sul pulsante: il download parte comunque,
 * anche se questa funzione fallisce. Le richieste automatiche (crawler) non cliccano, quindi
 * non arrivano qui. Usa le stesse variabili e lo stesso destinatario di /api/contact.
 *
 * Per contare i download basta cercare nella posta l'oggetto "CV scaricato".
 */

import { DEFAULT_FROM, DEFAULT_TO } from "./contact.js";

declare const process: { env: Record<string, string | undefined> };

type Payload = { lang?: unknown; from?: unknown; tag?: unknown };

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Da "https://www.linkedin.com/feed/..." a "linkedin.com"; vuoto = visita diretta (link incollato, app, email). */
function source(referrer: string): string {
  if (!referrer) return "diretta (link incollato, app o email)";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "sconosciuta";
  }
}

function device(ua: string): string {
  if (/iPhone|Android.+Mobile|Mobile Safari/i.test(ua)) return "telefono";
  if (/iPad|Tablet|Android/i.test(ua)) return "tablet";
  return "computer";
}

/** Vercel aggiunge la posizione approssimativa ricavata dall'IP (città e paese). */
function place(headers: Headers): string {
  const city = headers.get("x-vercel-ip-city");
  const country = headers.get("x-vercel-ip-country");
  const parts = [city ? decodeURIComponent(city) : "", country ?? ""].filter(Boolean);
  return parts.length ? parts.join(", ") : "non disponibile";
}

export async function POST(request: Request) {
  let data: Payload = {};
  try {
    data = JSON.parse(await request.text()) as Payload;
  } catch {
    // corpo mancante o non valido: l'avviso parte lo stesso, con meno dettagli
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return new Response(null, { status: 204 });

  const lang = text(data.lang, 5) === "en" ? "inglese" : "italiano";
  const tag = text(data.tag, 60);
  const lines = [
    `Versione: ${lang}`,
    `Provenienza: ${source(text(data.from, 500))}`,
    ...(tag ? [`Link personalizzato: ?da=${tag}`] : []),
    `Posizione approssimativa: ${place(request.headers)}`,
    `Dispositivo: ${device(request.headers.get("user-agent") ?? "")}`,
    `Quando: ${new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })}`,
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM?.trim() || DEFAULT_FROM,
      to: [process.env.CONTACT_TO?.trim() || DEFAULT_TO],
      subject: `CV scaricato (${lang})${tag ? ` da ?da=${tag}` : ""}`,
      text: `Qualcuno ha scaricato il tuo CV dal portfolio.\n\n${lines.join("\n")}\n`,
    }),
  });
  if (!res.ok) console.error("Resend ha rifiutato l'avviso:", res.status, await res.text());

  return new Response(null, { status: 204 });
}
