"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  type OrdemServico,
  type OsStage,
  OS_STAGES,
  stageOf,
} from "../types";
import { OsCard } from "./os-card";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/formatters";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Altura aproximada de cada card no Kanban (px) — p/ calcular page size. */
const CARD_HEIGHT = 116;
/** Gap entre cards (px). */
const CARD_GAP = 8;
/** Padding interno da área de cards (px). */
const AREA_PAD = 16;
/** Altura do rodapé de paginação (px) — reserva quando há mais de 1 página. */
const FOOTER_RESERVE = 36;

/**
 * Calcula quantos cards cabem verticalmente dado a altura do container.
 * Resultado entre 3 e 8 (limites responsivos).
 */
function calcPageSize(containerHeight: number): number {
  const avail = containerHeight - AREA_PAD - FOOTER_RESERVE;
  const raw = Math.floor(avail / (CARD_HEIGHT + CARD_GAP));
  return Math.max(3, Math.min(8, raw));
}

/**
 * Wrench OsKanban — tabuleiro de OS com drag-and-drop e paginação por coluna.
 *
 * UX:
 * - Ocupa altura total da viewport (h-[calc(100dvh-9rem)]).
 * - Cada coluna tem page size responsivo (medido por container).
 * - Cards excedentes ficam em páginas acessíveis via setas no rodapé.
 * - Arrastar entre colunas muda o status (mock).
 */
export function OsKanban({
  ordens,
  onSelectOs,
}: {
  ordens: OrdemServico[];
  onSelectOs: (os: OrdemServico) => void;
}) {
  const [items, setItems] = useState<OrdemServico[]>(ordens);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);

  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const activeOs = items.find((o) => o.id === activeId);

  // Mede a altura do container e calcula o page size responsivo.
  const measure = useCallback(() => {
    if (containerRef.current) {
      const h = containerRef.current.clientHeight;
      setPageSize(calcPageSize(h));
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const targetStage = OS_STAGES.find((s) => s.id === over.id);
    if (!targetStage) return;

    setItems((prev) =>
      prev.map((os) =>
        os.id === active.id
          ? { ...os, status: targetStage.statuses[0] }
          : os,
      ),
    );
  }

  const byStage = (stage: OsStage) =>
    items.filter((o) => stageOf(o).id === stage.id);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {/* Container flex que ocupa toda a altura disponível abaixo do header. */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ height: "calc(100dvh - 11rem)", minHeight: 360 }}
      >
        {OS_STAGES.map((stage) => {
          const stageOrdens = byStage(stage);
          const total = stageOrdens.reduce((s, o) => s + o.totalGeral, 0);
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              ordens={stageOrdens}
              total={total}
              pageSize={pageSize}
              onSelectOs={onSelectOs}
            />
          );
        })}
      </div>

      {/* Overlay do card sendo arrastado */}
      <DragOverlay dropAnimation={{ duration: 200 }}>
        {activeOs ? (
          <div className="w-72 rotate-2">
            <OsCard os={activeOs} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* ─── Coluna com paginação ─── */

function KanbanColumn({
  stage,
  ordens,
  total,
  pageSize,
  onSelectOs,
}: {
  stage: OsStage;
  ordens: OrdemServico[];
  total: number;
  pageSize: number;
  onSelectOs: (os: OrdemServico) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const [page, setPage] = useState(0);

  // Reseta a página se exceder após mudança de pageSize/itens.
  const totalPages = Math.max(1, Math.ceil(ordens.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize;
  const visibleOrdens = ordens.slice(start, start + pageSize);

  // Reseta página quando itens mudam drasticamente.
  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  const hasPagination = totalPages > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-72 shrink-0 flex-col"
    >
      {/* Header da coluna */}
      <div className="mb-2 flex shrink-0 items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: stage.accent }}
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {stage.label}
          </span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular text-muted-foreground">
            {ordens.length}
          </span>
        </div>
        <span className="text-[10px] tabular text-muted-foreground">
          {brl(total)}
        </span>
      </div>

      {/* Área droppable — flex-1 preenche até o rodapé, overflow hidden */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 rounded-2xl border p-2 transition-colors",
          isOver
            ? "border-[var(--glass-border-hover)] bg-[var(--glass-bg-active)]"
            : "border-line",
        )}
        style={{ background: stage.soft, overflow: "hidden" }}
      >
        {/* Lista de cards da página atual */}
        <div className="flex flex-col gap-2">
          {visibleOrdens.map((os) => (
            <OsCard key={os.id} os={os} onClick={() => onSelectOs(os)} />
          ))}
          {ordens.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-8 text-[11px] text-muted-foreground">
              Solte OS aqui
            </div>
          )}
        </div>

        {/* Espaçador empurra o footer para baixo */}
        <div className="flex-1" />

        {/* Rodapé de paginação (só aparece se houver mais de 1 página) */}
        {hasPagination && (
          <div className="mt-1 flex shrink-0 items-center justify-between border-t border-line pt-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Página anterior"
              className={cn(
                "flex size-6 items-center justify-center rounded-md border border-line transition-colors",
                safePage === 0
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-[var(--glass-bg-hover)] hover:text-foreground",
              )}
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-[10px] tabular text-muted-foreground">
              {safePage + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              aria-label="Próxima página"
              className={cn(
                "flex size-6 items-center justify-center rounded-md border border-line transition-colors",
                safePage === totalPages - 1
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-[var(--glass-bg-hover)] hover:text-foreground",
              )}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
