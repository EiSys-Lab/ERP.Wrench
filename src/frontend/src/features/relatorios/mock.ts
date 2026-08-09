/** Wrench — Mock de Relatórios. */

import type { FaturamentoMensal, FaturamentoPorCliente, KpiRelatorio } from "./types";

export const FATURAMENTO_MENSAL_MOCK: FaturamentoMensal[] = [
  { mes: "Jan", pecas: 35200, maoDeObra: 22100, os: 98 },
  { mes: "Fev", pecas: 33800, maoDeObra: 21500, os: 92 },
  { mes: "Mar", pecas: 38200, maoDeObra: 24800, os: 105 },
  { mes: "Abr", pecas: 41000, maoDeObra: 26500, os: 112 },
  { mes: "Mai", pecas: 44800, maoDeObra: 28200, os: 118 },
  { mes: "Jun", pecas: 42500, maoDeObra: 29800, os: 115 },
  { mes: "Jul", pecas: 48250, maoDeObra: 31900, os: 127 },
  { mes: "Ago", pecas: 48250, maoDeObra: 31900, os: 127 },
];

export const FATURAMENTO_POR_CLIENTE_MOCK: FaturamentoPorCliente[] = [
  { cliente: "FRIGO Transportes", receita: 14250, os: 28 },
  { cliente: "Birolo Auto", receita: 8120, os: 22 },
  { cliente: "Rodowapi Logística", receita: 6450, os: 17 },
  { cliente: "Carlinhos Auto Peças", receita: 4280, os: 11 },
  { cliente: "Eliane Silva", receita: 3480, os: 14 },
  { cliente: "Nivaldo Souza", receita: 1620, os: 6 },
];

export const KPI_RELATORIO_MOCK: KpiRelatorio = {
  faturamentoAno: 332000,
  faturamentoMes: 80150,
  osAno: 894,
  ticketMedio: 631,
  pecasVendidas: 4280,
  margemMedia: 0.42,
};
