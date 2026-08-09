/**
 * Wrench — Mock de Vendas e Caixa.
 */

import type { Venda, MovimentoCaixa } from "./types";

export const VENDAS_MOCK: Venda[] = [
  { id: "vd-1", numero: 582, itens: [{ id: "i1", pecaCodigo: "H4-12", pecaNome: "Lâmpada H4 12V", quantidade: 1, precoUnitario: 30, subtotal: 30 }], total: 30, formaPagamento: "Dinheiro", status: "Concluida", operadorNome: "Fininho", data: "2026-08-07T09:15:00Z" },
  { id: "vd-2", numero: 583, itens: [{ id: "i2", pecaCodigo: "PING-24", pecaNome: "Pingão 24V", quantidade: 3, precoUnitario: 10, subtotal: 30 }, { id: "i3", pecaCodigo: "FITA-TC", pecaNome: "Fita isolante", quantidade: 1, precoUnitario: 8, subtotal: 8 }], total: 38, formaPagamento: "Pix", status: "Concluida", operadorNome: "Fininho", data: "2026-08-07T10:30:00Z" },
  { id: "vd-3", numero: 584, itens: [{ id: "i4", pecaCodigo: "TER-BAT", pecaNome: "Terminal de bateria", quantidade: 1, precoUnitario: 18, subtotal: 18 }], total: 18, formaPagamento: "Dinheiro", status: "Concluida", operadorNome: "Fininho", data: "2026-08-07T11:45:00Z" },
  { id: "vd-4", numero: 585, itens: [{ id: "i5", pecaCodigo: "H7", pecaNome: "Lâmpada H7 12V", quantidade: 2, precoUnitario: 32, subtotal: 64 }], total: 64, formaPagamento: "Credito", status: "Concluida", operadorNome: "Fininho", data: "2026-08-07T14:00:00Z" },
  { id: "vd-5", numero: 586, itens: [{ id: "i6", pecaCodigo: "SIR-RE", pecaNome: "Sirene de ré", quantidade: 1, precoUnitario: 40, subtotal: 40 }], total: 40, formaPagamento: "Pix", status: "Concluida", operadorNome: "Fininho", data: "2026-08-07T15:20:00Z" },
];

export const MOVIMENTOS_CAIXA_MOCK: MovimentoCaixa[] = [
  { id: "mc-1", tipo: "Suprimento", valor: 200, motivo: "Troco inicial adicional", data: "2026-08-07T08:30:00Z" },
  { id: "mc-2", tipo: "Sangria", valor: 80, motivo: "Pagamento M.O Mario (socorro)", data: "2026-08-07T12:00:00Z" },
];
