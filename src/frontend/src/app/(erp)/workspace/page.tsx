"use client";

import { motion } from "motion/react";
import { ArrowRight, ClipboardList, Package, Wallet } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/organisms/page-header";
import { KpiCard } from "@/components/molecules/kpi-card";
import { GlassCard } from "@/components/atoms/glass-card";
import { Button } from "@/components/ui/button";
import { brl, num } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";

/**
 * Wrench Workspace — hub inicial.
 * KPIs do mês + atalhos rápidos + atividade recente (mock).
 */
export default function WorkspacePage() {
  return (
    <>
      <PageHeader
        title="Workspace"
        subtitle="Visão geral da oficina · Agosto 2026"
        actions={
          <Link href="/ordens-servico/nova">
            <Button>
              Nova OS
              <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/15">
                <ArrowRight size={12} />
              </span>
            </Button>
          </Link>
        }
      />

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          index={0}
          label="Faturamento mês"
          value={80150}
          format={brl}
          icon={Wallet}
          delta="+12%"
          direction="up"
          hint="vs julho"
          glow
        />
        <KpiCard
          index={1}
          label="OS em aberto"
          value={12}
          format={num}
          icon={ClipboardList}
          status="warn"
          statusLabel="Atenção"
        />
        <KpiCard
          index={2}
          label="Peças em estoque"
          value={340}
          format={num}
          icon={Package}
          hint="8 abaixo do mínimo"
        />
        <KpiCard
          index={3}
          label="Mão de obra mês"
          value={31900}
          format={brl}
          icon={ClipboardList}
          delta="+8%"
          direction="up"
        />
      </div>

      {/* Atalhos + atividade */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div {...fadeUp(0.2)}>
          <GlassCard className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Ordens recentes
            </h2>
            <div className="space-y-2">
              {RECENT_OS.map((os) => (
                <Link
                  key={os.numero}
                  href="/ordens-servico"
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[var(--glass-bg-hover)]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="tabular">#{os.numero}</span> · {os.cliente}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {os.veiculo} · {os.descricao}
                    </p>
                  </div>
                  <span className="tabular text-sm font-semibold text-foreground">
                    {brl(os.valor)}
                  </span>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div {...fadeUp(0.3)}>
          <GlassCard className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Atalhos
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="flex items-center gap-3 rounded-xl border border-line bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-[var(--glass-border-hover)] hover:shadow-soft-md"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--wrench-accent-soft)]">
                    <s.icon size={16} className="text-[var(--wrench-accent)]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {s.label}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}

const RECENT_OS = [
  { numero: "0142", cliente: "FRIGO", veiculo: "OCZ8034", descricao: "Sinaleira + conectores", valor: 1280 },
  { numero: "0141", cliente: "ELIANE", veiculo: "RFX0H93", descricao: "Pingão + H1 24V", valor: 480 },
  { numero: "0140", cliente: "BIROLO", veiculo: "MBQ4884", descricao: "Soquete + lâmpada + M.O", valor: 950 },
  { numero: "0139", cliente: "FRAGNANI", veiculo: "MLX3E92", descricao: "Soquete farol", valor: 320 },
];

const SHORTCUTS = [
  { label: "Nova OS", desc: "Abrir ordem de serviço", href: "/ordens-servico/nova", icon: ClipboardList },
  { label: "Peças", desc: "Catálogo de peças", href: "/catalogo/pecas", icon: Package },
  { label: "Estoque", desc: "Movimentos e saldo", href: "/estoque", icon: Package },
  { label: "Caixa", desc: "Abrir turno de caixa", href: "/vendas/caixa", icon: Wallet },
];
