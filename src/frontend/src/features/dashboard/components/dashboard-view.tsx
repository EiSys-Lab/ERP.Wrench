"use client";

import { motion } from "motion/react";
import {
  Wallet,
  ClipboardList,
  Package,
  Wrench,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { KpiCard } from "@/components/molecules/kpi-card";
import { KpiGridSkeleton, ChartSkeleton } from "@/components/molecules/skeletons";
import { DASHBOARD_MOCK } from "../mock";
import {
  FaturamentoChart,
  OsStatusChart,
  MixReceitaDonut,
  TopItensList,
} from "./dashboard-charts";
import { brl, pct } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";
import { useLoadingDelay } from "@/lib/use-loading-delay";

/**
 * Wrench Dashboard — visão geral da oficina.
 * KPIs animados + 3 gráficos Recharts + top peças/serviços.
 */
export function DashboardView() {
  const loading = useLoadingDelay();
  const { kpis, faturamento, osPorStatus, topPecas, topServicos } = DASHBOARD_MOCK;

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Visão geral da oficina" />
        <KpiGridSkeleton count={4} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartSkeleton height={220} />
          <ChartSkeleton height={220} />
        </div>
      </>
    );
  }

  const deltaFaturamento =
    (kpis.faturamentoMes - kpis.faturamentoAnterior) / kpis.faturamentoAnterior;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da oficina"
      />

      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          index={0}
          label="Faturamento mês"
          value={kpis.faturamentoMes}
          format={brl}
          icon={Wallet}
          delta={pct(deltaFaturamento, 1)}
          direction={deltaFaturamento >= 0 ? "up" : "down"}
          hint="vs mês anterior"
          glow
        />
        <KpiCard
          index={1}
          label="OS em aberto"
          value={kpis.osAbertas}
          icon={ClipboardList}
          status="warn"
          statusLabel="Atenção"
        />
        <KpiCard
          index={2}
          label="OS concluídas"
          value={kpis.osConcluidasMes}
          icon={CheckCircle2}
          hint="no mês"
        />
        <KpiCard
          index={3}
          label="Ticket médio"
          value={kpis.ticketMedio}
          format={brl}
          icon={Wallet}
          hint="por OS"
        />
      </div>

      {/* Segunda fila de KPIs menores */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          index={0}
          label="Peças em estoque"
          value={kpis.pecasEstoque}
          icon={Package}
          hint="itens"
        />
        <KpiCard
          index={1}
          label="Abaixo do mínimo"
          value={kpis.pecasAbaixoMinimo}
          icon={AlertTriangle}
          status="alert"
          statusLabel="Repor"
        />
        <KpiCard
          index={2}
          label="Mão de obra mês"
          value={kpis.maoDeObraMes}
          format={brl}
          icon={Wrench}
        />
      </div>

      {/* Gráficos — grid principal */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Faturamento (largura 2) */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
          <GlassCard className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Faturamento — peças vs mão de obra
            </h2>
            <FaturamentoChart data={faturamento} />
          </GlassCard>
        </motion.div>

        {/* Donut mix */}
        <motion.div {...fadeUp(0.2)}>
          <GlassCard className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Mix de receita
            </h2>
            <MixReceitaDonut pecas={kpis.faturamentoMes} maoDeObra={kpis.maoDeObraMes} />
            <div className="mt-2 flex items-center justify-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: "var(--wrench-accent)" }} />
                Peças
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: "var(--chart-4)" }} />
                Mão de obra
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* OS por status */}
        <motion.div {...fadeUp(0.15)} className="lg:col-span-1">
          <GlassCard className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              OS por status
            </h2>
            <OsStatusChart data={osPorStatus} />
          </GlassCard>
        </motion.div>

        {/* Top peças */}
        <motion.div {...fadeUp(0.2)}>
          <GlassCard className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package size={14} className="text-[var(--wrench-accent)]" />
              Top peças
            </h2>
            <TopItensList itens={topPecas} />
          </GlassCard>
        </motion.div>

        {/* Top serviços */}
        <motion.div {...fadeUp(0.25)}>
          <GlassCard className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wrench size={14} className="text-[var(--status-warn)]" />
              Top serviços
            </h2>
            <TopItensList itens={topServicos} />
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
