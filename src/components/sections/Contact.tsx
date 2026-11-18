import { useState, type ChangeEvent, type FormEvent } from "react";
import * as m from "motion/react-m";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { headings, profile } from "../../content";
import { Button } from "../ui/Button";
import { CvDownload } from "../ui/CvDownload";
import { Field } from "../ui/Field";
import { Reveal } from "../ui/Reveal";
import { ScrambleText } from "../ui/ScrambleText";
import { SectionHeading } from "../ui/SectionHeading";
import { easeOut } from "../../lib/motion";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const empty: Values = { name: "", email: "", message: "" };

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Scrivi il tuo nome.";
  if (!EMAIL.test(values.email)) errors.email = "Inserisci un indirizzo email valido, ad esempio nome@azienda.it.";
  if (values.message.trim().length < 10) errors.message = "Scrivi almeno 10 caratteri: chi sei e di cosa vuoi parlare.";
  return errors;
}

/** Il messaggio parte dalla funzione /api/contact (vedi api/contact.ts), che lo inoltra per email. */
async function sendMessage(values: Values, website: string): Promise<{ ok: true } | { ok: false; errors?: Errors }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, website }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, errors: body.errors };
  } catch {
    return { ok: false };
  }
}

/** Se l'invio non riesce, lo stesso messaggio si può spedire dal proprio programma di posta. */
function mailtoHref({ name, email, message }: Values) {
  const subject = encodeURIComponent(`Messaggio dal sito da ${name}`);
  const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Campo esca per i bot, invisibile alle persone.
  const [website, setWebsite] = useState("");

  const update = (key: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err));
    if (status === "error") setStatus("idle");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    const result = await sendMessage(values, website);
    if (result.ok) {
      setStatus("sent");
    } else if (result.errors) {
      setErrors(result.errors);
      setStatus("idle");
    } else {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(empty);
    setStatus("idle");
  };

  return (
    <section id="contatti" aria-labelledby="contatti-titolo" className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-6 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading id="contatti-titolo">{headings.contact}</SectionHeading>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted">{headings.contactBody}</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-block break-all text-[clamp(1.35rem,2.6vw,1.9rem)] font-bold underline decoration-2 underline-offset-[6px] font-stretch-[108%] decoration-line transition-colors duration-200 hover:text-accent hover:decoration-accent"
          >
            <ScrambleText text={profile.email} play={false} replayOnHover duration={600} />
          </a>
          <ul className="mt-6 flex gap-5 text-[0.9375rem] font-semibold">
            {profile.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-accent hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CvDownload />
          </div>
        </div>

        <Reveal className="lg:col-span-6" delay={0.1}>
          {status === "sent" ? (
            <m.div
              role="status"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="flex min-h-[26rem] flex-col items-start justify-center rounded-[28px] border border-line bg-bg p-8 md:p-10"
            >
              <CheckCircle size={36} weight="fill" className="text-accent" aria-hidden />
              <h3 className="mt-5 text-2xl font-bold font-stretch-[110%]">Messaggio inviato</h3>
              <p className="mt-3 max-w-[42ch] leading-relaxed text-muted">
                Grazie, {values.name.trim().split(/\s+/)[0]}. Ti rispondo a {values.email} il prima possibile.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 min-h-11 cursor-pointer text-[0.9375rem] font-semibold underline underline-offset-4 hover:text-accent"
              >
                Scrivi un altro messaggio
              </button>
            </m.div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              aria-label="Scrivimi"
              aria-busy={status === "sending"}
              className="relative grid gap-5 rounded-[28px] border border-line bg-bg p-6 md:p-9"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="name"
                  label="Nome"
                  autoComplete="name"
                  value={values.name}
                  onChange={update("name")}
                  error={errors.name}
                />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={update("email")}
                  error={errors.email}
                />
              </div>
              <Field
                id="message"
                label="Messaggio"
                multiline
                value={values.message}
                onChange={update("message")}
                error={errors.message}
                hint="Chi sei, di cosa vuoi parlare e come preferisci essere ricontattato."
              />

              {/* Esca per i bot: fuori dallo schermo e fuori dall'ordine del tab. */}
              <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                <label htmlFor="website">Sito web</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {status === "error" ? (
                <p role="alert" className="rounded-xl border border-danger/50 px-4 py-3 text-[0.9375rem] leading-relaxed">
                  Il messaggio non è partito. Riprova tra poco oppure{" "}
                  <a href={mailtoHref(values)} className="font-semibold underline underline-offset-4 hover:text-accent">
                    invialo dal tuo programma di posta
                  </a>
                  .
                </p>
              ) : null}

              <div>
                <Button type="submit" icon={ArrowUpRight} disabled={status === "sending"}>
                  {status === "sending" ? "Invio in corso…" : "Invia il messaggio"}
                </Button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
