/**
 * Wrench — Tipos do Dashboard.
 *
 * Dados agregados para KPIs e gráficos. Na Fase 7 vem de
 * GET /api/dashboard (query de agregação no backend).
 */

export type DashboardKpi = {
  faturamentoMes: number;
  faturamentoAnterior: number;
  osAbertas: number;
  osConcluidasMes: number;
  pecasEstoque: number;
  pecasAbaixoMinimo: number;
  maoDeObraMes: number;
  ticketMedio: number;
};

export type FaturamentoPonto = {
  /** Label do mês ("Jul", "Ago"). */
  mes: string;
  pecas: number;
  maoDeObra: number;
};

export type OsPorStatus = {
  status: string;
  quantidade: number;
};

export type TopItem = {
  nome: string;
  quantidade: number;
  receita: number;
};

export type DashboardData = {
  kpis: DashboardKpi;
  faturamento: FaturamentoPonto[];
  osPorStatus: OsPorStatus[];
  topPecas: TopItem[];
  topServicos: TopItem[];
};
