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
  availability: "Aperto a nuove opportunità",
  // TODO: sostituisci con la tua email e i tuoi profili reali.
  email: "ciao@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  // TODO: link al CV in PDF (es. mettilo in /public/cv.pdf e scrivi "/cv.pdf").
  // Se resta vuoto, il pulsante "Scarica il CV" non compare.
  cvUrl: "",
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
  cv: "Scarica il CV",
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
  strengths: "Cosa porto in un team",
  projects: "Progetti",
  contact: "Cerchi uno sviluppatore per il tuo team?",
  contactBody:
    "Sono aperto a posizioni da sviluppatore full-stack o backend. Scrivimi per un colloquio o per ricevere il mio CV.",
};

/* ------------------------------------------------------------------ */
/* Esperienza                                                          */
/* ------------------------------------------------------------------ */

/** Tappe in ordine cronologico. */
export const milestones = [
  { year: "2023", text: "Entro in Datafood: sviluppo full-stack con Python, Django, JavaScript, HTML e CSS." },
  { year: "2024", text: "Porto React nel lavoro quotidiano e seguo anche i server Debian presso i clienti." },
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
};

export const jobs: Job[] = [
  {
    period: "2023 – oggi",
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
      "Strumenti di IA come ChatGPT e Claude per risolvere i problemi più in fretta e migliorare il codice.",
      "Integrazione della stampa con BarTender e NiceLabel e assistenza tecnica ai clienti.",
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
  summary: string;
  stack: string[];
  repo?: string;
  demo?: string;
};

/** Quanti spazi mostrare in tutto: quelli senza progetto diventano "in lavorazione". */
export const projectSlots = 2;

export const projects: Project[] = [
  {
    title: "Questo portfolio",
    summary:
      "Animazioni legate allo scroll con Motion, tema chiaro e scuro, editor di codice che si scrive da solo. Con \"riduci movimento\" attivo tutto resta fermo e leggibile.",
    stack: ["React 19", "TypeScript", "Tailwind CSS 4", "Motion", "Vite"],
    // TODO: link al repository del portfolio.
    repo: "",
  },
  // TODO: aggiungi qui i tuoi progetti. Esempio:
  // {
  //   title: "Nome progetto",
  //   summary: "Cosa fa, in una o due frasi.",
  //   stack: ["Django", "htmx"],
  //   repo: "https://github.com/tuo-utente/progetto",
  //   demo: "https://progetto.example.com",
  // },
];
