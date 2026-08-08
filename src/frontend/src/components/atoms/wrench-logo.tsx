"use client";

import { cn } from "@/lib/utils";

/**
 * Wrench logo — marca símbolo.
 * Hexágono (chip/porca) com W interna em gradient ciano. Sem dependência
 * de arquivo externo: SVG inline, escala via prop `size`.
 */
export function WrenchLogo({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-label="Wrench"
      role="img"
    >
      <defs>
        <linearGradient id="wrench-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--wrench-gradient-from)" />
          <stop offset="100%" stopColor="var(--wrench-gradient-to)" />
        </linearGradient>
      </defs>
      {/* Hexágono (porca/chip) */}
      <path
        d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
        fill="url(#wrench-grad)"
        opacity="0.18"
      />
      <path
        d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
        stroke="url(#wrench-grad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* W estilizada */}
      <path
        d="M9 12 L12 21 L16 14 L20 21 L23 12"
        stroke="url(#wrench-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Logo + wordmark para headers. */
export function WrenchWordmark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <WrenchLogo size={size} />
      <span className="text-sm font-semibold tracking-tight text-foreground">
        Wrench
      </span>
    </span>
  );
}
