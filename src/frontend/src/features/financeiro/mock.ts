/**
 * Wrench — Mock do Financeiro.
 * Lançamentos a receber/pagar baseados nas OS + despesas típicas de oficina.
 */

import type { Lancamento, FluxoPonto, CaixaTurno } from "./types";

export const LANCAMENTOS_MOCK: Lancamento[] = [
  // ── A receber (origem OS) ──
  { id: "l-1", tipo: "Receber", descricao: "OS #0142 — FRIGO", documentoOrigem: "OS-0142", clienteNome: "FRIGO Transportes", categoria: "Ordem de Serviço", valor: 346, valorPago: 0, status: "Pendente", formaPagamento: "Boleto", emissao: "2026-08-06", vencimento: "2026-08-20" },
  { id: "l-2", tipo: "Receber", descricao: "OS #0141 — ELIANE", documentoOrigem: "OS-0141", clienteNome: "Eliane Silva", categoria: "Ordem de Serviço", valor: 80, valorPago: 0, status: "Pendente", formaPagamento: "Dinheiro", emissao: "2026-08-07", vencimento: "2026-08-07" },
  { id: "l-3", tipo: "Receber", descricao: "OS #0140 — BIROLO", documentoOrigem: "OS-0140", clienteNome: "Birolo Auto", categoria: "Ordem de Serviço", valor: 158, valorPago: 158, status: "Pago", formaPagamento: "Pix", emissao: "2026-08-05", vencimento: "2026-08-05", pagoEm: "2026-08-05" },
  { id: "l-4", tipo: "Receber", descricao: "OS #0139 — FRAGNANI", documentoOrigem: "OS-0139", clienteNome: "Marcos Fragnani", categoria: "Ordem de Serviço", valor: 35, valorPago: 35, status: "Pago", formaPagamento: "Pix", emissao: "2026-08-04", vencimento: "2026-08-04", pagoEm: "2026-08-04" },
  { id: "l-5", tipo: "Receber", descricao: "OS #0137 — NIVALDO", documentoOrigem: "OS-0137", clienteNome: "Nivaldo Souza", categoria: "Ordem de Serviço", valor: 270, valorPago: 270, status: "Pago", formaPagamento: "Dinheiro", emissao: "2026-08-03", vencimento: "2026-08-03", pagoEm: "2026-08-03" },
  { id: "l-6", tipo: "Receber", descricao: "OS #0135 — RODOWAPI", documentoOrigem: "OS-0135", clienteNome: "Rodowapi Logística", categoria: "Ordem de Serviço", valor: 520, valorPago: 200, status: "Parcial", formaPagamento: "Prazo", emissao: "2026-07-28", vencimento: "2026-08-12" },
  { id: "l-7", tipo: "Receber", descricao: "OS #0130 — CARLINHOS", documentoOrigem: "OS-0130", clienteNome: "Carlinhos Auto Peças", categoria: "Ordem de Serviço", valor: 380, valorPago: 0, status: "Atrasado", formaPagamento: "Boleto", emissao: "2026-07-20", vencimento: "2026-08-03" },

  // ── A pagar (despesas) ──
  { id: "l-8", tipo: "Pagar", descricao: "Compra peças — AutoPeças SC", fornecedorNome: "AutoPeças SC", categoria: "Compra de Peças", valor: 4200, valorPago: 0, status: "Pendente", formaPagamento: "Boleto", emissao: "2026-08-06", vencimento: "2026-08-21" },
  { id: "l-9", tipo: "Pagar", descricao: "Energia elétrica — CPFL", fornecedorNome: "CPFL Energia", categoria: "Energia", valor: 680, valorPago: 0, status: "Pendente", formaPagamento: "Boleto", emissao: "2026-08-05", vencimento: "2026-08-15" },
  { id: "l-10", tipo: "Pagar", descricao: "Aluguel galpão", fornecedorNome: "Imobiliária Centro", categoria: "Aluguel", valor: 2500, valorPago: 2500, status: "Pago", formaPagamento: "Pix", emissao: "2026-08-01", vencimento: "2026-08-05", pagoEm: "2026-08-05" },
  { id: "l-11", tipo: "Pagar", descricao: "Salário Mario", fornecedorNome: "Mario (mecânico)", categoria: "Salários", valor: 3200, valorPago: 0, status: "Pendente", formaPagamento: "Pix", emissao: "2026-08-01", vencimento: "2026-08-10" },
  { id: "l-12", tipo: "Pagar", descricao: "Compra peças — Elétrica Distribuidora", fornecedorNome: "Elétrica Distribuidora", categoria: "Compra de Peças", valor: 1850, valorPago: 1850, status: "Pago", formaPagamento: "Boleto", emissao: "2026-07-25", vencimento: "2026-08-04", pagoEm: "2026-08-04" },
];

/** Fluxo de caixa dos últimos 15 dias (entradas vs saídas). */
export const FLUXO_MOCK: FluxoPonto[] = [
  { dia: "25/07", entradas: 270, saidas: 1850 },
  { dia: "26/07", entradas: 0, saidas: 0 },
  { dia: "27/07", entradas: 480, saidas: 320 },
  { dia: "28/07", entradas: 520, saidas: 0 },
  { dia: "29/07", entradas: 0, saidas: 680 },
  { dia: "30/07", entradas: 950, saidas: 0 },
  { dia: "31/07", entradas: 1280, saidas: 2500 },
  { dia: "01/08", entradas: 0, saidas: 3200 },
  { dia: "02/08", entradas: 350, saidas: 0 },
  { dia: "03/08", entradas: 270, saidas: 0 },
  { dia: "04/08", entradas: 35, saidas: 1850 },
  { dia: "05/08", entradas: 158, saidas: 3180 },
  { dia: "06/08", entradas: 0, saidas: 4200 },
  { dia: "07/08", entradas: 80, saidas: 0 },
];

/** Turno de caixa atual. */
export const CAIXA_TURNO_MOCK: CaixaTurno = {
  id: "cx-1",
  numero: 187,
  operadorNome: "Fininho",
  abertoEm: "2026-08-07T08:00:00Z",
  saldoInicial: 500,
  entradas: 238,
  saidas: 80,
  saldoFinal: 658,
  status: "Aberto",
};
