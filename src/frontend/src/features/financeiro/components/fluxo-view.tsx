"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { KpiCard } from "@/components/molecules/kpi-card";
import { FLUXO_MOCK } from "../mock";
import { brl, compactBrl } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";

/** Calcula saldo acumulado dia a dia. */
function withSaldo(
  fluxo: { dia: string; entradas: number; saidas: number }[],
) {
  let acc = 0;
  return fluxo.map((p) => {
    acc += p.entradas - p.saidas;
    return { ...p, saldo: acc };
  });
}

/**
 * Wrench FluxoView — fluxo de caixa com gráfico ComposedChart
 * (barras entradas/saídas + linha de saldo acumulado).
 */
export function FluxoView() {
  const data = useMemo(() => withSaldo(FLUXO_MOCK), []);

  const totalEntradas = FLUXO_MOCK.reduce((s, p) => s + p.entradas, 0);
  const totalSaidas = FLUXO_MOCK.reduce((s, p) => s + p.saidas, 0);
  const saldoAtual = totalEntradas - totalSaidas;

  return (
    <>
      <PageHeader
        title="Fluxo de Caixa"
        subtitle="Últimos 15 dias"
      />

      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          index={0}
          label="Saldo atual"
          value={saldoAtual}
          format={brl}
          icon={Wallet}
          glow
          status={saldoAtual >= 0 ? "ok" : "alert"}
          statusLabel={saldoAtual >= 0 ? "Positivo" : "Negativo"}
        />
        <KpiCard
          index={1}
          label="Entradas (15d)"
          value={totalEntradas}
          format={brl}
          icon={TrendingUp}
          hint={`média ${brl(totalEntradas / 15)}/dia`}
        />
        <KpiCard
          index={2}
          label="Saídas (15d)"
          value={totalSaidas}
          format={brl}
          icon={TrendingDown}
          status="warn"
          hint={`média ${brl(totalSaidas / 15)}/dia`}
        />
        <KpiCard
          index={3}
          label="Resultado"
          value={saldoAtual}
          format={brl}
          icon={PiggyBank}
          delta={totalEntradas > 0 ? `${((saldoAtual / totalEntradas) * 100).toFixed(0)}%` : undefined}
          direction={saldoAtual >= 0 ? "up" : "down"}
        />
      </div>

      {/* Gráfico ComposedChart */}
      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Movimentação diária + saldo acumulado
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line-2)" vertical={false} />
              <XAxis
                dataKey="dia"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => compactBrl(v).replace("R$ ", "")}
                width={44}
              />
              <Tooltip
                content={<FluxoTooltip />}
                cursor={{ fill: "var(--glass-bg-hover)" }}
              />
              <Bar
                dataKey="entradas"
                name="Entradas"
                fill="var(--status-ok)"
                radius={[4, 4, 0, 0]}
                maxBarSize={16}
              />
              <Bar
                dataKey="saidas"
                name="Saídas"
                fill="var(--status-alert)"
                radius={[4, 4, 0, 0]}
                maxBarSize={16}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                name="Saldo"
                stroke="var(--wrench-accent)"
                strokeWidth={2.5}
                dot={{ fill: "var(--wrench-accent)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legenda */}
          <div className="mt-3 flex items-center justify-center gap-5 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: "var(--status-ok)" }} />
              Entradas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: "var(--status-alert)" }} />
              Saídas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: "var(--wrench-accent)" }} />
              Saldo acumulado
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}

function FluxoTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl glass p-2.5 text-xs shadow-soft-lg">
      {label && <p className="mb-1.5 font-semibold text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="tabular font-medium text-foreground">{brl(p.value ?? 0)}</span>
        </div>
      ))}
    </div>
  );
}
