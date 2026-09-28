type BrandLogoProps = {
  name: string;
  /** Slug di Simple Icons, es. "django". */
  slug: string;
  className?: string;
};

/**
 * Logo monocromatico da Simple Icons. Il file SVG fa da maschera,
 * quindi il colore arriva dalla classe `bg-*` e segue il tema.
 */
export function BrandLogo({ name, slug, className = "size-10 bg-muted" }: BrandLogoProps) {
  const url = `url(https://cdn.simpleicons.org/${slug})`;
  return (
    <span
      role="img"
      aria-label={name}
      className={`block shrink-0 ${className}`}
      style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" }}
    />
  );
}
