"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Car } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/molecules/kpi-card";
import { CLIENTES_MOCK } from "../mock";
import { num } from "@/lib/formatters";
import { fadeUpCard } from "@/lib/motion";

/**
 * Wrench VeiculosView — frota de veículos de todos os clientes.
 * Grid de cards com placa, modelo, marca e dono.
 */
export function VeiculosView() {
  const [busca, setBusca] = useState("");

  // Achata todos os veículos com nome do dono.
  const veiculos = useMemo(() => {
    return CLIENTES_MOCK.flatMap((c) =>
      c.veiculos.map((v) => ({ ...v, dono: c.nome })),
    );
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return veiculos;
    return veiculos.filter(
      (v) =>
        v.placa.toLowerCase().includes(q) ||
        v.modelo.toLowerCase().includes(q) ||
        v.marca?.toLowerCase().includes(q) ||
        v.dono.toLowerCase().includes(q),
    );
  }, [busca, veiculos]);

  return (
    <>
      <PageHeader
        title="Veículos"
        subtitle={`${veiculos.length} veículos na frota`}
      />

      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard index={0} label="Veículos" value={veiculos.length} format={num} icon={Car} />
        <KpiCard index={1} label="Clientes" value={CLIENTES_MOCK.length} format={num} icon={Car} />
        <KpiCard
          index={2}
          label="Média por cliente"
          value={veiculos.length / CLIENTES_MOCK.length}
          format={(v) => num(Math.round(v))}
          icon={Car}
        />
      </div>

      {/* Busca */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por placa, modelo ou dono..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Grid de veículos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtrados.map((v, i) => (
          <motion.div
            key={v.id}
            {...fadeUpCard(i)}
            className="group cursor-pointer rounded-2xl border border-line bg-card p-4 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-[var(--glass-border-hover)] hover:shadow-soft-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--wrench-accent-soft)]">
                <Car size={16} className="text-[var(--wrench-accent)]" />
              </span>
              <span className="rounded-lg border border-line bg-card-2 px-2 py-1 font-mono text-xs font-semibold tabular uppercase text-foreground">
                {v.placa}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">{v.modelo}</p>
            <p className="text-[11px] text-muted-foreground">
              {v.marca}{v.ano ? ` · ${v.ano}` : ""}{v.cor ? ` · ${v.cor}` : ""}
            </p>
            <div className="mt-2 border-t border-line pt-2 text-[11px] text-muted-foreground">
              <span className="text-foreground">{v.dono}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtrados.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Nenhum veículo encontrado.
        </div>
      )}
    </>
  );
}
