/**
 * Wrench — Motion presets (Ethereal Glass).
 *
 * Princípio (skill high-end-visual-design): toda animação usa spring physics
 * ou cubic-bezier custom. NUNCA ease-in-out linear. Animar só transform/opacity.
 *
 * cubic-bezier Ethereal: [0.32, 0.72, 0, 1] — saída suave, parada precisa.
 */

/** Spring padrão — equilíbrio entre resposta e suavidade. */
export const SPRING = { type: "spring", stiffness: 340, damping: 30 } as const;
/** Hover de tabs/pills — mais rápido e firme. */
export const SPRING_HOVER = { type: "spring", stiffness: 420, damping: 32 } as const;
/** Press de botões — seco e imediato. */
export const SPRING_PRESS = { type: "spring", stiffness: 600, damping: 38 } as const;
/** Transição de página — mais lenta e fluida. */
export const SPRING_PAGE = { type: "spring", stiffness: 300, damping: 30 } as const;
/** Drawers/modals — leve e envolvente. */
export const SPRING_DRAWER = { type: "spring", stiffness: 380, damping: 36 } as const;

/** Curva Ethereal para entradas de scroll-reveal. */
export const EASE_GLASS = [0.32, 0.72, 0, 1] as const;

/** Stagger base por item (segundos). */
export const STAGGER = 0.04;

/* ─── Factories de variants ─────────────────────────────────────────────── */

/** Fade-up para entradas de seção (translate-y + opacity). */
export function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.56, ease: EASE_GLASS, delay },
  } as const;
}

/** Fade-in puro (opacity). */
export function fadeIn(delay = 0) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.46, ease: EASE_GLASS, delay },
  } as const;
}

/** Slide-in da direita (drawers). */
export function slideInRight(delay = 0) {
  return {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: EASE_GLASS, delay },
  } as const;
}

/** Delay de stagger com cap (evita cadeias longas demais). */
export function staggerDelay(index: number, cap = 12) {
  return Math.min(index, cap) * STAGGER;
}

/** Entrada de linha de tabela/lista (slide-x leve + fade). */
export function fadeUpRow(index: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: EASE_GLASS, delay: staggerDelay(index) },
  } as const;
}

/** Entrada de card em grid — canonical para dashboards (y maior + stagger por index). */
export function fadeUpCard(index: number, baseDelay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASE_GLASS, delay: baseDelay + staggerDelay(index) },
  } as const;
}
