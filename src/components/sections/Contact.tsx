import { useState, type ChangeEvent, type FormEvent } from "react";
import * as m from "motion/react-m";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { cta, headings, profile } from "../../content";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Reveal } from "../ui/Reveal";
import { ScrambleText } from "../ui/ScrambleText";
import { SectionHeading } from "../ui/SectionHeading";
import { easeOut } from "../../lib/motion";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const empty: Values = { name: "", email: "", message: "" };

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Scrivi il tuo nome.";
  if (!EMAIL.test(values.email)) errors.email = "Inserisci un indirizzo email valido, ad esempio nome@azienda.it.";
  if (values.message.trim().length < 10) errors.message = "Scrivi almeno 10 caratteri: azienda e posizione bastano.";
  return errors;
}

/** Senza backend: il form apre il client di posta con il messaggio già compilato. */
function openMailClient({ name, email, message }: Values) {
  const subject = encodeURIComponent(`Opportunità di lavoro da ${name}`);
  const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    openMailClient(values);
    setSent(true);
  };

  const reset = () => {
    setValues(empty);
    setSent(false);
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
          {profile.cvUrl ? (
            <div className="mt-8">
              <Button href={profile.cvUrl} download variant="ghost" icon={DownloadSimple}>
                {cta.cv}
              </Button>
            </div>
          ) : null}
        </div>

        <Reveal className="lg:col-span-6" delay={0.1}>
          {sent ? (
            <m.div
              role="status"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="flex min-h-[26rem] flex-col items-start justify-center rounded-[28px] border border-line bg-bg p-8 md:p-10"
            >
              <CheckCircle size={36} weight="fill" className="text-accent" aria-hidden />
              <h3 className="mt-5 text-2xl font-bold font-stretch-[110%]">Messaggio pronto nella tua posta</h3>
              <p className="mt-3 max-w-[42ch] leading-relaxed text-muted">
                Il tuo programma di posta si è aperto con il testo già compilato. Controlla e premi invia. Se non si è
                aperto, scrivimi direttamente a {profile.email}.
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
              className="grid gap-5 rounded-[28px] border border-line bg-bg p-6 md:p-9"
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
                hint="Azienda, posizione e come preferisci essere ricontattato."
              />
              <div>
                <Button type="submit" icon={ArrowUpRight}>
                  Prepara l'email
                </Button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
