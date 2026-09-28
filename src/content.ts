/**
 * Tutti i contenuti del sito vivono qui.
 * Per aggiornare testi, link, esperienza o progetti modifica solo questo file.
 */

export const profile = {
  name: "Konstantinos Moldovanu",
  initials: "KM",
  role: "Sviluppatore web full-stack",
  intro:
    "Sviluppo applicazioni web con Django, Python e htmx da tre anni, con React da due. Aperto a nuove opportunità.",
  // TODO: sostituisci con la tua email e i tuoi profili reali.
  email: "ciao@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  // TODO: link al CV in PDF (es. mettilo in /public/cv.pdf e scrivi "/cv.pdf").
  // Se resta vuoto, il pulsante "Scarica il CV" non compare.
  cvUrl: "",
  // TODO: sostituisci con una tua foto (es. /public/ritratto.jpg).
  heroImage: "https://picsum.photos/id/180/1000/1250",
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
  experience: "Vedi esperienza",
  cv: "Scarica il CV",
};

/** Loghi per la fascia animata (slug di Simple Icons). */
export const logos = [
  { name: "React", slug: "react" },
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Django", slug: "django" },
  { name: "Python", slug: "python" },
  { name: "htmx", slug: "htmx" },
  { name: "HTML5", slug: "html5" },
  { name: "CSS", slug: "css" },
  { name: "Debian", slug: "debian" },
];

/** Titoli e testi brevi delle sezioni. */
export const headings = {
  experience: "Dal 2023 in Datafood.",
  skillsEyebrow: "Competenze",
  skills: "Dal database all'interfaccia.",
  projects: "Progetti personali",
  strengths: "Cosa porto in un team.",
  contact: "Cerchi uno sviluppatore per il tuo team?",
  contactBody:
    "Sono aperto a posizioni da sviluppatore full-stack o backend. Scrivimi per un colloquio o per ricevere il mio CV.",
};

export const statement =
  "Scelgo lo strumento in base al problema. A volte serve un'interfaccia in React, altre volte bastano Django, un po' di HTML e qualche attributo htmx. Mi interessa che il risultato funzioni e resti facile da mantenere.";

/* ------------------------------------------------------------------ */
/* Esperienza                                                          */
/* ------------------------------------------------------------------ */

/** Tappe mostrate sulla linea del tempo. */
export const milestones = [
  { year: "2023", text: "Entro in Datafood: sviluppo full-stack con Python, Django, JavaScript, HTML e CSS." },
  { year: "2024", text: "Porto React nel lavoro quotidiano e seguo anche server Debian e stampa industriale presso i clienti." },
  { year: "Oggi", text: "Sviluppo applicazioni web aziendali dal back-end all'interfaccia, con l'IA come supporto al lavoro." },
];

export type Job = {
  period: string;
  current: boolean;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const jobs: Job[] = [
  {
    period: "2023 - oggi",
    current: true,
    role: "Sviluppatore web full-stack",
    company: "Datafood Srl",
    location: "Cuneo",
    summary:
      "Sviluppo e manutenzione di applicazioni web aziendali: nuove funzionalità, risoluzione di bug e ottimizzazione delle performance.",
    highlights: [
      "Back-end in Python e Django, front-end in React, htmx, JavaScript, HTML e CSS.",
      "Collaborazione con il team di progettazione per un'esperienza utente coerente.",
      "Configurazione e deploy di server Debian per usare le applicazioni direttamente presso i clienti.",
      "Modelli di stampa BarTender e NiceLabel collegati a origini dati, con assistenza tecnica ai clienti.",
      "Strumenti di IA come ChatGPT e Claude per risolvere i problemi più in fretta e migliorare il codice.",
    ],
    stack: ["Python", "Django", "React", "htmx", "JavaScript", "HTML", "CSS", "Linux Debian", "BarTender", "NiceLabel"],
  },
];

/* ------------------------------------------------------------------ */
/* Competenze                                                          */
/* ------------------------------------------------------------------ */

export const skillAreas = [
  {
    id: "backend",
    title: "Backend",
    years: 3,
    yearsLabel: "con Django e Python",
    body: "Modelli dati, viste, API e pannelli di amministrazione.",
    tools: ["Django", "Python"],
  },
  {
    id: "frontend",
    title: "Frontend",
    years: 2,
    yearsLabel: "con React",
    body: "Interfacce reattive in React, con componenti pensati per essere riusati.",
    tools: ["React", "TypeScript", "JavaScript"],
  },
  {
    id: "hypermedia",
    title: "Hypermedia",
    years: 3,
    yearsLabel: "con htmx",
    body: "Interattività lato server con htmx e _hyperscript, senza il peso di una SPA.",
    tools: ["htmx", "_hyperscript"],
  },
  {
    id: "basi",
    title: "Fondamenta",
    years: 3,
    yearsLabel: "con HTML e CSS",
    body: "HTML semantico e CSS moderno: accessibilità e performance partono da qui.",
    tools: ["HTML", "CSS"],
  },
  {
    id: "server",
    title: "Server e stampa",
    years: 3,
    yearsLabel: "con Linux",
    body: "Server Debian presso i clienti ed etichette industriali collegate ai dati.",
    tools: ["Debian", "BarTender", "NiceLabel"],
  },
];

/* ------------------------------------------------------------------ */
/* Progetti                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  title: string;
  summary: string;
  stack: string[];
  image: string;
  repo?: string;
  demo?: string;
};

/** Quanti spazi mostrare: quelli senza progetto diventano "in arrivo". */
export const projectSlots = 2;

// TODO: aggiungi qui i tuoi progetti. Esempio:
// {
//   title: "Nome progetto",
//   summary: "Cosa fa, in una o due frasi.",
//   stack: ["Django", "htmx"],
//   image: "/progetto-1.jpg",
//   repo: "https://github.com/tuo-utente/progetto",
//   demo: "https://progetto.example.com",
// },
export const projects: Project[] = [];

/* ------------------------------------------------------------------ */
/* Cosa porto in un team                                               */
/* ------------------------------------------------------------------ */

export const strengths = [
  {
    title: "Dal modello al template",
    body: "Posso seguire una funzionalità per intero: modelli Django, viste, template e interazioni con htmx o React.",
    image: "https://picsum.photos/id/0/1400/900",
  },
  {
    title: "Attenzione a chi lo usa",
    body: "Curo esperienza utente, performance e qualità del codice, non solo il fatto che funzioni.",
    image: "https://picsum.photos/id/201/1400/900",
  },
  {
    title: "L'IA come strumento",
    body: "Uso ChatGPT, Claude e altri strumenti per lavorare più in fretta, ma le scelte tecniche restano mie.",
    image: "https://picsum.photos/id/192/1400/900",
  },
];
