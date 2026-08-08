/**
 * Wrench — Mock de Estoque (movimentos + saldos).
 */

import type { MovimentoEstoque, SaldoEstoque } from "./types";
import { PECAS_CATALOGO_MOCK } from "@/features/catalogo/mock";

/** Saldos derivados do catálogo de peças. */
export const SALDOS_MOCK: SaldoEstoque[] = PECAS_CATALOGO_MOCK.map((p) => ({
  pecaId: p.id,
  codigo: p.codigo,
  nome: p.nome,
  compartimento: p.compartimento,
  quantidade: p.quantidadeEstoque,
  estoqueMinimo: p.estoqueMinimo,
  preco: p.preco,
  valorTotal: p.quantidadeEstoque * p.preco,
}));

/** Movimentos recentes (trilha imutável). */
export const MOVIMENTOS_MOCK: MovimentoEstoque[] = [
  { id: "m-1", pecaId: "p-h4-12", pecaNome: "Lâmpada H4 12V", pecaCodigo: "H4-12", tipo: "Saida", quantidade: 2, saldoAnterior: 11, saldoResultante: 9, documentoOrigem: "OS-0137", operadorNome: "Mario", data: "2026-08-07T16:30:00Z" },
  { id: "m-2", pecaId: "p-sin-tras", pecaNome: "Sinaleira traseira", pecaCodigo: "SIN-TRAS", tipo: "Saida", quantidade: 1, saldoAnterior: 4, saldoResultante: 3, documentoOrigem: "OS-0142", operadorNome: "Mario", data: "2026-08-07T10:00:00Z" },
  { id: "m-3", pecaId: "p-ping-24", pecaNome: "Pingão 24V", pecaCodigo: "PING-24", tipo: "Entrada", quantidade: 20, saldoAnterior: 2, saldoResultante: 22, documentoOrigem: "NF-00482", motivo: "Compra Fornecedor AutoPeças", operadorNome: "Fininho", data: "2026-08-06T09:00:00Z" },
  { id: "m-4", pecaId: "p-h1-24", pecaNome: "Lâmpada H1 24V", pecaCodigo: "H1-24", tipo: "Saida", quantidade: 1, saldoAnterior: 7, saldoResultante: 6, documentoOrigem: "OS-0141", operadorNome: "Mario", data: "2026-08-07T14:10:00Z" },
  { id: "m-5", pecaId: "p-fita-tc", pecaNome: "Fita tecido isolante", pecaCodigo: "FITA-TC", tipo: "AjusteNegativo", quantidade: 10, saldoAnterior: 10, saldoResultante: 0, motivo: "Ajuste de inventário - perda", operadorNome: "Fininho", data: "2026-08-05T17:00:00Z" },
  { id: "m-6", pecaId: "p-ter-bat", pecaNome: "Terminal de bateria", pecaCodigo: "TER-BAT", tipo: "Saida", quantidade: 2, saldoAnterior: 22, saldoResultante: 20, documentoOrigem: "OS-0136", operadorNome: "Mario", data: "2026-08-07T13:50:00Z" },
  { id: "m-7", pecaId: "p-c5v", pecaNome: "Conector 5 vias", pecaCodigo: "C5V", tipo: "Saida", quantidade: 1, saldoAnterior: 16, saldoResultante: 15, documentoOrigem: "OS-0142", operadorNome: "Mario", data: "2026-08-06T09:35:00Z" },
  { id: "m-8", pecaId: "p-soq-far", pecaNome: "Soquete farol", pecaCodigo: "SOQ-FAR", tipo: "Saida", quantidade: 2, saldoAnterior: 13, saldoResultante: 11, documentoOrigem: "OS-0137", operadorNome: "Mario", data: "2026-08-03T11:20:00Z" },
];
