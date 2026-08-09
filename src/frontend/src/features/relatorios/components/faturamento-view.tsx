"use client";

import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { FATURAMENTO_MENSAL_MOCK, FATURAMENTO_POR_CLIENTE_MOCK } from "../mock";
import { brl, compactBrl } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";

/**
 * Wrench FaturamentoView — faturamento por mês (peças vs M.O) + top clientes.
 */
export function FaturamentoView() {
  const topClientes = [...FATURAMENTO_POR_CLIENTE_MOCK].sort(
    (a, b) => b.receita - a.receita,
  );
  const maxCliente = topClientes[0]?.receita ?? 1;

  return (
    <>
      <PageHeader title="Faturamento" subtitle="Análise de receita por mês e cliente" />

      {/* Gráfico barras peças vs M.O */}
      <motion.div {...fadeUp(0)}>
        <GlassCard className="mb-4 p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Faturamento mensal — peças vs mão de obra
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={FATURAMENTO_MENSAL_MOCK} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line-2)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => compactBrl(v).replace("R$ ", "")} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => brl(Number(v))}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="pecas" name="Peças" fill="var(--wrench-accent)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="maoDeObra" name="Mão de obra" fill="var(--chart-4)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Ranking de clientes */}
      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp size={14} className="text-[var(--wrench-accent)]" />
            Faturamento por cliente (mês)
          </h2>
          <div className="space-y-3">
            {topClientes.map((c, i) => (
              <div key={c.cliente}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[var(--wrench-accent-soft)] text-[10px] font-bold tabular text-[var(--wrench-accent)]">
                      {i + 1}
                    </span>
                    {c.cliente}
                  </span>
                  <span className="tabular font-semibold text-foreground">{brl(c.receita)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full gradient-brand"
                      style={{ width: `${(c.receita / maxCliente) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-[10px] tabular text-muted-foreground">
                    {c.os} OS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}
