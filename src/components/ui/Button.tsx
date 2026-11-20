import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; weight?: "regular" | "bold"; "aria-hidden"?: boolean }>;

type ButtonProps = {
  children: ReactNode;
  href?: string;
  download?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
  /** Icona a destra del testo: si sposta leggermente al passaggio del mouse. */
  icon?: IconType;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  ghost: "border border-line text-fg hover:border-fg/40 hover:bg-surface",
};

/** Pulsante pill. Diventa un link se riceve `href`. */
export function Button({
  children,
  href,
  download,
  type = "button",
  variant = "primary",
  icon: Icon,
  disabled,
  onClick,
  className = "",
}: ButtonProps) {
  const classes = `group inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3 text-[0.9375rem] font-semibold transition-[background-color,border-color,filter,transform] duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {Icon ? (
        <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <Icon size={17} weight="bold" aria-hidden />
        </span>
      ) : null}
    </>
  );

  return href ? (
    <a href={href} download={download} onClick={onClick} className={classes}>
      {content}
    </a>
  ) : (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
