"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Banknote,
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/molecules/kpi-card";
import {
  type MovimentoCaixa,
  VENDA_FORMA_LABEL,
} from "../types";
import { MOVIMENTOS_CAIXA_MOCK, VENDAS_MOCK } from "../mock";
import { CAIXA_TURNO_MOCK } from "@/features/financeiro/mock";
import { brl, formatDateTime } from "@/lib/formatters";
import { SPRING_DRAWER, fadeUp } from "@/lib/motion";
import { toast } from "sonner";

/**
 * Wrench CaixaView — turno de caixa com saldo, movimentos e operações.
 */
export function CaixaView() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>(MOVIMENTOS_CAIXA_MOCK);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tipo, setTipo] = useState<"Sangria" | "Suprimento">("Sangria");
  const [valor, setValor] = useState(0);
  const [motivo, setMotivo] = useState("");

  const turno = CAIXA_TURNO_MOCK;
  const totalVendasDia = VENDAS_MOCK.reduce((s, v) => s + v.total, 0);
  const totalSangrias = movimentos
    .filter((m) => m.tipo === "Sangria")
    .reduce((s, m) => s + m.valor, 0);
  const totalSuprimentos = movimentos
    .filter((m) => m.tipo === "Suprimento")
    .reduce((s, m) => s + m.valor, 0);
  const saldoCalculado =
    turno.saldoInicial + totalVendasDia + totalSuprimentos - totalSangrias;

  function registrar() {
    if (valor <= 0) return toast.error("Informe um valor válido");
    if (!motivo.trim()) return toast.error("Informe o motivo");
    setMovimentos((prev) => [
      { id: `mc-${Date.now()}`, tipo, valor, motivo, data: new Date().toISOString() },
      ...prev,
    ]);
    toast.success(`${tipo} de ${brl(valor)} registrada`);
    setDrawerOpen(false);
    setValor(0);
    setMotivo("");
  }

  return (
    <>
      <PageHeader
        title="Caixa & Tesouraria"
        subtitle={`Turno #${turno.numero} · ${turno.operadorNome}`}
        actions={
          turno.status === "Aberto" ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => toast.info("Fechamento de caixa — Fase 3")}
            >
              Fechar turno
            </Button>
          ) : undefined
        }
      />

      {/* Status do turno */}
      <motion.div {...fadeUp(0)} className="mb-4">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--wrench-accent-soft)]">
                <Banknote size={17} className="text-[var(--wrench-accent)]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Turno #{turno.numero}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Aberto em {formatDateTime(turno.abertoEm)}
                </p>
              </div>
            </div>
            <StatusBadge tone={turno.status === "Aberto" ? "ok" : "muted"} size="md" dot>
              {turno.status}
            </StatusBadge>
          </div>

          <Separator className="my-3" />

          {/* Resumo financeiro do turno */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Saldo inicial</p>
              <p className="tabular text-lg font-semibold text-foreground">{brl(turno.saldoInicial)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Vendas</p>
              <p className="tabular text-lg font-semibold text-[var(--status-ok)]">+ {brl(totalVendasDia)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Suprimentos</p>
              <p className="tabular text-lg font-semibold text-[var(--status-ok)]">+ {brl(totalSuprimentos)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sangrias</p>
              <p className="tabular text-lg font-semibold text-[var(--status-alert)]">- {brl(totalSangrias)}</p>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Saldo atual */}
          <div className="flex items-center justify-between rounded-xl bg-[var(--wrench-accent-soft)] p-3">
            <span className="text-sm font-medium text-foreground">Saldo atual do caixa</span>
            <span className="gradient-text text-2xl font-bold tabular">
              {brl(saldoCalculado)}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="glass" onClick={() => { setTipo("Sangria"); setDrawerOpen(true); }} className="flex-1">
              <ArrowUpFromLine size={13} /> Sangria
            </Button>
            <Button size="sm" variant="glass" onClick={() => { setTipo("Suprimento"); setDrawerOpen(true); }} className="flex-1">
              <ArrowDownToLine size={13} /> Suprimento
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Movimentos do turno */}
      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="overflow-hidden">
          <div className="border-b border-line p-4">
            <h2 className="text-sm font-semibold text-foreground">
              Movimentos do turno ({movimentos.length})
            </h2>
          </div>
          <div className="divide-y divide-line">
            {[...movimentos].reverse().map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {m.tipo === "Sangria" ? (
                    <ArrowUpFromLine size={14} className="text-[var(--status-alert)]" />
                  ) : (
                    <ArrowDownToLine size={14} className="text-[var(--status-ok)]" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.tipo}</p>
                    <p className="text-[11px] text-muted-foreground">{m.motivo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={m.tipo === "Sangria" ? "tabular text-sm font-semibold text-[var(--status-alert)]" : "tabular text-sm font-semibold text-[var(--status-ok)]"}>
                    {m.tipo === "Sangria" ? "- " : "+ "}{brl(m.valor)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{formatDateTime(m.data)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Drawer de registro */}
      <AnimatePresence>
        {drawerOpen && (
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
                <h2 className="text-sm font-semibold text-foreground">
                  Registrar {tipo.toLowerCase()}
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {(["Sangria", "Suprimento"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTipo(t)}
                      className={
                        tipo === t
                          ? "rounded-lg border-2 border-[var(--wrench-accent)] bg-[var(--wrench-accent-soft)] py-2.5 text-sm font-medium text-[var(--wrench-accent)]"
                          : "rounded-lg border border-line py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                      }
                    >
                      {t === "Sangria" ? "Retirar (sangria)" : "Colocar (suprimento)"}
                    </button>
                  ))}
                </div>

                <Field label="Valor (R$)">
                  <Input
                    type="number"
                    step="0.01"
                    value={valor || ""}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="tabular text-lg"
                    autoFocus
                  />
                </Field>
                <Field label="Motivo" className="mt-4">
                  <Input
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder={tipo === "Sangria" ? "Ex: Pagamento M.O" : "Ex: Troco adicional"}
                  />
                </Field>
              </div>

              <div className="flex gap-2 border-t border-line p-4">
                <Button variant="glass" onClick={() => setDrawerOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={registrar} className="flex-1">
                  Confirmar
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
