"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  X,
  Package,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import { TableSkeleton } from "@/components/molecules/skeletons";
import {
  type Peca,
  UNIDADE_LABEL,
  statusEstoque,
  margem,
} from "../types";
import {
  PECAS_CATALOGO_MOCK,
  CATEGORIAS_PECAS,
} from "../mock";
import { brl, pct, num } from "@/lib/formatters";
import { SPRING_DRAWER } from "@/lib/motion";
import { useLoadingDelay } from "@/lib/use-loading-delay";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Wrench PecasView — catálogo de peças com busca, tabela e drawer de edição.
 */
export function PecasView() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [editando, setEditando] = useState<Peca | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const loading = useLoadingDelay();

  const filtradas = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return PECAS_CATALOGO_MOCK.filter((p) => {
      const matchBusca =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        p.compartimento.toLowerCase().includes(q);
      const matchCat = !categoriaFiltro || p.categoria === categoriaFiltro;
      return matchBusca && matchCat;
    });
  }, [busca, categoriaFiltro]);

  const valorTotal = filtradas.reduce(
    (s, p) => s + p.quantidadeEstoque * p.preco,
    0,
  );
  const abaixoMin = filtradas.filter(
    (p) => p.quantidadeEstoque <= p.estoqueMinimo,
  ).length;

  function abrirEdicao(p: Peca) {
    setEditando({ ...p });
    setDrawerOpen(true);
  }

  function novaPeca() {
    setEditando({
      id: `p-${Date.now()}`,
      codigo: "",
      nome: "",
      categoria: "Iluminação",
      compartimento: "Balcão",
      preco: 0,
      custo: 0,
      quantidadeEstoque: 0,
      estoqueMinimo: 5,
      unidade: "Un",
      ativo: true,
    });
    setDrawerOpen(true);
  }

  function salvar() {
    if (!editando) return;
    if (!editando.nome || !editando.codigo)
      return toast.error("Nome e código são obrigatórios");
    // Mock: na Fase 7 dispara POST/PUT /api/pecas
    toast.success(`${editando.nome} salvo`);
    setDrawerOpen(false);
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Peças" subtitle="Carregando..." />
        <TableSkeleton rows={8} cols={7} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Peças"
        subtitle={`${filtradas.length} peças · ${num(filtradas.reduce((s, p) => s + p.quantidadeEstoque, 0))} em estoque · ${brl(valorTotal)}`}
        actions={
          <Button size="sm" onClick={novaPeca}>
            <Plus size={14} />
            Nova peça
          </Button>
        }
      />

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, código ou compartimento..."
            className="pl-9"
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="h-9 rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
        >
          <option value="">Todas categorias</option>
          {CATEGORIAS_PECAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {abaixoMin > 0 && (
          <StatusBadge tone="warn" size="md" dot>
            {abaixoMin} abaixo do mínimo
          </StatusBadge>
        )}
      </div>

      {/* Tabela */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-2.5">Código</th>
                <th className="px-4 py-2.5">Nome</th>
                <th className="px-4 py-2.5">Categoria</th>
                <th className="px-4 py-2.5">Local</th>
                <th className="px-4 py-2.5 text-right">Estoque</th>
                <th className="px-4 py-2.5 text-right">Preço</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="stagger-rows">
              {filtradas.map((p) => {
                const st = statusEstoque(p);
                const mg = margem(p);
                return (
                  <tr
                    key={p.id}
                    onClick={() => abrirEdicao(p)}
                    className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-[var(--glass-bg-hover)]"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-semibold tabular text-[var(--wrench-accent)]">
                        {p.codigo}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm font-medium text-foreground">
                        {p.nome}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] text-muted-foreground">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {p.compartimento}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm text-foreground">
                        {p.quantidadeEstoque}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {" "}{p.unidade}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm font-medium text-foreground">
                        {brl(p.preco)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={st.tone} size="sm">
                        {st.label}
                      </StatusBadge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtradas.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhuma peça encontrada.
          </div>
        )}
      </GlassCard>

      {/* Drawer de edição */}
      <AnimatePresence>
        {drawerOpen && editando && (
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
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--wrench-accent-soft)]">
                    <Package size={16} className="text-[var(--wrench-accent)]" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      {PECAS_CATALOGO_MOCK.find((p) => p.id === editando.id)
                        ? "Editar peça"
                        : "Nova peça"}
                    </h2>
                    {editando.codigo && (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {editando.codigo}
                      </p>
                    )}
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

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Código" className="col-span-1">
                    <Input
                      value={editando.codigo}
                      onChange={(e) =>
                        setEditando({ ...editando, codigo: e.target.value.toUpperCase() })
                      }
                      placeholder="H4-12"
                    />
                  </Field>
                  <Field label="Categoria" className="col-span-1">
                    <select
                      value={editando.categoria}
                      onChange={(e) =>
                        setEditando({ ...editando, categoria: e.target.value })
                      }
                      className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                    >
                      {CATEGORIAS_PECAS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Nome" className="col-span-2">
                    <Input
                      value={editando.nome}
                      onChange={(e) =>
                        setEditando({ ...editando, nome: e.target.value })
                      }
                      placeholder="Lâmpada H4 12V"
                    />
                  </Field>

                  <Field label="Compartimento" className="col-span-1">
                    <Input
                      value={editando.compartimento}
                      onChange={(e) =>
                        setEditando({ ...editando, compartimento: e.target.value })
                      }
                      placeholder="Gaveta 1"
                    />
                  </Field>
                  <Field label="Unidade" className="col-span-1">
                    <select
                      value={editando.unidade}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          unidade: e.target.value as Peca["unidade"],
                        })
                      }
                      className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                    >
                      {Object.entries(UNIDADE_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Separator className="col-span-2 my-1" />

                  <Field label="Preço venda" className="col-span-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={editando.preco}
                      onChange={(e) =>
                        setEditando({ ...editando, preco: Number(e.target.value) })
                      }
                      className="tabular"
                    />
                  </Field>
                  <Field label="Custo" className="col-span-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={editando.custo ?? 0}
                      onChange={(e) =>
                        setEditando({ ...editando, custo: Number(e.target.value) })
                      }
                      className="tabular"
                    />
                  </Field>

                  <Field label="Estoque atual" className="col-span-1">
                    <Input
                      type="number"
                      value={editando.quantidadeEstoque}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          quantidadeEstoque: Number(e.target.value),
                        })
                      }
                      className="tabular"
                    />
                  </Field>
                  <Field label="Estoque mínimo" className="col-span-1">
                    <Input
                      type="number"
                      value={editando.estoqueMinimo}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          estoqueMinimo: Number(e.target.value),
                        })
                      }
                      className="tabular"
                    />
                  </Field>

                  {/* Margem calculada */}
                  {margem(editando) !== null && (
                    <div className="col-span-2 flex items-center justify-between rounded-xl border border-line bg-card-2 p-3">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <TrendingUp size={13} />
                        Margem
                      </span>
                      <span className="tabular text-sm font-semibold text-[var(--status-ok)]">
                        {pct(margem(editando)!, 1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-2 border-t border-line p-4">
                <Button variant="glass" onClick={() => setDrawerOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={salvar} className="flex-1">
                  Salvar
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
