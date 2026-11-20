/**
 * Avvisi sui download del CV (vedi api/cv-download.ts).
 *
 * Al primo caricamento si salvano la provenienza (document.referrer) e l'eventuale ?da=... del link,
 * così restano corretti anche dopo la navigazione interna alla pagina.
 */

const KEY = "km-visit";

type Visit = { from: string; tag: string };

function readVisit(): Visit {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Visit;
  } catch {
    // sessionStorage non disponibile (navigazione privata, permessi): si usa il valore corrente
  }
  let own = false;
  try {
    own = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin;
  } catch {
    // referrer non valido: lo trattiamo come esterno
  }
  const visit = {
    from: own ? "" : document.referrer,
    tag: new URLSearchParams(location.search).get("da")?.slice(0, 60) ?? "",
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(visit));
  } catch {
    // vedi sopra
  }
  return visit;
}

/** Da chiamare all'avvio, prima che l'utente navighi tra le sezioni. */
export function rememberVisit() {
  readVisit();
}

/** Segnala il download senza ritardarlo: sendBeacon parte anche mentre il browser apre il file. */
export function trackCvDownload(lang: "it" | "en") {
  try {
    const body = JSON.stringify({ lang, ...readVisit() });
    navigator.sendBeacon?.("/api/cv-download", new Blob([body], { type: "application/json" }));
  } catch {
    // il tracciamento non deve mai bloccare il download
  }
}
