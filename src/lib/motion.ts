/** Curve condivise: decelerazione per ciò che entra, così il movimento è coerente in tutta la pagina. */
export const easeOut = [0.16, 1, 0.3, 1] as const;

export const spring = { stiffness: 140, damping: 26, mass: 0.4 } as const;
