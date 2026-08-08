"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Package, Wrench, ArrowRight, Car, User } from "lucide-react";
import { brl, formatDate, formatDateTime } from "@/lib/formatters";
import {
  type OrdemServico,
  OS_STATUS_LABEL,
  OS_STATUS_TONE,
  PAGAMENTO_TONE,
  proximoStatus,
} from "../types";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import { SPRING_DRAWER } from "@/lib/motion";
import { toast } from "sonner";

/**
 * Wrench OsDrawer — painel lateral de detalhe da OS.
 * Lista itens (peça/serviço), totais, pagamentos, e ação de avançar status.
 */
export function OsDrawer({
  os,
  open,
  onClose,
}: {
  os: OrdemServico | null;
  open: boolean;
  onClose: () => void;
}) {
  const proximo = os ? proximoStatus(os.status) : null;

  function handleAvancar() {
    if (!os || !proximo) return;
    // Mock: na Fase 7 dispara mutation PATCH /api/ordens-servico/{id}/avancar
    toast.success(`OS #${os.numero} avançou para ${OS_STATUS_LABEL[proximo]}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && os && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-background/50 backdrop-blur-sm"
          />

          {/* Painel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING_DRAWER}
            className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-md flex-col border-l border-line bg-card shadow-soft-xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-line p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-lg font-bold tabular text-foreground">
                    #{String(os.numero).padStart(4, "0")}
                  </h2>
                  <StatusBadge tone={OS_STATUS_TONE[os.status]} size="sm">
                    {OS_STATUS_LABEL[os.status]}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {os.clienteNome}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Entrada: {formatDateTime(os.dataEntrada)}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Veículo */}
              <div className="mb-5 rounded-xl border border-line bg-card-2 p-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Car size={11} /> Veículo
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {os.veiculo.modelo}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {os.veiculo.marca}
                      {os.veiculo.ano ? ` · ${os.veiculo.ano}` : ""}
                      {os.veiculo.cor ? ` · ${os.veiculo.cor}` : ""}
                    </p>
                  </div>
                  <span className="rounded-lg bg-[var(--wrench-accent-soft)] px-2 py-1 font-mono text-xs font-semibold tabular uppercase text-[var(--wrench-accent)]">
                    {os.veiculo.placa}
                  </span>
                </div>
              </div>

              {/* Mecânico */}
              {os.mecanicoNome && (
                <div className="mb-5 flex items-center gap-2 text-sm">
                  <User size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Mecânico:</span>
                  <span className="font-medium text-foreground">{os.mecanicoNome}</span>
                </div>
              )}

              {/* Itens */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Itens ({os.itens.length})
                </h3>
              </div>

              <div className="space-y-2">
                {os.itens.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-lg border border-line bg-card-2 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2">
                        {it.tipo === "Peca" ? (
                          <Package size={14} className="mt-0.5 shrink-0 text-[var(--wrench-accent)]" />
                        ) : (
                          <Wrench size={14} className="mt-0.5 shrink-0 text-[var(--status-warn)]" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {it.nome}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {it.tipo === "Peca"
                              ? `${it.quantidade}× ${brl(it.precoUnitario)}`
                              : "Mão de obra"}
                            {it.compartimento ? ` · ${it.compartimento}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular text-foreground">
                        {brl(it.valorFinal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Observações */}
              {os.observacoes && (
                <div className="mt-4 rounded-lg border border-line bg-card-2 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Observações
                  </p>
                  <p className="text-xs leading-relaxed text-foreground">
                    {os.observacoes}
                  </p>
                </div>
              )}

              {/* Totais */}
              <Separator className="my-5" />
              <div className="space-y-2 text-sm">
                <Row label="Peças" value={brl(os.totalPecas)} />
                <Row label="Mão de obra" value={brl(os.totalMaoDeObra)} />
                {os.desconto > 0 && (
                  <Row label="Desconto" value={`- ${brl(os.desconto)}`} tone="alert" />
                )}
                <Separator className="my-1" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total geral</span>
                  <span className="gradient-text text-lg font-bold tabular">
                    {brl(os.totalGeral)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Pago ({os.pagamentoStatus})</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular font-medium text-foreground">
                      {brl(os.totalPago)}
                    </span>
                    <StatusBadge tone={PAGAMENTO_TONE[os.pagamentoStatus]} size="sm">
                      {os.pagamentoStatus}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer — ação */}
            <div className="border-t border-line p-4">
              {proximo ? (
                <button
                  onClick={handleAvancar}
                  className="group flex w-full items-center justify-center gap-2 rounded-full gradient-brand py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                >
                  Avançar para {OS_STATUS_LABEL[proximo]}
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={12} />
                  </span>
                </button>
              ) : (
                <div className="rounded-lg border border-line bg-card-2 py-2.5 text-center text-sm text-muted-foreground">
                  OS {OS_STATUS_LABEL[os.status].toLowerCase()} — sem ação disponível
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "alert";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`tabular font-medium ${
          tone === "alert" ? "text-[var(--status-alert)]" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
