/**
 * Wrench — Tipos de Estoque.
 * Batem com agregado MovimentoEstoque do futuro backend C#.
 */

export type TipoMovimento =
  | "Entrada"
  | "Saida"
  | "AjustePositivo"
  | "AjusteNegativo"
  | "Transferencia";

export type MovimentoEstoque = {
  id: string;
  pecaId: string;
  pecaNome: string;
  pecaCodigo: string;
  tipo: TipoMovimento;
  quantidade: number;
  saldoAnterior: number;
  saldoResultante: number;
  documentoOrigem?: string;
  motivo?: string;
  operadorNome?: string;
  data: string;
};

export type SaldoEstoque = {
  pecaId: string;
  codigo: string;
  nome: string;
  compartimento: string;
  quantidade: number;
  estoqueMinimo: number;
  preco: number;
  valorTotal: number;
};

export const MOVIMENTO_LABEL: Record<TipoMovimento, string> = {
  Entrada: "Entrada",
  Saida: "Saída",
  AjustePositivo: "Ajuste +",
  AjusteNegativo: "Ajuste -",
  Transferencia: "Transferência",
};

export const MOVIMENTO_TONE: Record<
  TipoMovimento,
  "ok" | "alert" | "warn" | "info" | "muted"
> = {
  Entrada: "ok",
  Saida: "alert",
  AjustePositivo: "info",
  AjusteNegativo: "warn",
  Transferencia: "muted",
};

/** + ou - para exibir na quantidade. */
export function sinalMovimento(tipo: TipoMovimento): string {
  return tipo === "Entrada" || tipo === "AjustePositivo" ? "+" : "-";
}
