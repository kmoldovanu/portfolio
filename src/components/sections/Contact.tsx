import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle, DownloadSimple } from "@phosphor-icons/react";
import { cta, headings, profile } from "../../content";
import { easeOut } from "../../lib/motion";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Reveal } from "../ui/Reveal";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent";

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Dimmi come ti chiami.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Serve un indirizzo email valido.";
  if (values.message.trim().length < 10) errors.message = "Scrivi almeno qualche parola sulla posizione.";
  return errors;
}

/** Senza backend: il form apre il client di posta con il messaggio già compilato. */
function openMailClient({ name, email, message }: Values) {
  const subject = encodeURIComponent(`Opportunità di lavoro da ${name}`);
  const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const update = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    setTimeout(() => {
      openMailClient(values);
      setStatus("sent");
    }, 600);
  };

  return (
    <section id="contatti" className="mx-auto grid max-w-7xl gap-14 px-4 py-24 md:px-6 md:py-36 lg:grid-cols-12">
      <Reveal className="lg:col-span-6">
        <h2 className="font-display text-5xl font-bold leading-[1] tracking-[-0.03em] md:text-6xl">
          {headings.contact}
        </h2>
        <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-muted">{headings.contactBody}</p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-10 inline-flex items-center gap-2 font-display text-2xl font-medium underline decoration-line decoration-2 underline-offset-8 transition-colors hover:decoration-accent md:text-3xl"
        >
          {profile.email}
          <ArrowUpRight size={22} />
        </a>
        {profile.cvUrl && (
          <div className="mt-10">
            <Button href={profile.cvUrl} variant="ghost" icon={DownloadSimple}>
              {cta.cv}
            </Button>
          </div>
        )}
      </Reveal>

      <Reveal className="lg:col-span-6" delay={0.1}>
        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="flex h-full min-h-[420px] flex-col items-start justify-center rounded-[28px] border border-line bg-surface p-10"
              role="status"
            >
              <CheckCircle size={40} weight="fill" className="text-accent" />
              <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">Messaggio pronto.</h3>
              <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">
                Si è aperto il tuo programma di posta con il testo già compilato. Premi invio e ci sentiamo presto.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 text-sm font-medium underline underline-offset-4 hover:text-accent"
              >
                Scrivi un altro messaggio
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={submit}
              noValidate
              className="grid gap-5 rounded-[28px] border border-line bg-surface/60 p-6 md:p-9"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field id="name" label="Nome" autoComplete="name" value={values.name} onChange={update("name")} error={errors.name} />
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
                hint="Azienda, posizione e come preferisci essere ricontattato."
              />
              <div>
                <Button type="submit" icon={ArrowUpRight} magnetic disabled={status === "sending"}>
                  {status === "sending" ? "Preparo il messaggio" : cta.contact}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
