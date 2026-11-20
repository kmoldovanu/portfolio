/**
 * Tutti i contenuti del sito vivono qui.
 * Per aggiornare testi, link, esperienza o progetti modifica solo questo file.
 */

export const profile = {
  name: "Konstantinos Moldovanu",
  initials: "KM",
  role: "Sviluppatore web full-stack",
  base: "Cuneo",
  intro:
    "Sviluppo applicazioni web aziendali con Django, Python e htmx da tre anni, con React da due. Seguo una funzionalità dal modello dati fino all'interfaccia.",
  availability: "Due chiacchiere? Scrivimi",
  // Foto ritagliata su sfondo trasparente: compare nella hero e nella barra in alto.
  photo: "/ritratto.webp",
  email: "moldovanu.business@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/kmoldovanu" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/konstantinos-moldovanu-a306aa389/" },
  ],
  // CV in PDF dentro /public/cv. Il primo è quello principale, l'altro compare come link secondario.
  cv: {
    main: { href: "/cv/Konstantinos-Moldovanu-CV.pdf", label: "Scarica il CV" },
    alt: { href: "/cv/Konstantinos-Moldovanu-CV-EN.pdf", label: "English version", lang: "en" },
  },
};

/** Voci di navigazione: l'id corrisponde all'id della sezione. */
export const nav = [
  { id: "esperienza", label: "Esperienza" },
  { id: "competenze", label: "Competenze" },
  { id: "progetti", label: "Progetti" },
];

/** Un'unica etichetta per ogni intento, usata ovunque nella pagina. */
export const cta = {
  contact: "Contattami",
  experience: "Vedi l'esperienza",
};

/** Le tecnologie della fascia che scorre con la pagina. */
export const techBand = [
  ["Python", "Django", "htmx", "React", "TypeScript"],
  ["JavaScript", "HTML", "CSS", "Linux Debian", "_hyperscript"],
];

/* ------------------------------------------------------------------ */
/* Editor dell'hero: tre file, dal database all'interfaccia            */
/* ------------------------------------------------------------------ */

export type CodeFile = { name: string; lang: "python" | "tsx"; status: string; code: string };

export const codeFiles: CodeFile[] = [
  {
    name: "models.py",
    lang: "python",
    status: "Modello dati pronto, migrazione applicata",
    code: `from django.db import models

class Ordine(models.Model):
    cliente = models.ForeignKey("Cliente", on_delete=models.PROTECT)
    stato = models.CharField(max_length=20, default="nuovo")
    creato = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creato"]`,
  },
  {
    name: "views.py",
    lang: "python",
    status: "Con htmx aggiorna solo le righe della tabella",
    code: `from django.shortcuts import render
from .models import Ordine

def lista_ordini(request):
    ordini = Ordine.objects.select_related("cliente")[:20]
    # htmx chiede solo il frammento, il browser il resto
    template = "ordini/_righe.html" if request.htmx else "ordini/lista.html"
    return render(request, template, {"ordini": ordini})`,
  },
  {
    name: "Ordini.tsx",
    lang: "tsx",
    status: "Interfaccia React con filtro immediato",
    code: `export function Ordini({ ordini }: { ordini: Ordine[] }) {
  const [filtro, setFiltro] = useState("");
  // Valore derivato durante il render, niente effetti
  const visibili = ordini.filter((o) => o.cliente.includes(filtro));

  return <Tabella righe={visibili} onCerca={setFiltro} />;
}`,
  },
];

/** Titoli e testi brevi delle sezioni. */
export const headings = {
  experience: "Dal 2023 in Datafood",
  skills: "Dal database all'interfaccia",
  skillsBody:
    "Scelgo lo strumento in base al problema. A volte serve un'interfaccia in React, altre volte bastano Django, un po' di HTML e qualche attributo htmx.",
  strengths: "Come lavoro",
  projects: "Progetti",
  contact: "Parliamo di codice, progetti o idee",
  contactBody:
    "Stai costruendo un prodotto web, cerchi qualcuno con cui confrontarti o vuoi solo dirmi cosa ne pensi del sito? Scrivimi: ti rispondo io, direttamente.",
};

/* ------------------------------------------------------------------ */
/* Esperienza                                                          */
/* ------------------------------------------------------------------ */

/** Tappe in ordine cronologico. */
export const milestones = [
  { year: "2023", text: "Entro in Datafood come tirocinante: sviluppo full-stack con Python, Django, JavaScript, HTML e CSS." },
  { year: "2024", text: "Inizio l'apprendistato, porto React nel lavoro quotidiano e seguo i server Debian presso i clienti." },
  { year: "Oggi", text: "3 applicazioni in produzione e circa 10 clienti seguiti direttamente, dal back-end all'interfaccia." },
];

export type Job = {
  period: string;
  current: boolean;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
};

export const jobs: Job[] = [
  {
    period: "2023 – oggi",
    current: true,
    role: "Sviluppatore web full-stack",
    company: "Datafood Srl",
    location: "Cuneo",
    summary:
      "Sviluppo e manutenzione di applicazioni web aziendali: nuove funzionalità, risoluzione di bug e ottimizzazione delle performance. Prima in tirocinio, dal 2024 in apprendistato.",
    highlights: [
      "3 applicazioni in produzione, 2 in Django e 1 in React: back-end in Python e Django, front-end in React, htmx, JavaScript, HTML e CSS.",
      "Referente tecnico diretto per circa 10 clienti: configurazione dei server Debian e deploy delle applicazioni nelle loro sedi.",
      "Collaborazione con il team di progettazione su interfaccia ed esperienza utente.",
      "Claude e ChatGPT per accelerare sviluppo e debug, con revisione di tutto il codice prodotto.",
      "Modelli di stampa etichette con BarTender e NiceLabel collegati a origini dati, con assistenza tecnica ai clienti.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Competenze                                                          */
/* ------------------------------------------------------------------ */

/** Anni massimi sulla scala delle competenze. */
export const yearsScale = 3;

export const skillAreas = [
  {
    title: "Backend",
    years: 3,
    body: "Modelli dati, viste, API e pannelli di amministrazione.",
    tools: ["Django", "Python"],
  },
  {
    title: "Frontend",
    years: 2,
    body: "Interfacce reattive in React, con componenti pensati per essere riusati.",
    tools: ["React", "TypeScript", "JavaScript"],
  },
  {
    title: "Hypermedia",
    years: 3,
    body: "Interattività lato server con htmx e _hyperscript, senza il peso di una SPA.",
    tools: ["htmx", "_hyperscript"],
  },
  {
    title: "Fondamenta",
    years: 3,
    body: "HTML semantico e CSS moderno: accessibilità e performance partono da qui.",
    tools: ["HTML", "CSS"],
  },
  {
    title: "Server",
    years: 3,
    body: "Configurazione e deploy di server Debian presso i clienti.",
    tools: ["Linux Debian"],
  },
];

export const strengths = [
  {
    title: "Dal modello al template",
    body: "Seguo una funzionalità per intero: modelli Django, viste, template e interazioni con htmx o React.",
  },
  {
    title: "Attenzione a chi lo usa",
    body: "Curo esperienza utente, performance e qualità del codice, non solo il fatto che funzioni.",
  },
  {
    title: "L'IA come strumento",
    body: "Uso ChatGPT, Claude e altri strumenti per lavorare più in fretta, ma le scelte tecniche restano mie.",
  },
];

/* ------------------------------------------------------------------ */
/* Progetti                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  title: string;
  /** Una riga sopra il titolo: che tipo di progetto è. */
  kind: string;
  summary: string;
  stack: string[];
  repo?: string;
  demo?: string;
  /** Prima schermata del progetto, in /public/progetti. */
  image?: { src: string; alt: string; width: number; height: number };
  /** In evidenza: occupa tutta la riga, con l'immagine a destra in una cornice da telefono. */
  featured?: boolean;
};

/** Quanti spazi mostrare in tutto: quelli senza progetto diventano "in lavorazione". */
export const projectSlots = 3;

export const projects: Project[] = [
  {
    title: "JobRadar",
    kind: "Web app con IA",
    summary:
      "Cerca lavoro su sette fonti ufficiali in parallelo, scarta duplicati, truffe e annunci fuori portata, poi dà un punteggio a ogni offerta con Claude. Prepara CV e lettera su misura nella lingua dell'annuncio, con un controllo in codice che toglie tutto ciò che non è nel CV originale. Tracker delle candidature con promemoria, installabile sul telefono.",
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Drizzle", "Claude API", "Zod", "Vitest", "PWA"],
    repo: "https://github.com/kmoldovanu/job-radar",
    demo: "https://job-radar-km.vercel.app/demo",
    image: {
      src: "/progetti/jobradar.webp",
      alt: "JobRadar sul telefono: elenco delle offerte da vedere, con il punteggio AI di compatibilità",
      width: 585,
      height: 996,
    },
    featured: true,
  },
  {
    title: "dinomoldo.dev",
    kind: "Sito per l'attività freelance",
    summary:
      "Sito vetrina one-page per la mia attività di sviluppo web. Frontend React con componenti shadcn/ui, backend Django REST che riceve le richieste dal form di contatto, le salva e le inoltra per email.",
    stack: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Django REST", "Resend"],
    repo: "https://github.com/kmoldovanu/dinomoldo-dev",
    demo: "https://dinomoldo-dev.vercel.app",
    image: {
      src: "/progetti/dinomoldo.webp",
      alt: "Prima schermata di dinomoldo.dev: soluzioni web professionali per attività locali",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Questo portfolio",
    kind: "Sito personale",
    summary:
      "Animazioni legate allo scroll con Motion, tema chiaro e scuro, griglia interattiva ed editor di codice che si scrive da solo. Con \"riduci movimento\" attivo tutto resta fermo e leggibile.",
    stack: ["React 19", "TypeScript", "Tailwind CSS 4", "Motion", "Vite"],
    repo: "https://github.com/kmoldovanu/portfolio",
    image: {
      src: "/progetti/portfolio.webp",
      alt: "Prima schermata di questo portfolio in tema scuro, con il nome in grande e l'editor di codice",
      width: 1200,
      height: 750,
    },
  },
];
