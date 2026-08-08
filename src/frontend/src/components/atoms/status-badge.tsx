"use client";

import { cn } from "@/lib/utils";

/**
 * Wrench StatusBadge — badge semântico com tom fixo (não segue marca).
 * Paleta canônica de status para todo o ERP.
 */
export type StatusTone = "ok" | "warn" | "alert" | "info" | "muted";

export const STATUS_TONE: Record<StatusTone, { color: string; bg: string }> = {
  ok: {
    color: "var(--status-ok)",
    bg: "color-mix(in oklch, var(--status-ok) 14%, transparent)",
  },
  warn: {
    color: "var(--status-warn)",
    bg: "color-mix(in oklch, var(--status-warn) 14%, transparent)",
  },
  alert: {
    color: "var(--status-alert)",
    bg: "color-mix(in oklch, var(--status-alert) 14%, transparent)",
  },
  info: {
    color: "var(--status-info)",
    bg: "color-mix(in oklch, var(--status-info) 14%, transparent)",
  },
  muted: {
    color: "var(--muted-foreground)",
    bg: "var(--muted)",
  },
};

export function StatusBadge({
  tone = "info",
  size = "md",
  dot = false,
  className,
  children,
}: {
  tone?: StatusTone;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const t = STATUS_TONE[tone];
  const sizeClass =
    size === "sm"
      ? "px-1.5 py-0.5 text-[9px]"
      : size === "lg"
        ? "px-2.5 py-1 text-[11px]"
        : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide",
        sizeClass,
        className,
      )}
      style={{ background: t.bg, color: t.color }}
    >
      {dot && (
        <span
          className="size-1.5 rounded-full"
          style={{ background: t.color }}
        />
      )}
      {children}
    </span>
  );
}
