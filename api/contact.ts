/**
 * POST /api/contact — funzione serverless di Vercel.
 *
 * Riceve il form dei contatti, lo valida di nuovo lato server e lo inoltra per email con Resend
 * (API HTTP, la stessa usata in dinomoldo-dev). La chiave non arriva mai al browser.
 *
 * Variabili d'ambiente da impostare su Vercel (Settings → Environment Variables):
 * - RESEND_API_KEY        chiave Resend, obbligatoria
 * - CONTACT_TO            dove ricevere i messaggi (predefinito: l'email del portfolio)
 * - CONTACT_FROM          mittente; senza un dominio verificato su Resend resta onboarding@resend.dev,
 *                         che può scrivere solo all'indirizzo dell'account Resend
 */

// Il progetto non installa @types/node: basta dichiarare la parte di `process` che serve qui.
declare const process: { env: Record<string, string | undefined> };

const DEFAULT_TO = "moldovanu.business@gmail.com";
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = { name?: unknown; email?: unknown; message?: unknown; website?: unknown };

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return json({ error: "Richiesta non valida." }, 400);
  }

  // Campo nascosto: le persone non lo vedono, i bot lo compilano. Rispondiamo ok senza inviare nulla.
  if (text(data.website, 200)) return json({ ok: true }, 200);

  const name = text(data.name, 120);
  const email = text(data.email, 200);
  const message = text(data.message, 5000);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Scrivi il tuo nome.";
  if (!EMAIL.test(email)) errors.email = "Inserisci un indirizzo email valido.";
  if (message.length < 10) errors.message = "Scrivi almeno 10 caratteri.";
  if (Object.keys(errors).length > 0) return json({ errors }, 422);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("Messaggio non inviato: RESEND_API_KEY non configurata.");
    return json({ error: "Invio non configurato." }, 503);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM?.trim() || DEFAULT_FROM,
      to: [process.env.CONTACT_TO?.trim() || DEFAULT_TO],
      reply_to: email,
      subject: `Portfolio: messaggio da ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\n\n${message}\n`,
    }),
  });

  if (!res.ok) {
    console.error("Resend ha rifiutato l'invio:", res.status, await res.text());
    return json({ error: "Invio non riuscito." }, 502);
  }

  return json({ ok: true }, 200);
}
