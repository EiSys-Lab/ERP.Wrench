"use client";

import { useState } from "react";
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

/**
 * Wrench OsKanban — tabuleiro de OS com drag-and-drop.
 * 5 colunas (estágios). Arrastar card entre colunas muda o status da OS.
 *
 * Estado local (mock): na Fase 7 o status vem do backend e o drop dispara
 * uma mutation PATCH. Por ora, atualizamos o array local.
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const activeOs = items.find((o) => o.id === activeId);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const targetStage = OS_STAGES.find((s) => s.id === over.id);
    if (!targetStage) return;

    // Atualiza o status da OS para o primeiro status do estágio destino.
    setItems((prev) =>
      prev.map((os) =>
        os.id === active.id
          ? { ...os, status: targetStage.statuses[0] }
          : os,
      ),
    );
  }

  // Agrupa OS por estágio.
  const byStage = (stage: OsStage) =>
    items.filter((o) => stageOf(o).id === stage.id);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {OS_STAGES.map((stage) => {
          const stageOrdens = byStage(stage);
          const total = stageOrdens.reduce((s, o) => s + o.totalGeral, 0);
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              ordens={stageOrdens}
              total={total}
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

/* ─── Coluna ─── */

function KanbanColumn({
  stage,
  ordens,
  total,
  onSelectOs,
}: {
  stage: OsStage;
  ordens: OrdemServico[];
  total: number;
  onSelectOs: (os: OrdemServico) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-72 shrink-0 flex-col"
    >
      {/* Header da coluna */}
      <div className="mb-3 flex items-center justify-between px-1">
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

      {/* Área droppable */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[200px] flex-1 flex-col gap-2 rounded-2xl border p-2 transition-colors",
          isOver
            ? "border-[var(--glass-border-hover)] bg-[var(--glass-bg-active)]"
            : "border-line",
        )}
        style={{ background: stage.soft }}
      >
        {ordens.map((os) => (
          <OsCard key={os.id} os={os} onClick={() => onSelectOs(os)} />
        ))}
        {ordens.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8 text-[11px] text-muted-foreground">
            Solte OS aqui
          </div>
        )}
      </div>
    </motion.div>
  );
}
