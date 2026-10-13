import { profile } from "../../content";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-[0.9375rem] text-muted md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          © {year} {profile.name}, {profile.base}
        </p>
        <a href="#top" className="font-semibold text-fg underline-offset-4 hover:underline">
          Torna all'inizio
        </a>
      </div>
    </footer>
  );
}
