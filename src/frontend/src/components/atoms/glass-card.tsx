"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wrench GlassCard — card de conteúdo.
 *
 * Padrão: card simples com UMA borda (clean, sem duplo contorno).
 * `bezel` (opcional): Double-Bezel para casos de destaque (login, hero) —
 * outer shell translúcido + inner core. Evitar em listagens/dashboards
 * (a borda dupla pesa a leitura).
 */
export function GlassCard({
  className,
  bezel = false,
  hover = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Aplica o Double-Bezel (outer + inner). Default false (card simples). */
  bezel?: boolean;
  /** Habilita hover glass-hover. */
  hover?: boolean;
}) {
  if (!bezel) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-line bg-card shadow-soft-md",
          hover && "transition-colors hover:border-[var(--glass-border-hover)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bezel shadow-soft-md",
        hover && "glass-hover",
        className,
      )}
      {...props}
    >
      <div className="bezel-inner p-5">{children}</div>
    </div>
  );
}
