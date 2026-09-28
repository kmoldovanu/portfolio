import { ArrowUp } from "@phosphor-icons/react";
import { profile } from "../../content";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex items-center gap-6 text-sm">
          {profile.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#top"
              aria-label="Torna all'inizio"
              className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-surface-2"
            >
              <ArrowUp size={16} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
