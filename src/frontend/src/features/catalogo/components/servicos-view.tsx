"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, X, Wrench, Clock } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import { type Servico } from "../types";
import {
  SERVICOS_CATALOGO_MOCK,
  CATEGORIAS_SERVICOS,
} from "../mock";
import { brl } from "@/lib/formatters";
import { SPRING_DRAWER } from "@/lib/motion";
import { toast } from "sonner";

/**
 * Wrench ServicosView — catálogo de serviços (mão de obra).
 */
export function ServicosView() {
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Servico | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return SERVICOS_CATALOGO_MOCK;
    return SERVICOS_CATALOGO_MOCK.filter(
      (s) =>
        s.nome.toLowerCase().includes(q) ||
        s.codigo.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q),
    );
  }, [busca]);

  function abrirEdicao(s: Servico) {
    setEditando({ ...s });
    setDrawerOpen(true);
  }

  function novo() {
    setEditando({
      id: `s-${Date.now()}`,
      codigo: "",
      nome: "",
      categoria: "Instalação",
      valorBase: 0,
      tempoEstimadoMin: 30,
      ativo: true,
    });
    setDrawerOpen(true);
  }

  function salvar() {
    if (!editando) return;
    if (!editando.nome || !editando.codigo)
      return toast.error("Nome e código são obrigatórios");
    toast.success(`${editando.nome} salvo`);
    setDrawerOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Serviços"
        subtitle={`${filtrados.length} serviços de mão de obra`}
        actions={
          <Button size="sm" onClick={novo}>
            <Plus size={14} />
            Novo serviço
          </Button>
        }
      />

      {/* Busca */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar serviço..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabela */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-2.5">Código</th>
                <th className="px-4 py-2.5">Serviço</th>
                <th className="px-4 py-2.5">Categoria</th>
                <th className="px-4 py-2.5">Tempo</th>
                <th className="px-4 py-2.5 text-right">Valor base</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="stagger-rows">
              {filtrados.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => abrirEdicao(s)}
                  className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-[var(--glass-bg-hover)]"
                >
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-xs font-semibold tabular text-[var(--status-warn)]">
                      {s.codigo}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-sm font-medium text-foreground">
                      {s.nome}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] text-muted-foreground">
                      {s.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock size={11} />
                      {s.tempoEstimadoMin ? `${s.tempoEstimadoMin}min` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="tabular text-sm font-medium text-foreground">
                      {brl(s.valorBase)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge tone={s.ativo ? "ok" : "muted"} size="sm">
                      {s.ativo ? "Ativo" : "Inativo"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum serviço encontrado.
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
              <div className="flex items-start justify-between border-b border-line p-5">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--status-warn)_14%,transparent)]">
                    <Wrench size={16} className="text-[var(--status-warn)]" />
                  </span>
                  <h2 className="text-sm font-semibold text-foreground">
                    {SERVICOS_CATALOGO_MOCK.find((s) => s.id === editando.id)
                      ? "Editar serviço"
                      : "Novo serviço"}
                  </h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Código" className="col-span-1">
                    <Input
                      value={editando.codigo}
                      onChange={(e) =>
                        setEditando({ ...editando, codigo: e.target.value.toUpperCase() })
                      }
                      placeholder="MO-001"
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
                      {CATEGORIAS_SERVICOS.map((c) => (
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
                      placeholder="Socorro — básico"
                    />
                  </Field>

                  <Separator className="col-span-2 my-1" />

                  <Field label="Valor base (R$)" className="col-span-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={editando.valorBase}
                      onChange={(e) =>
                        setEditando({ ...editando, valorBase: Number(e.target.value) })
                      }
                      className="tabular"
                    />
                  </Field>
                  <Field label="Tempo estimado (min)" className="col-span-1">
                    <Input
                      type="number"
                      value={editando.tempoEstimadoMin ?? 0}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          tempoEstimadoMin: Number(e.target.value),
                        })
                      }
                      className="tabular"
                    />
                  </Field>
                </div>
              </div>

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
