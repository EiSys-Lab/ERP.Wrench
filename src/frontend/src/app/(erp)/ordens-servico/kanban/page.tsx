"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { KanbanSkeleton } from "@/components/molecules/skeletons";
import { OsKanban, OsDrawer, type OrdemServico } from "@/features/ordens-servico";
import { useOrdens, osKeys } from "@/features/ordens-servico/hooks";
import { osSummaryDtoToOs } from "@/features/ordens-servico/api";

/**
 * Wrench Kanban de OS — quadro arrastável por estágio.
 * Fase 7: dados via TanStack Query (API real).
 */
export default function KanbanPage() {
  const [selected, setSelected] = useState<OrdemServico | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, isError } = useOrdens();
  const ordens = (data ?? []).map(osSummaryDtoToOs);

  function openDrawer(os: OrdemServico) {
    setSelected(os);
    setDrawerOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Kanban de Ordens"
        subtitle="Arraste OS entre estágios"
        actions={
          <Link href="/ordens-servico/nova">
            <Button size="sm">
              <PlusCircle size={14} />
              Nova OS
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <KanbanSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-[var(--status-alert)] bg-card p-6 text-center text-sm text-[var(--status-alert)]">
          Erro ao carregar ordens de serviço. Verifique se a API está rodando.
        </div>
      ) : (
        <OsKanban ordens={ordens} onSelectOs={openDrawer} />
      )}

      <OsDrawer
        os={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
