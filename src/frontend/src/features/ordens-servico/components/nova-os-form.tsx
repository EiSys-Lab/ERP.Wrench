"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Package, Plus, Trash2, Wrench, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { brl } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";
import { type OsItem } from "../types";
import {
  CLIENTES_MOCK,
  VEICULOS_POR_CLIENTE_MOCK,
  PECAS_MOCK,
  SERVICOS_MOCK,
} from "../mock";

/**
 * Wrench NovaOsForm — formulário de criação de Ordem de Serviço.
 *
 * Fluxo: seleciona cliente → veículo → adiciona peças e serviços →
 * totais calculados em tempo real → salvar (mock).
 *
 * Mapeamento do Excel:
 * - Peça = linha com código (col A) + nome (col C) + qtd (col E) + preço (col F)
 *   → subtotal = qtd × preço (col H =PRODUCT)
 * - Serviço = linha "M.O" → valor vai direto p/ mãoDeObra (col I)
 * - totalGeral = Σ(peças) + Σ(M.O) (equivale ao total do mês, col M)
 */
export function NovaOsForm() {
  const router = useRouter();

  const [clienteId, setClienteId] = useState("");
  const [veiculoPlaca, setVeiculoPlaca] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<OsItem[]>([]);

  // Selects de adição
  const [pecaSel, setPecaSel] = useState("");
  const [pecaQtd, setPecaQtd] = useState(1);
  const [servicoSel, setServicoSel] = useState("");

  const veiculos = clienteId
    ? VEICULOS_POR_CLIENTE_MOCK[clienteId] ?? []
    : [];

  const totais = useMemo(() => {
    const totalPecas = itens
      .filter((i) => i.tipo === "Peca")
      .reduce((s, i) => s + i.subtotal, 0);
    const totalMaoDeObra = itens.reduce((s, i) => s + i.maoDeObra, 0);
    return {
      totalPecas,
      totalMaoDeObra,
      totalGeral: totalPecas + totalMaoDeObra,
    };
  }, [itens]);

  function adicionarPeca() {
    const peca = PECAS_MOCK.find((p) => p.id === pecaSel);
    if (!peca || pecaQtd < 1) return;
    const subtotal = pecaQtd * peca.preco;
    setItens((prev) => [
      ...prev,
      {
        id: `it-${Date.now()}`,
        tipo: "Peca",
        pecaId: peca.id,
        nome: peca.nome,
        codigo: peca.codigo,
        compartimento: peca.compartimento,
        quantidade: pecaQtd,
        precoUnitario: peca.preco,
        subtotal,
        maoDeObra: 0,
        valorFinal: subtotal,
      },
    ]);
    setPecaSel("");
    setPecaQtd(1);
    toast.success(`${peca.nome} adicionada`);
  }

  function adicionarServico() {
    const servico = SERVICOS_MOCK.find((s) => s.id === servicoSel);
    if (!servico) return;
    setItens((prev) => [
      ...prev,
      {
        id: `it-${Date.now()}`,
        tipo: "Servico",
        servicoId: servico.id,
        nome: servico.nome,
        quantidade: 1,
        precoUnitario: 0,
        subtotal: 0,
        maoDeObra: servico.valorBase,
        valorFinal: servico.valorBase,
      },
    ]);
    setServicoSel("");
    toast.success(`${servico.nome} adicionado`);
  }

  function removerItem(id: string) {
    setItens((prev) => prev.filter((i) => i.id !== id));
  }

  function handleSalvar() {
    if (!clienteId) return toast.error("Selecione um cliente");
    if (!veiculoPlaca) return toast.error("Selecione um veículo");
    if (itens.length === 0) return toast.error("Adicione ao menos um item");

    // Mock: na Fase 7 dispara POST /api/ordens-servico
    toast.success(`OS criada — ${itens.length} itens · ${brl(totais.totalGeral)}`);
    router.push("/ordens-servico/kanban");
  }

  return (
    <>
      <PageHeader
        title="Nova Ordem de Serviço"
        subtitle="Abra uma OS com cliente, veículo, peças e mão de obra"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Coluna esquerda — formulário */}
        <div className="space-y-4 lg:col-span-2">
          {/* Cliente + Veículo */}
          <motion.div {...fadeUp(0)}>
            <GlassCard hover className="p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">
                Cliente e veículo
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Cliente">
                  <select
                    value={clienteId}
                    onChange={(e) => {
                      setClienteId(e.target.value);
                      setVeiculoPlaca("");
                    }}
                    className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                  >
                    <option value="">Selecione...</option>
                    {CLIENTES_MOCK.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Veículo">
                  <select
                    value={veiculoPlaca}
                    onChange={(e) => setVeiculoPlaca(e.target.value)}
                    disabled={!clienteId}
                    className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)] disabled:opacity-50"
                  >
                    <option value="">
                      {clienteId ? "Selecione..." : "Escolha um cliente primeiro"}
                    </option>
                    {veiculos.map((v) => (
                      <option key={v.placa} value={v.placa}>
                        {v.placa} · {v.modelo}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Mecânico responsável">
                  <Input
                    value={mecanico}
                    onChange={(e) => setMecanico(e.target.value)}
                    placeholder="Ex: Mario"
                  />
                </Field>
              </div>
            </GlassCard>
          </motion.div>

          {/* Adicionar itens */}
          <motion.div {...fadeUp(0.1)}>
            <GlassCard hover className="p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">
                Itens da OS
              </h2>

              {/* Adicionar peça */}
              <div className="mb-3 rounded-xl border border-line bg-card-2 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--wrench-accent)]">
                  <Package size={11} /> Peça
                </p>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[180px] flex-1">
                    <select
                      value={pecaSel}
                      onChange={(e) => setPecaSel(e.target.value)}
                      className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                    >
                      <option value="">Selecione uma peça...</option>
                      {PECAS_MOCK.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.codigo} · {p.nome} ({brl(p.preco)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      min={1}
                      value={pecaQtd}
                      onChange={(e) => setPecaQtd(Number(e.target.value))}
                      className="text-center tabular"
                    />
                  </div>
                  <Button size="sm" variant="glass" onClick={adicionarPeca} disabled={!pecaSel}>
                    <Plus size={14} /> Peça
                  </Button>
                </div>
              </div>

              {/* Adicionar serviço */}
              <div className="rounded-xl border border-line bg-card-2 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--status-warn)]">
                  <Wrench size={11} /> Mão de obra
                </p>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[180px] flex-1">
                    <select
                      value={servicoSel}
                      onChange={(e) => setServicoSel(e.target.value)}
                      className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                    >
                      <option value="">Selecione um serviço...</option>
                      {SERVICOS_MOCK.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nome} ({brl(s.valorBase)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button size="sm" variant="glass" onClick={adicionarServico} disabled={!servicoSel}>
                    <Plus size={14} /> M.O
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Lista de itens adicionados */}
          {itens.length > 0 && (
            <motion.div {...fadeUp(0.2)}>
              <GlassCard className="p-5">
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Itens adicionados ({itens.length})
                </h2>
                <div className="space-y-2">
                  <AnimatePresence>
                    {itens.map((it) => (
                      <motion.div
                        key={it.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between rounded-lg border border-line bg-card-2 p-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          {it.tipo === "Peca" ? (
                            <Package size={13} className="shrink-0 text-[var(--wrench-accent)]" />
                          ) : (
                            <Wrench size={13} className="shrink-0 text-[var(--status-warn)]" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {it.nome}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {it.tipo === "Peca"
                                ? `${it.quantidade}× ${brl(it.precoUnitario)}`
                                : "Mão de obra"}
                              {it.compartimento ? ` · ${it.compartimento}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-semibold tabular text-foreground">
                            {brl(it.valorFinal)}
                          </span>
                          <button
                            onClick={() => removerItem(it.id)}
                            aria-label="Remover"
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-[var(--status-alert)]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* Coluna direita — totais + observações */}
        <motion.div {...fadeUp(0.15)} className="lg:sticky lg:top-0 lg:self-start">
          <GlassCard className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Resumo</h2>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Peças</span>
                <span className="tabular font-medium text-foreground">
                  {brl(totais.totalPecas)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mão de obra</span>
                <span className="tabular font-medium text-foreground">
                  {brl(totais.totalMaoDeObra)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total geral</span>
                <span className="gradient-text text-xl font-bold tabular">
                  {brl(totais.totalGeral)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Field label="Observações">
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  placeholder="Notas sobre a OS..."
                  className="flex w-full rounded-xl border border-line bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
                />
              </Field>
            </div>

            <Button onClick={handleSalvar} className="mt-4 w-full">
              Criar Ordem de Serviço
              <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/15">
                <ArrowRight size={12} />
              </span>
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
