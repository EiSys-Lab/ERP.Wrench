"use client";

import { motion } from "motion/react";
import { Wallet, ClipboardList, Package, TrendingUp, Percent, Calendar } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { KpiCard } from "@/components/molecules/kpi-card";
import { KPI_RELATORIO_MOCK, FATURAMENTO_MENSAL_MOCK } from "../mock";
import { brl, num, pct } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/** Wrench KpisView — KPIs anuais + gráfico de evolução. */
export function KpisView() {
  const k = KPI_RELATORIO_MOCK;
  const data = FATURAMENTO_MENSAL_MOCK.map((m) => ({
    mes: m.mes,
    total: m.pecas + m.maoDeObra,
  }));

  return (
    <>
      <PageHeader title="KPIs" subtitle="Indicadores anuais da oficina" />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard index={0} label="Faturamento (ano)" value={k.faturamentoAno} format={brl} icon={Wallet} glow />
        <KpiCard index={1} label="OS (ano)" value={k.osAno} format={num} icon={ClipboardList} />
        <KpiCard index={2} label="Ticket médio" value={k.ticketMedio} format={brl} icon={TrendingUp} />
        <KpiCard index={3} label="Peças vendidas" value={k.pecasVendidas} format={num} icon={Package} />
        <KpiCard index={4} label="Margem média" value={k.margemMedia} format={(v) => pct(v, 0)} icon={Percent} status="ok" />
        <KpiCard index={5} label="Faturamento mês" value={k.faturamentoMes} format={brl} icon={Calendar} />
      </div>

      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Evolução do faturamento (8 meses)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g-rel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--wrench-accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--wrench-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line-2)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={44} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => brl(Number(v))}
              />
              <Area type="monotone" dataKey="total" name="Total" stroke="var(--wrench-accent)" strokeWidth={2.5} fill="url(#g-rel)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>
    </>
  );
}
