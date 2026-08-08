"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { PlusCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { OsDrawer, ORDENS_SERVICO_MOCK, type OrdemServico, OS_STATUS_LABEL, OS_STATUS_TONE, PAGAMENTO_TONE } from "@/features/ordens-servico";
import { brl, formatDateTime } from "@/lib/formatters";
import { fadeUpRow } from "@/lib/motion";

/**
 * Wrench Lista de OS — visão tabular com todas as ordens.
 */
export default function ListaOsPage() {
  const [selected, setSelected] = useState<OrdemServico | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ordens = [...ORDENS_SERVICO_MOCK].sort(
    (a, b) => b.numero - a.numero,
  );

  function openDrawer(os: OrdemServico) {
    setSelected(os);
    setDrawerOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Ordens de Serviço"
        subtitle={`${ordens.length} ordens registradas`}
        actions={
          <Link href="/ordens-servico/nova">
            <Button size="sm">
              <PlusCircle size={14} />
              Nova OS
            </Button>
          </Link>
        }
      />

      <motion.div {...fadeUpRow(0)}>
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="px-4 py-2.5">OS</th>
                  <th className="px-4 py-2.5">Cliente</th>
                  <th className="px-4 py-2.5">Veículo</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Entrada</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                  <th className="px-4 py-2.5">Pagamento</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="stagger-rows">
                {ordens.map((os) => (
                  <tr
                    key={os.id}
                    onClick={() => openDrawer(os)}
                    className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-[var(--glass-bg-hover)]"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-semibold tabular text-foreground">
                        #{String(os.numero).padStart(4, "0")}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm font-medium text-foreground">
                        {os.clienteNome}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] tabular uppercase text-muted-foreground">
                          {os.veiculo.placa}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {os.veiculo.modelo}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={OS_STATUS_TONE[os.status]} size="sm">
                        {OS_STATUS_LABEL[os.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] text-muted-foreground">
                        {formatDateTime(os.dataEntrada)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-sm font-semibold tabular text-foreground">
                        {brl(os.totalGeral)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={PAGAMENTO_TONE[os.pagamentoStatus]} size="sm">
                        {os.pagamentoStatus}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-2.5">
                      <ArrowRight size={14} className="text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      <OsDrawer
        os={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
