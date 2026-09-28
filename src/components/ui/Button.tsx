import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ComponentType, MouseEvent, ReactNode } from "react";
import { spring } from "../../lib/motion";

type IconType = ComponentType<{ size?: number; weight?: "regular" | "bold" }>;

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
  icon?: IconType;
  magnetic?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  ghost: "border border-line text-fg hover:border-fg/40 hover:bg-surface",
};

/**
 * Pulsante pill. Diventa un link se riceve `href`.
 * Con `magnetic` segue leggermente il cursore (motion values, nessun re-render).
 */
export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  icon: Icon,
  magnetic = false,
  disabled,
  onClick,
  className = "",
}: ButtonProps) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (!magnetic || reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = `group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3.5 text-sm font-medium transition-[background-color,border-color,filter] duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      {Icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          <Icon size={16} weight="bold" />
        </span>
      )}
    </>
  );

  const shared = { className: classes, style: { x, y }, onMouseMove: handleMove, onMouseLeave: reset };

  return href ? (
    <motion.a href={href} {...shared}>
      {content}
    </motion.a>
  ) : (
    <motion.button type={type} disabled={disabled} onClick={onClick} {...shared}>
      {content}
    </motion.button>
  );
}
