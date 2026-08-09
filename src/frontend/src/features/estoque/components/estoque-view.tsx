"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  ShoppingCart,
  ArrowLeftRight,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { KpiCard } from "@/components/molecules/kpi-card";
import { KpiGridSkeleton, TableSkeleton } from "@/components/molecules/skeletons";
import { Button } from "@/components/ui/button";
import {
  type SaldoEstoque,
  MOVIMENTO_LABEL,
  MOVIMENTO_TONE,
  sinalMovimento,
} from "../types";
import { SALDOS_MOCK, MOVIMENTOS_MOCK } from "../mock";
import { brl, num, formatDateTime } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";
import { useLoadingDelay } from "@/lib/use-loading-delay";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "movimentos" | "saldo" | "sugestoes";

/**
 * Wrench EstoqueView — movimentos, saldo e sugestão de compras.
 */
export function EstoqueView() {
  const [tab, setTab] = useState<Tab>("saldo");
  const loading = useLoadingDelay();

  const valorTotal = SALDOS_MOCK.reduce((s, x) => s + x.valorTotal, 0);
  const abaixoMin = SALDOS_MOCK.filter((s) => s.quantidade <= s.estoqueMinimo);
  const semEstoque = SALDOS_MOCK.filter((s) => s.quantidade === 0).length;

  // Sugestão: abaixo do mínimo, sugerindo comprar até o dobro do mínimo.
  const sugestoes = abaixoMin.map((s) => ({
    ...s,
    sugerido: Math.max(s.estoqueMinimo * 2 - s.quantidade, s.estoqueMinimo),
    custoEstimado: Math.max(s.estoqueMinimo * 2 - s.quantidade, s.estoqueMinimo) * s.preco * 0.6,
  }));
  const custoTotalCompras = sugestoes.reduce((s, x) => s + x.custoEstimado, 0);

  if (loading) {
    return (
      <>
        <PageHeader title="Estoque" subtitle="Carregando..." />
        <KpiGridSkeleton count={4} />
        <TableSkeleton rows={8} cols={7} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Estoque"
        subtitle={`${SALDOS_MOCK.length} peças · ${brl(valorTotal)} em valor`}
        actions={
          <Button size="sm" variant="glass" onClick={() => toast.info("Entrada por NF — Fase 3")}>
            <ArrowDownRight size={14} /> Entrada NF
          </Button>
        }
      />

      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard index={0} label="Valor em estoque" value={valorTotal} format={brl} icon={Package} glow />
        <KpiCard index={1} label="Peças cadastradas" value={SALDOS_MOCK.length} format={num} icon={Package} />
        <KpiCard index={2} label="Abaixo do mínimo" value={abaixoMin.length} icon={AlertTriangle} status="warn" statusLabel="Repor" />
        <KpiCard index={3} label="Sem estoque" value={semEstoque} icon={AlertTriangle} status="alert" statusLabel="Crítico" />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1.5">
        {([
          { id: "saldo", label: "Saldo", icon: Package },
          { id: "movimentos", label: "Movimentos", icon: ArrowLeftRight },
          { id: "sugestoes", label: `Sugestões (${sugestoes.length})`, icon: ShoppingCart },
        ] as const).map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo da tab */}
      <motion.div key={tab} {...fadeUp(0)} className="overflow-hidden">
        <GlassCard>
          {tab === "saldo" && <SaldoTab />}
          {tab === "movimentos" && <MovimentosTab />}
          {tab === "sugestoes" && (
            <SugestoesTab sugestoes={sugestoes} custoTotal={custoTotalCompras} />
          )}
        </GlassCard>
      </motion.div>
    </>
  );
}

/* ─── Tab Saldo ─── */
function SaldoTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="px-4 py-2.5">Código</th>
            <th className="px-4 py-2.5">Peça</th>
            <th className="px-4 py-2.5">Local</th>
            <th className="px-4 py-2.5 text-right">Saldo</th>
            <th className="px-4 py-2.5 text-right">Mínimo</th>
            <th className="px-4 py-2.5 text-right">Valor</th>
            <th className="px-4 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody className="stagger-rows">
          {SALDOS_MOCK.map((s) => {
            const critico = s.quantidade === 0;
            const abaixo = s.quantidade <= s.estoqueMinimo;
            return (
              <tr key={s.pecaId} className="border-b border-line last:border-0">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs font-semibold tabular text-[var(--wrench-accent)]">
                    {s.codigo}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-sm font-medium text-foreground">{s.nome}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {s.compartimento}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={cn("tabular text-sm font-medium", critico ? "text-[var(--status-alert)]" : "text-foreground")}>
                    {s.quantidade}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="tabular text-[11px] text-muted-foreground">{s.estoqueMinimo}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="tabular text-sm text-foreground">{brl(s.valorTotal)}</span>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge tone={critico ? "alert" : abaixo ? "warn" : "ok"} size="sm">
                    {critico ? "Sem estoque" : abaixo ? "Abaixo mín." : "OK"}
                  </StatusBadge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Tab Movimentos ─── */
function MovimentosTab() {
  const ordenados = [...MOVIMENTOS_MOCK].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="px-4 py-2.5">Data</th>
            <th className="px-4 py-2.5">Peça</th>
            <th className="px-4 py-2.5">Tipo</th>
            <th className="px-4 py-2.5 text-right">Qtd</th>
            <th className="px-4 py-2.5 text-right">Saldo</th>
            <th className="px-4 py-2.5">Origem</th>
            <th className="px-4 py-2.5">Operador</th>
          </tr>
        </thead>
        <tbody className="stagger-rows">
          {ordenados.map((m) => (
            <tr key={m.id} className="border-b border-line last:border-0">
              <td className="px-4 py-2.5">
                <span className="text-[11px] text-muted-foreground">{formatDateTime(m.data)}</span>
              </td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-[11px] text-[var(--wrench-accent)]">{m.pecaCodigo}</span>
                <span className="ml-1.5 text-sm text-foreground">{m.pecaNome}</span>
              </td>
              <td className="px-4 py-2.5">
                <StatusBadge tone={MOVIMENTO_TONE[m.tipo]} size="sm">
                  {MOVIMENTO_LABEL[m.tipo]}
                </StatusBadge>
              </td>
              <td className="px-4 py-2.5 text-right">
                <span className={cn("tabular text-sm font-semibold", sinalMovimento(m.tipo) === "+" ? "text-[var(--status-ok)]" : "text-[var(--status-alert)]")}>
                  {sinalMovimento(m.tipo)}{m.quantidade}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <span className="tabular text-sm text-foreground">{m.saldoResultante}</span>
              </td>
              <td className="px-4 py-2.5">
                <span className="text-[11px] text-muted-foreground">{m.documentoOrigem ?? m.motivo ?? "—"}</span>
              </td>
              <td className="px-4 py-2.5">
                <span className="text-[11px] text-muted-foreground">{m.operadorNome ?? "—"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Tab Sugestões ─── */
function SugestoesTab({
  sugestoes,
  custoTotal,
}: {
  sugestoes: (SaldoEstoque & { sugerido: number; custoEstimado: number })[];
  custoTotal: number;
}) {
  if (sugestoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 rounded-2xl glass p-3">
          <TrendingUp size={32} className="text-[var(--status-ok)]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-foreground">Estoque saudável</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Nenhuma peça abaixo do mínimo. Tudo certo!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line p-4">
        <span className="text-sm text-muted-foreground">
          {sugestoes.length} peças precisam reposição
        </span>
        <span className="text-sm font-semibold text-foreground">
          Custo estimado: <span className="gradient-text tabular">{brl(custoTotal)}</span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-2.5">Peça</th>
              <th className="px-4 py-2.5 text-right">Saldo atual</th>
              <th className="px-4 py-2.5 text-right">Mínimo</th>
              <th className="px-4 py-2.5 text-right">Sugerido</th>
              <th className="px-4 py-2.5 text-right">Custo estimado</th>
            </tr>
          </thead>
          <tbody className="stagger-rows">
            {sugestoes.map((s) => (
              <tr key={s.pecaId} className="border-b border-line last:border-0">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-[11px] text-[var(--wrench-accent)]">{s.codigo}</span>
                  <span className="ml-1.5 text-sm text-foreground">{s.nome}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="tabular text-sm font-semibold text-[var(--status-alert)]">{s.quantidade}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="tabular text-[11px] text-muted-foreground">{s.estoqueMinimo}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="rounded-md bg-[var(--wrench-accent-soft)] px-1.5 py-0.5 tabular text-xs font-semibold text-[var(--wrench-accent)]">
                    +{s.sugerido}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="tabular text-sm text-foreground">{brl(s.custoEstimado)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
