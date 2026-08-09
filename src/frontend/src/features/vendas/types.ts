/**
 * Wrench — Tipos de Vendas (balcão) e Caixa.
 */

export type VendaItem = {
  id: string;
  pecaCodigo: string;
  pecaNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

export type VendaStatus = "EmAndamento" | "Concluida" | "Cancelada";

export type VendaForma = "Dinheiro" | "Pix" | "Debito" | "Credito";

export type Venda = {
  id: string;
  numero: number;
  itens: VendaItem[];
  total: number;
  formaPagamento: VendaForma;
  status: VendaStatus;
  operadorNome: string;
  data: string;
};

export type MovimentoCaixa = {
  id: string;
  tipo: "Sangria" | "Suprimento";
  valor: number;
  motivo: string;
  data: string;
};

export const VENDA_FORMA_LABEL: Record<VendaForma, string> = {
  Dinheiro: "Dinheiro",
  Pix: "PIX",
  Debito: "Débito",
  Credito: "Crédito",
};

export const VENDA_STATUS_TONE: Record<
  VendaStatus,
  "ok" | "warn" | "alert"
> = {
  Concluida: "ok",
  EmAndamento: "warn",
  Cancelada: "alert",
};
