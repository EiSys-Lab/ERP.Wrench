"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/atoms/status-badge";
import {
  type VendaItem,
  type VendaForma,
  VENDA_FORMA_LABEL,
} from "../types";
import { VENDAS_MOCK } from "../mock";
import { PECAS_CATALOGO_MOCK } from "@/features/catalogo/mock";
import { brl, num, formatDateTime } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Wrench BalcaoView — PDV simplificado (venda avulsa de peças).
 * Lado esquerdo: busca + seleção de peças. Lado direito: carrinho + total + finalizar.
 */
export function BalcaoView() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState<VendaItem[]>([]);
  const [forma, setForma] = useState<VendaForma>("Dinheiro");

  const pecasFiltradas = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return PECAS_CATALOGO_MOCK.slice(0, 6);
    return PECAS_CATALOGO_MOCK.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        p.nome.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [busca]);

  const total = carrinho.reduce((s, i) => s + i.subtotal, 0);

  function adicionar(pecaId: string) {
    const peca = PECAS_CATALOGO_MOCK.find((p) => p.id === pecaId);
    if (!peca) return;
    const existente = carrinho.find((i) => i.pecaCodigo === peca.codigo);
    if (existente) {
      setCarrinho((prev) =>
        prev.map((i) =>
          i.pecaCodigo === peca.codigo
            ? {
                ...i,
                quantidade: i.quantidade + 1,
                subtotal: (i.quantidade + 1) * i.precoUnitario,
              }
            : i,
        ),
      );
    } else {
      setCarrinho((prev) => [
        ...prev,
        {
          id: `i-${Date.now()}`,
          pecaCodigo: peca.codigo,
          pecaNome: peca.nome,
          quantidade: 1,
          precoUnitario: peca.preco,
          subtotal: peca.preco,
        },
      ]);
    }
    setBusca("");
  }

  function removerItem(id: string) {
    setCarrinho((prev) => prev.filter((i) => i.id !== id));
  }

  function finalizar() {
    if (carrinho.length === 0) return toast.error("Carrinho vazio");
    // Mock: na Fase 7 dispara POST /api/vendas
    toast.success(`Venda finalizada — ${brl(total)} (${VENDA_FORMA_LABEL[forma]})`);
    setCarrinho([]);
  }

  const vendasHoje = VENDAS_MOCK;

  return (
    <>
      <PageHeader
        title="Vendas de Balcão"
        subtitle="Venda avulsa de peças sem OS"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Coluna esquerda — busca + peças */}
        <div className="space-y-4 lg:col-span-2">
          <motion.div {...fadeUp(0)}>
            <GlassCard className="p-5">
              <div className="relative mb-3">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar peça por código ou nome..."
                  className="pl-9"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {pecasFiltradas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => adicionar(p.id)}
                    className="flex flex-col items-start rounded-xl border border-line bg-card-2 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--glass-border-hover)] hover:shadow-soft-md"
                  >
                    <span className="font-mono text-[11px] font-semibold text-[var(--wrench-accent)]">
                      {p.codigo}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs font-medium text-foreground">
                      {p.nome}
                    </span>
                    <div className="mt-1.5 flex w-full items-center justify-between">
                      <span className="tabular text-sm font-bold text-foreground">
                        {brl(p.preco)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {p.quantidadeEstoque} un
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {pecasFiltradas.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Nenhuma peça encontrada para &ldquo;{busca}&rdquo;.
                </p>
              )}
            </GlassCard>
          </motion.div>

          {/* Vendas recentes */}
          <motion.div {...fadeUp(0.1)}>
            <GlassCard className="p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Vendas de hoje ({vendasHoje.length})
              </h2>
              <div className="space-y-1.5">
                {vendasHoje.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[var(--glass-bg-hover)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{v.numero}
                      </span>
                      <span className="text-sm text-foreground">
                        {v.itens.length} {v.itens.length === 1 ? "item" : "itens"}
                      </span>
                      <StatusBadge tone="ok" size="sm">{VENDA_FORMA_LABEL[v.formaPagamento]}</StatusBadge>
                    </div>
                    <span className="tabular text-sm font-semibold text-foreground">
                      {brl(v.total)}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Coluna direita — carrinho */}
        <motion.div {...fadeUp(0.15)} className="lg:sticky lg:top-0 lg:self-start">
          <GlassCard className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShoppingCart size={15} className="text-[var(--wrench-accent)]" />
              Carrinho ({carrinho.length})
            </h2>

            {carrinho.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Adicione peças clicando nos cards ao lado
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {carrinho.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between rounded-lg border border-line bg-card-2 p-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">
                          {item.pecaNome}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.quantidade}× {brl(item.precoUnitario)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="tabular text-sm font-semibold text-foreground">
                          {brl(item.subtotal)}
                        </span>
                        <button
                          onClick={() => removerItem(item.id)}
                          aria-label="Remover"
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-[var(--status-alert)]"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {carrinho.length > 0 && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="gradient-text text-xl font-bold tabular">
                    {brl(total)}
                  </span>
                </div>

                {/* Forma de pagamento */}
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {(Object.keys(VENDA_FORMA_LABEL) as VendaForma[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setForma(f)}
                      className={cn(
                        "rounded-lg border py-1.5 text-[11px] font-medium transition-colors",
                        forma === f
                          ? "border-[var(--wrench-accent)] bg-[var(--wrench-accent-soft)] text-[var(--wrench-accent)]"
                          : "border-line text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {VENDA_FORMA_LABEL[f]}
                    </button>
                  ))}
                </div>

                <Button onClick={finalizar} className="mt-3 w-full">
                  Finalizar venda
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/15">
                    <ArrowRight size={12} />
                  </span>
                </Button>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
