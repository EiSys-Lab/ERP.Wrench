/**
 * Wrench — Mock do Catálogo (Peças + Serviços).
 * Peças baseadas no Excel; serviços (M.O) típicos de autoelétrica.
 */

import type { Peca, Servico } from "./types";

export const PECAS_CATALOGO_MOCK: Peca[] = [
  { id: "p-h4-12", codigo: "H4-12", nome: "Lâmpada H4 12V", categoria: "Iluminação", compartimento: "Balcão", preco: 30, custo: 18, quantidadeEstoque: 9, estoqueMinimo: 10, unidade: "Un", codigoBarras: "7891000010019", ncm: "8539.29.90", ativo: true },
  { id: "p-h1-24", codigo: "H1-24", nome: "Lâmpada H1 24V", categoria: "Iluminação", compartimento: "Balcão", preco: 40, custo: 25, quantidadeEstoque: 6, estoqueMinimo: 8, unidade: "Un", codigoBarras: "7891000010026", ncm: "8539.29.90", ativo: true },
  { id: "p-hb4-12", codigo: "HB4-12", nome: "Lâmpada HB4 12V", categoria: "Iluminação", compartimento: "Balcão", preco: 28, custo: 16, quantidadeEstoque: 4, estoqueMinimo: 6, unidade: "Un", ativo: true },
  { id: "p-h7", codigo: "H7", nome: "Lâmpada H7 12V", categoria: "Iluminação", compartimento: "Balcão", preco: 32, custo: 19, quantidadeEstoque: 14, estoqueMinimo: 8, unidade: "Un", ativo: true },
  { id: "p-ping-24", codigo: "PING-24", nome: "Pingão 24V", categoria: "Relé", compartimento: "Gaveta 1", preco: 10, custo: 5, quantidadeEstoque: 22, estoqueMinimo: 15, unidade: "Un", ativo: true },
  { id: "p-ping-12", codigo: "PING-12", nome: "Pingão 12V", categoria: "Relé", compartimento: "Gaveta 1", preco: 22, custo: 12, quantidadeEstoque: 18, estoqueMinimo: 12, unidade: "Un", ativo: true },
  { id: "p-soq-far", codigo: "SOQ-FAR", nome: "Soquete farol", categoria: "Conector", compartimento: "Gaveta 2", preco: 15, custo: 7, quantidadeEstoque: 11, estoqueMinimo: 10, unidade: "Un", ativo: true },
  { id: "p-soq-2p", codigo: "SOQ-2P", nome: "Soquete 2 polos", categoria: "Conector", compartimento: "Gaveta 2", preco: 29, custo: 15, quantidadeEstoque: 7, estoqueMinimo: 10, unidade: "Un", ativo: true },
  { id: "p-c5v", codigo: "C5V", nome: "Conector 5 vias", categoria: "Conector", compartimento: "Gaveta 3", preco: 26, custo: 14, quantidadeEstoque: 15, estoqueMinimo: 10, unidade: "Un", ativo: true },
  { id: "p-sin-tras", codigo: "SIN-TRAS", nome: "Sinaleira traseira", categoria: "Sinalização", compartimento: "Balcão", preco: 160, custo: 95, quantidadeEstoque: 3, estoqueMinimo: 4, unidade: "Un", ativo: true },
  { id: "p-sir-re", codigo: "SIR-RE", nome: "Sirene de ré", categoria: "Sinalização", compartimento: "Balcão", preco: 40, custo: 22, quantidadeEstoque: 5, estoqueMinimo: 6, unidade: "Un", ativo: true },
  { id: "p-ter-bat", codigo: "TER-BAT", nome: "Terminal de bateria", categoria: "Elétrica", compartimento: "Gaveta 5", preco: 18, custo: 9, quantidadeEstoque: 20, estoqueMinimo: 15, unidade: "Par", ativo: true },
  { id: "p-cab-2x1", codigo: "CAB-2X1", nome: "Cabo 2x1", categoria: "Elétrica", compartimento: "Balcão", preco: 14, custo: 8, quantidadeEstoque: 30, estoqueMinimo: 20, unidade: "Metro", ativo: true },
  { id: "p-fita-tc", codigo: "FITA-TC", nome: "Fita tecido isolante", categoria: "Acessório", compartimento: "Balcão", preco: 8, custo: 4, quantidadeEstoque: 0, estoqueMinimo: 10, unidade: "Un", ativo: true },
  { id: "p-emb", codigo: "EMB", nome: "Embuchamento", categoria: "Elétrica", compartimento: "Gaveta 4", preco: 12, custo: 6, quantidadeEstoque: 25, estoqueMinimo: 15, unidade: "Un", ativo: true },
  { id: "p-abrac", codigo: "ABRAC", nome: "Abraçadeiras", categoria: "Acessório", compartimento: "Gaveta 4", preco: 5, custo: 2, quantidadeEstoque: 50, estoqueMinimo: 30, unidade: "Un", ativo: true },
];

export const SERVICOS_CATALOGO_MOCK: Servico[] = [
  { id: "s-socorro-basico", codigo: "MO-001", nome: "Socorro — básico", categoria: "Socorro", valorBase: 60, tempoEstimadoMin: 60, ativo: true },
  { id: "s-socorro-completo", codigo: "MO-002", nome: "Socorro — chicote completo", categoria: "Socorro", valorBase: 280, tempoEstimadoMin: 240, ativo: true },
  { id: "s-oficina-socorro", codigo: "MO-003", nome: "Oficina + socorro", categoria: "Oficina", valorBase: 800, tempoEstimadoMin: 480, ativo: true },
  { id: "s-instalacao", codigo: "MO-004", nome: "Instalação simples", categoria: "Instalação", valorBase: 20, tempoEstimadoMin: 20, ativo: true },
  { id: "s-troca-lampada", codigo: "MO-005", nome: "Troca de lâmpadas", categoria: "Instalação", valorBase: 30, tempoEstimadoMin: 30, ativo: true },
  { id: "s-ajuste-farol", codigo: "MO-006", nome: "Troca + ajuste de farol", categoria: "Instalação", valorBase: 180, tempoEstimadoMin: 90, ativo: true },
  { id: "s-patio", codigo: "MO-007", nome: "Serviço de pátio", categoria: "Oficina", valorBase: 80, tempoEstimadoMin: 60, ativo: true },
  { id: "s-diag", codigo: "MO-008", nome: "Diagnóstico elétrico", categoria: "Diagnóstico", valorBase: 50, tempoEstimadoMin: 45, ativo: true },
];

export const CATEGORIAS_PECAS = [
  "Iluminação",
  "Relé",
  "Conector",
  "Sinalização",
  "Elétrica",
  "Acessório",
];

export const CATEGORIAS_SERVICOS = [
  "Socorro",
  "Oficina",
  "Instalação",
  "Diagnóstico",
];
