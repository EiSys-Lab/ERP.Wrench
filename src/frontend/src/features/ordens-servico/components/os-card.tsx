"use client";

import { motion } from "motion/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Car, Wrench, Package } from "lucide-react";
import { brl } from "@/lib/formatters";
import {
  type OrdemServico,
  stageOf,
  OS_STATUS_LABEL,
  OS_STATUS_TONE,
  PAGAMENTO_TONE,
} from "../types";
import { StatusBadge } from "@/components/atoms/status-badge";
import { cn } from "@/lib/utils";

/**
 * Wrench OsCard — card de OS arrastável no Kanban.
 * Glass + barra accent superior (cor do estágio) + total destacado.
 */
export function OsCard({ os, onClick }: { os: OrdemServico; onClick: () => void }) {
  const stage = stageOf(os);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: os.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const qtdPecas = os.itens.filter((i) => i.tipo === "Peca").length;
  const qtdServicos = os.itens.filter((i) => i.tipo === "Servico").length;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // Evita abrir drawer ao arrastar
        if (!isDragging) onClick();
        e.stopPropagation();
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "group relative cursor-grab overflow-hidden rounded-xl border border-line bg-card p-3 shadow-soft-sm transition-shadow active:cursor-grabbing",
        "hover:border-[var(--glass-border-hover)] hover:shadow-soft-md",
        isDragging && "opacity-60 shadow-soft-lg",
      )}
    >
      {/* Barra accent superior (cor do estágio) */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: stage.accent }}
      />

      {/* Header: número + status */}
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tabular text-foreground">
          #{String(os.numero).padStart(4, "0")}
        </span>
        <StatusBadge tone={OS_STATUS_TONE[os.status]} size="sm">
          {OS_STATUS_LABEL[os.status]}
        </StatusBadge>
      </div>

      {/* Cliente + veículo */}
      <p className="truncate text-sm font-medium text-foreground">{os.clienteNome}</p>
      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
        <Car size={11} />
        <span className="tabular uppercase">{os.veiculo.placa}</span>
        <span className="truncate">· {os.veiculo.modelo}</span>
      </div>

      {/* Itens resumo */}
      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        {qtdPecas > 0 && (
          <span className="flex items-center gap-1">
            <Package size={11} /> {qtdPecas} peça{qtdPecas > 1 ? "s" : ""}
          </span>
        )}
        {qtdServicos > 0 && (
          <span className="flex items-center gap-1">
            <Wrench size={11} /> {qtdServicos} M.O
          </span>
        )}
      </div>

      {/* Footer: total + pagamento */}
      <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2">
        <span className="text-sm font-bold tabular text-foreground">
          {brl(os.totalGeral)}
        </span>
        <StatusBadge tone={PAGAMENTO_TONE[os.pagamentoStatus]} size="sm">
          {os.pagamentoStatus}
        </StatusBadge>
      </div>
    </motion.div>
  );
}
