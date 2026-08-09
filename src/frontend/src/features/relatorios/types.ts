/** Wrench — Tipos de Relatórios. */

export type FaturamentoMensal = {
  mes: string;
  pecas: number;
  maoDeObra: number;
  os: number;
};

export type FaturamentoPorCliente = {
  cliente: string;
  receita: number;
  os: number;
};

export type KpiRelatorio = {
  faturamentoAno: number;
  faturamentoMes: number;
  osAno: number;
  ticketMedio: number;
  pecasVendidas: number;
  margemMedia: number;
};
