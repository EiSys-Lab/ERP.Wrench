"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/molecules/kpi-card";
import {
  type Lancamento,
  type TipoLancamento,
  type FormaPagamento,
  LANCAMENTO_STATUS_TONE,
  FORMA_LABEL,
  CATEGORIAS_RECEITA,
  CATEGORIAS_DESPESA,
} from "../types";
import { LANCAMENTOS_MOCK } from "../mock";
import { brl, formatDate } from "@/lib/formatters";
import { SPRING_DRAWER } from "@/lib/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Wrench LancamentosView — contas a receber/pagar com filtros e baixa.
 */
export function LancamentosView() {
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoLancamento | "">("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [baixa, setBaixa] = useState<Lancamento | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return LANCAMENTOS_MOCK.filter((l) => {
      const matchBusca =
        !q ||
        l.descricao.toLowerCase().includes(q) ||
        l.clienteNome?.toLowerCase().includes(q) ||
        l.fornecedorNome?.toLowerCase().includes(q);
      const matchTipo = !tipoFiltro || l.tipo === tipoFiltro;
      const matchStatus = !statusFiltro || l.status === statusFiltro;
      return matchBusca && matchTipo && matchStatus;
    }).sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
  }, [busca, tipoFiltro, statusFiltro]);

  const aReceber = LANCAMENTOS_MOCK.filter(
    (l) => l.tipo === "Receber" && l.status !== "Pago" && l.status !== "Cancelado",
  );
  const aPagar = LANCAMENTOS_MOCK.filter(
    (l) => l.tipo === "Pagar" && l.status !== "Pago" && l.status !== "Cancelado",
  );
  const totalReceber = aReceber.reduce((s, l) => s + (l.valor - l.valorPago), 0);
  const totalPagar = aPagar.reduce((s, l) => s + (l.valor - l.valorPago), 0);

  function abrirBaixa(l: Lancamento) {
    setBaixa({ ...l });
    setDrawerOpen(true);
  }

  function confirmarBaixa() {
    if (!baixa) return;
    // Mock: na Fase 7 dispara POST /api/financeiro/lancamentos/{id}/baixa
    toast.success(`${baixa.descricao} baixado — ${brl(baixa.valor - baixa.valorPago)}`);
    setDrawerOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Lançamentos"
        subtitle="Contas a receber e a pagar"
        actions={
          <Button size="sm" onClick={() => toast.info("Novo lançamento — Fase 3")}>
            <Plus size={14} /> Novo
          </Button>
        }
      />

      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          index={0}
          label="A receber"
          value={totalReceber}
          format={brl}
          icon={ArrowDownLeft}
          status="ok"
          hint={`${aReceber.length} títulos`}
        />
        <KpiCard
          index={1}
          label="A pagar"
          value={totalPagar}
          format={brl}
          icon={ArrowUpRight}
          status="warn"
          hint={`${aPagar.length} títulos`}
        />
        <KpiCard
          index={2}
          label="Saldo projetado"
          value={totalReceber - totalPagar}
          format={brl}
          icon={ArrowDownLeft}
          glow
          status={totalReceber - totalPagar >= 0 ? "ok" : "alert"}
        />
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar lançamento..."
            className="pl-9"
          />
        </div>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value as TipoLancamento | "")}
          className="h-9 rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
        >
          <option value="">Todos</option>
          <option value="Receber">A receber</option>
          <option value="Pagar">A pagar</option>
        </select>
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="h-9 rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
        >
          <option value="">Todos status</option>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
          <option value="Parcial">Parcial</option>
          <option value="Atrasado">Atrasado</option>
        </select>
      </div>

      {/* Tabela */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-2.5">Descrição</th>
                <th className="px-4 py-2.5">Tipo</th>
                <th className="px-4 py-2.5">Vencimento</th>
                <th className="px-4 py-2.5 text-right">Valor</th>
                <th className="px-4 py-2.5 text-right">Pago</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="stagger-rows">
              {filtrados.map((l) => {
                const vencido = new Date(l.vencimento) < new Date("2026-08-08") && l.status !== "Pago";
                return (
                  <tr
                    key={l.id}
                    className="border-b border-line transition-colors last:border-0 hover:bg-[var(--glass-bg-hover)]"
                  >
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium text-foreground">{l.descricao}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {l.categoria}
                        {l.clienteNome ? ` · ${l.clienteNome}` : ""}
                        {l.fornecedorNome ? ` · ${l.fornecedorNome}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn("flex items-center gap-1 text-xs font-medium", l.tipo === "Receber" ? "text-[var(--status-ok)]" : "text-[var(--status-alert)]")}>
                        {l.tipo === "Receber" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {l.tipo === "Receber" ? "Receber" : "Pagar"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn("tabular text-[11px]", vencido ? "font-semibold text-[var(--status-alert)]" : "text-muted-foreground")}>
                        {formatDate(l.vencimento)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm font-medium text-foreground">{brl(l.valor)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm text-muted-foreground">{brl(l.valorPago)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={LANCAMENTO_STATUS_TONE[l.status]} size="sm">
                        {l.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {l.status !== "Pago" && l.status !== "Cancelado" && (
                        <Button size="xs" variant="glass" onClick={() => abrirBaixa(l)}>
                          <Check size={11} /> Baixar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum lançamento encontrado.
          </div>
        )}
      </GlassCard>

      {/* Drawer de baixa */}
      <AnimatePresence>
        {drawerOpen && baixa && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[90] bg-background/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={SPRING_DRAWER}
              className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-md flex-col border-l border-line bg-card shadow-soft-xl"
            >
              <div className="flex items-start justify-between border-b border-line p-5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Baixa de lançamento
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{baixa.descricao}</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {/* Resumo */}
                <div className="mb-5 space-y-2 rounded-xl border border-line bg-card-2 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor total</span>
                    <span className="tabular font-medium text-foreground">{brl(baixa.valor)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">já pago</span>
                    <span className="tabular text-foreground">{brl(baixa.valorPago)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground">Valor a baixar</span>
                    <span className="gradient-text text-lg font-bold tabular">
                      {brl(baixa.valor - baixa.valorPago)}
                    </span>
                  </div>
                </div>

                {/* Forma de pagamento */}
                <Field label="Forma de pagamento">
                  <select
                    value={baixa.formaPagamento ?? "Pix"}
                    onChange={(e) =>
                      setBaixa({ ...baixa, formaPagamento: e.target.value as FormaPagamento })
                    }
                    className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                  >
                    {Object.entries(FORMA_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="flex gap-2 border-t border-line p-4">
                <Button variant="glass" onClick={() => setDrawerOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={confirmarBaixa} className="flex-1">
                  <Check size={14} /> Confirmar baixa
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
