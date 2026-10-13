import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { codeFiles, type CodeFile } from "../../content";

type TokenType = "plain" | "key" | "str" | "type" | "dim";
type Token = { type: TokenType; text: string };

const RULES: Record<CodeFile["lang"], RegExp> = {
  python: /(#.*)|("[^"\n]*")|\b(from|import|class|def|return|if|else|None|True|False)\b|\b([A-Z]\w*)\b/g,
  tsx: /(\/\/.*)|("[^"\n]*")|\b(export|function|const|return|import|from)\b|\b([A-Z]\w*)\b/g,
};

/** Evidenziazione minima: commenti, stringhe, parole chiave e tipi. Basta per tre file noti. */
function tokenize({ code, lang }: CodeFile): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(RULES[lang])) {
    if (m.index > last) tokens.push({ type: "plain", text: code.slice(last, m.index) });
    const type: TokenType = m[1] ? "dim" : m[2] ? "str" : m[3] ? "key" : "type";
    tokens.push({ type, text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < code.length) tokens.push({ type: "plain", text: code.slice(last) });
  return tokens;
}

// Calcolati una volta sola al caricamento del modulo.
const files = codeFiles.map((file) => ({ ...file, tokens: tokenize(file), length: file.code.length }));
const maxLines = Math.max(...codeFiles.map((f) => f.code.split("\n").length));
const lastIndex = files.length - 1;

const tokenClass: Record<TokenType, string> = {
  plain: "text-code-fg",
  key: "text-code-key",
  str: "text-code-str",
  type: "text-code-type",
  dim: "text-code-dim italic",
};

const CHARS_PER_TICK = 3;
const TICK_MS = 16;
const START_DELAY_MS = 1100;
const NEXT_FILE_MS = 2600;

/** Mostra solo i primi `count` caratteri, mantenendo i colori dei token. */
function TypedCode({ tokens, count }: { tokens: Token[]; count: number }) {
  const out = [];
  let left = count;
  for (let i = 0; i < tokens.length && left > 0; i++) {
    const { type, text } = tokens[i];
    out.push(
      <span key={i} className={tokenClass[type]}>
        {left >= text.length ? text : text.slice(0, left)}
      </span>,
    );
    left -= text.length;
  }
  return out;
}

/**
 * Editor che scrive da solo tre file: modello, vista e componente.
 * Avanza da solo una volta sola; un clic su una scheda prende il controllo.
 */
export function CodeWindow() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(0);
  const [auto, setAuto] = useState(true);
  const [started, setStarted] = useState(false);

  const file = files[active];
  const shown = reduce ? file.length : typed;
  const done = shown >= file.length;

  // Scrittura: un intervallo per file, fermato quando il testo è completo.
  useEffect(() => {
    if (reduce || done) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(
      () => {
        setStarted(true);
        interval = setInterval(() => setTyped((n) => n + CHARS_PER_TICK), TICK_MS);
      },
      started ? 120 : START_DELAY_MS,
    );
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [reduce, done, active, started]);

  // Avanzamento automatico al file successivo, solo finché l'utente non sceglie una scheda.
  useEffect(() => {
    if (!auto || reduce || !done || active === lastIndex) return;
    const t = setTimeout(() => {
      setActive((a) => a + 1);
      setTyped(0);
    }, NEXT_FILE_MS);
    return () => clearTimeout(t);
  }, [auto, reduce, done, active]);

  const select = (index: number) => {
    setAuto(false);
    if (index === active) return;
    setActive(index);
    setTyped(0);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-code-bg shadow-[0_40px_80px_-40px_var(--shadow)] ring-1 ring-black/10 dark:ring-white/10">
      <div className="flex items-center gap-4 bg-code-bar pl-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </span>
        <div role="tablist" aria-label="File di esempio" className="flex overflow-x-auto">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => select(i)}
              className={`relative min-h-11 whitespace-nowrap px-3.5 font-mono text-[0.8125rem] transition-colors duration-200 ${
                i === active ? "bg-code-bg text-code-fg" : "text-code-dim hover:text-code-fg"
              }`}
            >
              {f.name}
              {i === active ? <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-code-key" /> : null}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only">
        Esempio di codice: un modello Django, una vista che risponde a htmx e un componente React.
      </p>
      <div aria-hidden className="flex overflow-x-auto py-5 font-mono text-[0.8125rem] leading-[1.7]">
        <ol className="select-none pl-4 pr-4 text-right text-code-dim/60" style={{ minHeight: `${maxLines * 1.7}em` }}>
          {file.code.split("\n").map((_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </ol>
        <pre className="pr-6">
          <code>
            <TypedCode tokens={file.tokens} count={shown} />
            {done ? null : <span className="caret ml-px inline-block h-[1.15em] w-[0.55em] translate-y-[0.2em] bg-code-key" />}
          </code>
        </pre>
      </div>

      <p className="flex min-h-11 items-center gap-2 border-t border-white/10 px-4 text-[0.8125rem] text-code-dim" aria-live="polite">
        {done ? (
          <>
            <Check size={14} weight="bold" className="text-code-str" aria-hidden />
            {file.status}
          </>
        ) : (
          `Scrivo ${file.name}`
        )}
      </p>
    </div>
  );
}
