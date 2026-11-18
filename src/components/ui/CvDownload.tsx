import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { profile } from "../../content";
import { Button } from "./Button";

/** Pulsante per il CV principale e, accanto, il link discreto alla versione in inglese. */
export function CvDownload() {
  const { main, alt } = profile.cv;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <Button href={main.href} download variant="ghost" icon={DownloadSimple}>
        {main.label}
      </Button>
      <a
        href={alt.href}
        download
        hrefLang={alt.lang}
        lang={alt.lang}
        className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-muted underline underline-offset-4 transition-colors duration-200 hover:text-accent"
      >
        {alt.label}
      </a>
    </div>
  );
}
