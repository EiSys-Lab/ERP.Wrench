"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUpCard } from "@/lib/motion";
import { StatusBadge, type StatusTone } from "@/components/atoms/status-badge";

/**
 * Wrench KpiCard — card de KPI animado.
 * Anima o número de 0 ao alvo via requestAnimationFrame (ease-out cúbico).
 * Glow ciano sutil no valor quando tone=default. Sparkline opcional.
 */
export function KpiCard({
  label,
  value,
  format = (v: number) => String(v),
  icon: Icon,
  delta,
  direction,
  hint,
  status,
  statusLabel,
  sparkData,
  sparkColor = "var(--wrench-accent)",
  index = 0,
  glow = false,
  className,
}: {
  label: string;
  value: number;
  /** Formata o valor para exibição (brl, num, etc). */
  format?: (v: number) => string;
  icon?: LucideIcon;
  /** Delta percentual/categoria: "+12%", "-3%". */
  delta?: string;
  direction?: "up" | "down";
  hint?: string;
  status?: StatusTone;
  statusLabel?: string;
  sparkData?: number[];
  sparkColor?: string;
  index?: number;
  /** Aplica glow ciano no valor (destaque). */
  glow?: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Animação do número: 0 → value em ~900ms ease-out.
  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cúbico
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const deltaTone: StatusTone =
    direction === "up" ? "ok" : direction === "down" ? "alert" : "muted";

  return (
    <motion.div
      {...fadeUpCard(index)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-card p-4 shadow-soft-md transition-all hover:-translate-y-0.5 hover:shadow-soft-lg",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--wrench-accent-soft)]">
              <Icon size={13} className="text-[var(--wrench-accent)]" />
            </span>
          )}
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        {status && statusLabel && (
          <StatusBadge tone={status} size="sm">
            {statusLabel}
          </StatusBadge>
        )}
      </div>

      {/* Valor principal */}
      <p
        className={cn(
          "text-2xl font-bold tabular text-foreground",
          glow && "gradient-text",
        )}
      >
        {format(display)}
      </p>

      {/* Delta + hint */}
      {(delta || hint) && (
        <div className="mt-2 flex items-center gap-3 text-[11px]">
          {delta && (
            <span
              className={cn(
                "tabular font-semibold",
                direction === "up" && "delta-up",
                direction === "down" && "delta-down",
                !direction && "text-muted-foreground",
              )}
            >
              {delta}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}

      {/* Sparkline opcional */}
      {sparkData && sparkData.length > 1 && (
        <Sparkline data={sparkData} color={sparkColor} />
      )}
    </motion.div>
  );
}

/* ─── Sparkline SVG inline (sem Recharts p/ KPIs leves) ─────────────────── */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 100;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const id = `spark-${Math.random().toString(36).slice(2, 9)}`;

  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-7 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
