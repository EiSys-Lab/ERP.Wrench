/**
 * Wrench — Tipos do Financeiro.
 * Batem com agregados LancamentoFinanceiro/CaixaTurno do futuro backend C#.
 */

export type TipoLancamento = "Receber" | "Pagar";

export type LancamentoStatus =
  | "Pendente"
  | "Pago"
  | "Parcial"
  | "Atrasado"
  | "Cancelado";

export type FormaPagamento =
  | "Dinheiro"
  | "Pix"
  | "Debito"
  | "Credito"
  | "Boleto"
  | "Prazo";

export type Lancamento = {
  id: string;
  tipo: TipoLancamento;
  descricao: string;
  /** Origem: "OS-0142" ou "Compra Fornecedor". */
  documentoOrigem?: string;
  clienteNome?: string;
  fornecedorNome?: string;
  categoria: string;
  valor: number;
  valorPago: number;
  status: LancamentoStatus;
  formaPagamento?: FormaPagamento;
  emissao: string;
  vencimento: string;
  pagoEm?: string;
};

export type FluxoPonto = {
  dia: string;
  entradas: number;
  saidas: number;
};

export type CaixaTurno = {
  id: string;
  numero: number;
  operadorNome: string;
  abertoEm: string;
  fechadoEm?: string;
  saldoInicial: number;
  entradas: number;
  saidas: number;
  saldoFinal?: number;
  status: "Aberto" | "Fechado";
};

export const LANCAMENTO_STATUS_TONE: Record<
  LancamentoStatus,
  "ok" | "warn" | "alert" | "muted"
> = {
  Pago: "ok",
  Parcial: "warn",
  Pendente: "alert",
  Atrasado: "alert",
  Cancelado: "muted",
};

export const FORMA_LABEL: Record<FormaPagamento, string> = {
  Dinheiro: "Dinheiro",
  Pix: "PIX",
  Debito: "Débito",
  Credito: "Crédito",
  Boleto: "Boleto",
  Prazo: "A prazo",
};

export const CATEGORIAS_RECEITA = [
  "Ordem de Serviço",
  "Venda Balcão",
  "Serviço Avulso",
  "Outros",
];

export const CATEGORIAS_DESPESA = [
  "Compra de Peças",
  "Aluguel",
  "Energia",
  "Salários",
  "Impostos",
  "Manutenção",
  "Outros",
];
