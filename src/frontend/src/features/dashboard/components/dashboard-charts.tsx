"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FaturamentoPonto, OsPorStatus, TopItem } from "../types";
import { brl, compactBrl } from "@/lib/formatters";

/* ─── Tooltip glass custom ─── */
function GlassTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
  formatter?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl glass p-2.5 text-xs shadow-soft-lg">
      {label && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="tabular font-medium text-foreground">
            {formatter && typeof p.value === "number" ? formatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── 1. Área — faturamento peças + M.O por mês ─── */
export function FaturamentoChart({ data }: { data: FaturamentoPonto[] }) {
  const total = data.reduce((s, d) => s + d.pecas + d.maoDeObra, 0);

  return (
    <div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-xs text-muted-foreground">Total 6 meses</span>
        <span className="text-sm font-semibold tabular text-foreground">
          {brl(total)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g-pecas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--wrench-accent)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--wrench-accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-mao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="mes"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => compactBrl(v).replace("R$ ", "")}
            width={42}
          />
          <Tooltip
            content={<GlassTooltip formatter={brl} />}
            cursor={{ stroke: "var(--glass-border-hover)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="pecas"
            name="Peças"
            stroke="var(--wrench-accent)"
            strokeWidth={2}
            fill="url(#g-pecas)"
          />
          <Area
            type="monotone"
            dataKey="maoDeObra"
            name="Mão de obra"
            stroke="var(--chart-4)"
            strokeWidth={2}
            fill="url(#g-mao)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── 2. Barras — OS por status ─── */
const STATUS_COLORS: Record<string, string> = {
  Aberta: "var(--status-info)",
  "Execução": "var(--wrench-accent)",
  Pronta: "var(--status-warn)",
  Faturada: "var(--chart-4)",
  Entregue: "var(--status-ok)",
};

export function OsStatusChart({ data }: { data: OsPorStatus[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="status"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip
          content={<GlassTooltip />}
          cursor={{ fill: "var(--glass-bg-hover)" }}
        />
        <Bar dataKey="quantidade" name="OS" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((d, i) => (
            <Cell key={i} fill={STATUS_COLORS[d.status] ?? "var(--wrench-accent)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── 3. Donut — mix receita peças × M.O (mês atual) ─── */
export function MixReceitaDonut({
  pecas,
  maoDeObra,
}: {
  pecas: number;
  maoDeObra: number;
}) {
  const data = [
    { name: "Peças", value: pecas, fill: "var(--wrench-accent)" },
    { name: "Mão de obra", value: maoDeObra, fill: "var(--chart-4)" },
  ];
  const total = pecas + maoDeObra;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip content={<GlassTooltip formatter={brl} />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Total no centro */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Total
        </span>
        <span className="gradient-text text-lg font-bold tabular">
          {compactBrl(total)}
        </span>
      </div>
    </div>
  );
}

/* ─── 4. Lista horizontal — top itens (peças ou serviços) ─── */
export function TopItensList({ itens }: { itens: TopItem[] }) {
  const max = Math.max(...itens.map((i) => i.receita), 1);

  return (
    <div className="space-y-2.5">
      {itens.map((it, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate text-foreground">{it.nome}</span>
            <span className="shrink-0 tabular font-medium text-foreground">
              {brl(it.receita)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full gradient-brand"
                style={{ width: `${(it.receita / max) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-[10px] tabular text-muted-foreground">
              {it.quantidade}×
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
