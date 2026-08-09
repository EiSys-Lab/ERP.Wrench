"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { KanbanSkeleton } from "@/components/molecules/skeletons";
import { OsKanban, OsDrawer, ORDENS_SERVICO_MOCK, type OrdemServico } from "@/features/ordens-servico";
import { useLoadingDelay } from "@/lib/use-loading-delay";

/**
 * Wrench Kanban de OS — quadro arrastável por estágio.
 */
export default function KanbanPage() {
  const [selected, setSelected] = useState<OrdemServico | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const loading = useLoadingDelay();

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

      {loading ? (
        <KanbanSkeleton />
      ) : (
        <OsKanban ordens={ORDENS_SERVICO_MOCK} onSelectOs={openDrawer} />
      )}

      <OsDrawer
        os={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
