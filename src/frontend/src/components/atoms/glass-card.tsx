"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wrench GlassCard — Double-Bezel (Doppelrand).
 * Outer shell translúcido + inner core sólido. Assinatura Ethereal Glass.
 *
 * Usto: <GlassCard className="..."><div>conteúdo</div></GlassCard>
 * ou com bezel exposto: <GlassCard bezel>...</GlassCard>
 */
export function GlassCard({
  className,
  bezel = true,
  hover = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Aplica o Double-Bezel (outer + inner). Default true. */
  bezel?: boolean;
  /** Habilita hover glass-hover no shell. */
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
      <div className="bezel-inner">{children}</div>
    </div>
  );
}
