"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  X,
  Users,
  Car,
  Phone,
  MapPin,
  Mail,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/molecules/kpi-card";
import { KpiGridSkeleton, TableSkeleton } from "@/components/molecules/skeletons";
import {
  type Cliente,
  CLIENTE_TIPO_LABEL,
  CLIENTE_TIPO_TONE,
} from "../types";
import { CLIENTES_MOCK } from "../mock";
import { brl, num, formatDate, formatDocumento, formatPhone } from "@/lib/formatters";
import { SPRING_DRAWER, fadeUp } from "@/lib/motion";
import { useLoadingDelay } from "@/lib/use-loading-delay";
import { toast } from "sonner";

/**
 * Wrench ClientesView — lista de clientes com busca + drawer de detalhe.
 */
export function ClientesView() {
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [selecionado, setSelected] = useState<Cliente | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const loading = useLoadingDelay();

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return CLIENTES_MOCK.filter((c) => {
      const matchBusca =
        !q ||
        c.nome.toLowerCase().includes(q) ||
        c.documento.includes(q) ||
        c.veiculos.some((v) => v.placa.toLowerCase().includes(q));
      const matchTipo = !tipoFiltro || c.tipo === tipoFiltro;
      return matchBusca && matchTipo;
    });
  }, [busca, tipoFiltro]);

  const totalClientes = CLIENTES_MOCK.length;
  const totalVeiculos = CLIENTES_MOCK.reduce((s, c) => s + c.veiculos.length, 0);
  const totalGasto = CLIENTES_MOCK.reduce((s, c) => s + c.totalGasto, 0);

  function abrir(c: Cliente) {
    setSelected(c);
    setDrawerOpen(true);
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Clientes" subtitle="Carregando..." />
        <KpiGridSkeleton count={3} />
        <TableSkeleton rows={6} cols={7} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={`${totalClientes} clientes · ${totalVeiculos} veículos`}
      />

      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard index={0} label="Clientes" value={totalClientes} format={num} icon={Users} />
        <KpiCard index={1} label="Veículos" value={totalVeiculos} format={num} icon={Car} />
        <KpiCard index={2} label="Receita total" value={totalGasto} format={brl} icon={ShoppingBag} glow />
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, documento ou placa..."
            className="pl-9"
          />
        </div>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="h-9 rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
        >
          <option value="">Todos tipos</option>
          {Object.entries(CLIENTE_TIPO_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <Button size="sm" variant="glass" onClick={() => toast.info("Formulário de novo cliente — Fase 3")}>
          <Plus size={14} /> Novo
        </Button>
      </div>

      {/* Tabela */}
      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="responsive-table w-full">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="px-4 py-2.5">Cliente</th>
                  <th className="px-4 py-2.5">Tipo</th>
                  <th className="px-4 py-2.5">Documento</th>
                  <th className="px-4 py-2.5">Veículos</th>
                  <th className="px-4 py-2.5 text-right">OS</th>
                  <th className="px-4 py-2.5 text-right">Total gasto</th>
                  <th className="px-4 py-2.5">Última OS</th>
                </tr>
              </thead>
              <tbody className="stagger-rows">
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => abrir(c)}
                    className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-[var(--glass-bg-hover)]"
                  >
                    <td data-label="Cliente" className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-[var(--wrench-accent-soft)] text-[10px] font-bold text-[var(--wrench-accent)]">
                          {c.nome[0]}
                        </span>
                        <span className="text-sm font-medium text-foreground">{c.nome}</span>
                      </div>
                    </td>
                    <td data-label="Tipo" className="px-4 py-2.5">
                      <StatusBadge tone={CLIENTE_TIPO_TONE[c.tipo]} size="sm">
                        {CLIENTE_TIPO_LABEL[c.tipo]}
                      </StatusBadge>
                    </td>
                    <td data-label="Documento" className="px-4 py-2.5">
                      <span className="tabular text-[11px] text-muted-foreground">
                        {formatDocumento(c.documento)}
                      </span>
                    </td>
                    <td data-label="Veículos" className="px-4 py-2.5">
                      <span className="flex items-center gap-1 text-xs text-foreground">
                        <Car size={12} className="text-muted-foreground" />
                        {c.veiculos.length}
                      </span>
                    </td>
                    <td data-label="OS" className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm text-foreground">{c.totalOs}</span>
                    </td>
                    <td data-label="Total gasto" className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm font-medium text-foreground">{brl(c.totalGasto)}</span>
                    </td>
                    <td data-label="Última OS" className="px-4 py-2.5">
                      <span className="text-[11px] text-muted-foreground">
                        {c.ultimaOs ? formatDate(c.ultimaOs) : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrados.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhum cliente encontrado.
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Drawer de detalhe */}
      <AnimatePresence>
        {drawerOpen && selecionado && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[90] bg-background/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={SPRING_DRAWER}
              className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-md flex-col border-l border-line bg-card shadow-soft-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full gradient-brand text-sm font-bold text-primary-foreground">
                    {selecionado.nome[0]}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{selecionado.nome}</h2>
                    <StatusBadge tone={CLIENTE_TIPO_TONE[selecionado.tipo]} size="sm">
                      {CLIENTE_TIPO_LABEL[selecionado.tipo]}
                    </StatusBadge>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {/* Contato */}
                <div className="mb-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono tabular text-muted-foreground">DOC:</span>
                    <span className="tabular text-foreground">{formatDocumento(selecionado.documento)}</span>
                  </div>
                  {selecionado.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={13} className="text-muted-foreground" />
                      <span className="text-foreground">{formatPhone(selecionado.telefone)}</span>
                    </div>
                  )}
                  {selecionado.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={13} className="text-muted-foreground" />
                      <span className="text-foreground">{selecionado.email}</span>
                    </div>
                  )}
                  {selecionado.endereco && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={13} className="mt-0.5 text-muted-foreground" />
                      <span className="text-foreground">{selecionado.endereco}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-line bg-card-2 p-3 text-center">
                    <p className="tabular text-lg font-bold text-foreground">{selecionado.totalOs}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">OS total</p>
                  </div>
                  <div className="rounded-xl border border-line bg-card-2 p-3 text-center">
                    <p className="tabular text-lg font-bold text-foreground">{selecionado.veiculos.length}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Veículos</p>
                  </div>
                  <div className="rounded-xl border border-line bg-card-2 p-3 text-center">
                    <p className="tabular text-sm font-bold gradient-text">{brl(selecionado.totalGasto)}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Gasto</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Veículos */}
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Car size={13} /> Veículos ({selecionado.veiculos.length})
                </h3>
                <div className="space-y-2">
                  {selecionado.veiculos.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-xl border border-line bg-card-2 p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.modelo}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {v.marca}{v.ano ? ` · ${v.ano}` : ""}{v.cor ? ` · ${v.cor}` : ""}
                        </p>
                      </div>
                      <span className="rounded-lg bg-[var(--wrench-accent-soft)] px-2 py-1 font-mono text-xs font-semibold tabular uppercase text-[var(--wrench-accent)]">
                        {v.placa}
                      </span>
                    </div>
                  ))}
                </div>

                {selecionado.ultimaOs && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-card-2 p-3 text-xs">
                    <Calendar size={13} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Última OS:</span>
                    <span className="text-foreground">{formatDate(selecionado.ultimaOs)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-line p-4">
                <Button
                  variant="glass"
                  className="w-full"
                  onClick={() => toast.info("Histórico de OS — Fase 3")}
                >
                  Ver histórico de OS
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
