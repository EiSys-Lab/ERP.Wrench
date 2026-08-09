"use client";

import { cn } from "@/lib/utils";

/**
 * Wrench Skeletons — placeholders de loading que casam com a forma do
 * conteúdo final (princípio UX: skeleton > spinner para listas/grids).
 *
 * Uso: enquanto dados mock/carregam, renderize o skeleton correspondente.
 * Na Fase 7 (TanStack Query real), use `isLoading` do hook.
 */

/** Bloco base com shimmer. */
function Block({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("shimmer rounded-lg", className)} style={style} />;
}

/** Skeleton de uma linha de KPI (card). */
export function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-soft-sm">
      <div className="mb-3 flex items-center gap-2">
        <Block className="size-7 rounded-lg" />
        <Block className="h-3 w-20" />
      </div>
      <Block className="h-7 w-28" />
      <Block className="mt-3 h-3 w-16" />
    </div>
  );
}

/** Grid de N skeletons de KPI. */
export function KpiGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <KpiSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton de uma linha de tabela. */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-line px-4 py-2.5">
      {Array.from({ length: cols }).map((_, i) => (
        <Block
          key={i}
          className={cn("h-3", i === 0 ? "w-16" : i === 1 ? "flex-1" : "w-20")}
        />
      ))}
    </div>
  );
}

/** Skeleton de uma tabela completa (header + N linhas). */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft-md">
      <div className="flex gap-4 border-b border-line px-4 py-2.5">
        {Array.from({ length: cols }).map((_, i) => (
          <Block key={i} className={cn("h-2.5", i === 0 ? "w-16" : i === 1 ? "flex-1" : "w-20")} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </div>
  );
}

/** Skeleton de um card de Kanban (coluna inteira). */
export function KanbanColumnSkeleton() {
  return (
    <div className="w-72 shrink-0">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Block className="size-2 rounded-full" />
        <Block className="h-3 w-16" />
        <Block className="h-3 w-6 rounded-full" />
      </div>
      <div className="flex min-h-[200px] flex-col gap-2 rounded-2xl border border-line p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-line bg-card p-3">
            <div className="mb-2 flex justify-between">
              <Block className="h-3 w-12" />
              <Block className="h-3 w-14 rounded-full" />
            </div>
            <Block className="h-3 w-24" />
            <Block className="mt-1 h-2 w-20" />
            <div className="mt-2 flex justify-between border-t border-line pt-2">
              <Block className="h-3 w-16" />
              <Block className="h-3 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton do Kanban completo (5 colunas). */
export function KanbanSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ height: "calc(100dvh - 11rem)", minHeight: 360 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <KanbanColumnSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton de um gráfico (card com caixa vazia). */
export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-soft-md">
      <Block className="mb-4 h-4 w-40" />
      <Block className="w-full" style={{ height }} />
    </div>
  );
}

/** Skeleton de um card de cliente/veículo. */
export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-line bg-card p-4 shadow-soft-sm">
          <div className="mb-3 flex items-center justify-between">
            <Block className="size-9 rounded-lg" />
            <Block className="h-6 w-16 rounded-lg" />
          </div>
          <Block className="h-3 w-full" />
          <Block className="mt-1.5 h-2 w-20" />
          <Block className="mt-2 h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton genérico de drawer (painel lateral). */
export function DrawerSkeleton() {
  return (
    <div className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-md flex-col border-l border-line bg-card p-5 shadow-soft-xl">
      <div className="mb-5 flex items-center gap-3">
        <Block className="size-10 rounded-full" />
        <div className="flex-1">
          <Block className="h-4 w-32" />
          <Block className="mt-2 h-3 w-20" />
        </div>
      </div>
      <Block className="mb-4 h-20 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Block key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <Block className="mt-4 h-3 w-24" />
      <Block className="mt-2 h-14 w-full rounded-xl" />
      <Block className="mt-2 h-14 w-full rounded-xl" />
    </div>
  );
}
