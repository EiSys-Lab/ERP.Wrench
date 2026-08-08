/**
 * Wrench — Mock data do Dashboard.
 *
 * Baseado nos totais reais do Excel (faturamento ~R$80k/mês sendo
 * ~R$48k peças + ~R$32k M.O). Histórico de 6 meses para o gráfico de área.
 */

import type { DashboardData } from "./types";

export const DASHBOARD_MOCK: DashboardData = {
  kpis: {
    faturamentoMes: 80150,
    faturamentoAnterior: 71500,
    osAbertas: 12,
    osConcluidasMes: 127,
    pecasEstoque: 340,
    pecasAbaixoMinimo: 8,
    maoDeObraMes: 31900,
    ticketMedio: 631,
  },
  faturamento: [
    { mes: "Mar", pecas: 38200, maoDeObra: 24800 },
    { mes: "Abr", pecas: 41000, maoDeObra: 26500 },
    { mes: "Mai", pecas: 44800, maoDeObra: 28200 },
    { mes: "Jun", pecas: 42500, maoDeObra: 29800 },
    { mes: "Jul", pecas: 48250, maoDeObra: 31900 },
    { mes: "Ago", pecas: 48250, maoDeObra: 31900 },
  ],
  osPorStatus: [
    { status: "Aberta", quantidade: 4 },
    { status: "Execução", quantidade: 3 },
    { status: "Pronta", quantidade: 2 },
    { status: "Faturada", quantidade: 1 },
    { status: "Entregue", quantidade: 2 },
  ],
  topPecas: [
    { nome: "Lâmpada H4 12V", quantidade: 42, receita: 1260 },
    { nome: "Pingão 24V", quantidade: 38, receita: 380 },
    { nome: "Soquete farol", quantidade: 24, receita: 360 },
    { nome: "Conector 5 vias", quantidade: 18, receita: 468 },
    { nome: "Sinaleira traseira", quantidade: 6, receita: 960 },
  ],
  topServicos: [
    { nome: "Socorro — básico", quantidade: 28, receita: 1680 },
    { nome: "Instalação simples", quantidade: 45, receita: 900 },
    { nome: "Troca de lâmpadas", quantidade: 32, receita: 960 },
    { nome: "Serviço de pátio", quantidade: 14, receita: 1120 },
    { nome: "Socorro — chicote completo", quantidade: 5, receita: 1400 },
  ],
};
