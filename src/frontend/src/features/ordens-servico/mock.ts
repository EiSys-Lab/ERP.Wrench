/**
 * Wrench — Mock data de Ordens de Serviço.
 *
 * Dados realistas extraídos do Excel "CONTROLE SAIDA DE PEÇAS FININHO":
 * - Clientes: ELIANE, FRIGO, BIROLO, FRAGNANI, NIVALDO, CARLINHOS, RODOWAPI
 * - Veículos/placas: RFX0H93, OCZ8034, MBQ4884, MLX3E92
 * - Peças: lâmpadas H4/H1/HB4, pingões 24V/12V, soquetes, conectores,
 *   sinaleiras, sirenes, terminais de bateria
 * - M.O: socorro (R$60-800), instalação (R$20-180)
 * - Faturamento médio mensal: ~R$48k peças + ~R$32k M.O
 *
 * Front End First: estes mocks substituídos por TanStack Query na Fase 7.
 */

import type { OrdemServico, OsItem, OsStatus } from "./types";

function item(
  tipo: "Peca" | "Servico",
  nome: string,
  quantidade: number,
  precoUnitario: number,
  maoDeObra: number,
  opts: { codigo?: string; compartimento?: string } = {},
): OsItem {
  const subtotal = quantidade * precoUnitario;
  return {
    id: `it-${Math.random().toString(36).slice(2, 9)}`,
    tipo,
    nome,
    codigo: opts.codigo,
    compartimento: opts.compartimento,
    quantidade,
    precoUnitario,
    subtotal,
    maoDeObra,
    valorFinal: subtotal + maoDeObra,
  };
}

function calcTotais(itens: OsItem[], desconto = 0) {
  const totalPecas = itens
    .filter((i) => i.tipo === "Peca")
    .reduce((s, i) => s + i.subtotal, 0);
  const totalMaoDeObra = itens.reduce((s, i) => s + i.maoDeObra, 0);
  return {
    totalPecas,
    totalMaoDeObra,
    desconto,
    totalGeral: totalPecas + totalMaoDeObra - desconto,
  };
}

export const ORDENS_SERVICO_MOCK: OrdemServico[] = [
  {
    id: "os-0142",
    numero: 142,
    clienteId: "cli-frigo",
    clienteNome: "FRIGO",
    veiculo: { placa: "OCZ8034", modelo: "Scania R450", marca: "Scania", cor: "Branco" },
    mecanicoNome: "Mario",
    status: "EmExecucao",
    itens: [
      item("Peca", "Sinaleira traseira", 1, 160, 0, { codigo: "SIN-TRAS", compartimento: "Balcão" }),
      item("Peca", "Conector 5 vias", 1, 26, 0, { codigo: "C5V", compartimento: "Gaveta 3" }),
      item("Peca", "Sirene de ré", 1, 40, 0, { codigo: "SIR-RE", compartimento: "Balcão" }),
      item("Servico", "Socorro — instalação completa", 1, 0, 120),
    ],
    pagamentos: [],
    ...calcTotais([]),
    totalPecas: 226,
    totalMaoDeObra: 120,
    desconto: 0,
    totalGeral: 346,
    totalPago: 0,
    pagamentoStatus: "Pendente",
    dataEntrada: "2026-08-06T09:30:00Z",
    observacoes: "Caminhão frigorífico — sistema elétrico de ré.",
  },
  {
    id: "os-0141",
    numero: 141,
    clienteId: "cli-eliane",
    clienteNome: "ELIANE",
    veiculo: { placa: "RFX0H93", modelo: "Fiat Uno", marca: "Fiat", ano: 2015 },
    mecanicoNome: "Mario",
    status: "Aberta",
    itens: [
      item("Peca", "Pingão 24V", 1, 10, 0, { codigo: "PING-24", compartimento: "Gaveta 1" }),
      item("Peca", "Lâmpada H1 24V", 1, 40, 0, { codigo: "H1-24", compartimento: "Balcão" }),
      item("Servico", "Troca de lâmpadas", 1, 0, 30),
    ],
    pagamentos: [],
    totalPecas: 50,
    totalMaoDeObra: 30,
    desconto: 0,
    totalGeral: 80,
    totalPago: 0,
    pagamentoStatus: "Pendente",
    dataEntrada: "2026-08-07T14:00:00Z",
  },
  {
    id: "os-0140",
    numero: 140,
    clienteId: "cli-birolo",
    clienteNome: "BIROLO",
    veiculo: { placa: "MBQ4884", modelo: "VW Saveiro", marca: "Volkswagen", ano: 2018, cor: "Prata" },
    mecanicoNome: "Mario",
    status: "Pronta",
    itens: [
      item("Peca", "Soquete 2 polos", 2, 29, 0, { codigo: "SOQ-2P", compartimento: "Gaveta 2" }),
      item("Peca", "Lâmpada 2 polos", 2, 10, 0, { codigo: "LAM-2P", compartimento: "Balcão" }),
      item("Servico", "Serviço de pátio", 1, 0, 80),
    ],
    pagamentos: [],
    totalPecas: 78,
    totalMaoDeObra: 80,
    desconto: 0,
    totalGeral: 158,
    totalPago: 158,
    pagamentoStatus: "Pago",
    dataEntrada: "2026-08-05T10:15:00Z",
    observacoes: "Cliente paga na retirada.",
  },
  {
    id: "os-0139",
    clienteId: "cli-fragnani",
    numero: 139,
    clienteNome: "FRAGNANI",
    veiculo: { placa: "MLX3E92", modelo: "GM Corsa", marca: "Chevrolet", ano: 2012 },
    status: "Faturada",
    itens: [
      item("Peca", "Soquete farol", 1, 15, 0, { codigo: "SOQ-FAR", compartimento: "Gaveta 2" }),
      item("Servico", "Instalação soquete", 1, 0, 20),
    ],
    pagamentos: [
      { id: "pg-1", forma: "Pix", valor: 35, pagoEm: "2026-08-04T16:00:00Z" },
    ],
    totalPecas: 15,
    totalMaoDeObra: 20,
    desconto: 0,
    totalGeral: 35,
    totalPago: 35,
    pagamentoStatus: "Pago",
    dataEntrada: "2026-08-04T15:30:00Z",
    dataSaida: "2026-08-04T16:10:00Z",
  },
  {
    id: "os-0138",
    clienteId: "cli-rodowapi",
    numero: 138,
    clienteNome: "RODOWAPI",
    veiculo: { placa: "RDU2B01", modelo: "Furgão", marca: "Mercedes", ano: 2020 },
    mecanicoNome: "Mario",
    status: "Aberta",
    itens: [
      item("Peca", "Relé pingão 12V", 4, 22, 0, { codigo: "PING-12", compartimento: "Gaveta 1" }),
      item("Peca", "Fita tecido isolante", 2, 8, 0, { codigo: "FITA-TC", compartimento: "Balcão" }),
      item("Peca", "Embuchamento", 3, 12, 0, { codigo: "EMB", compartimento: "Gaveta 4" }),
      item("Servico", "Socorro — chicote completo", 1, 0, 280),
    ],
    pagamentos: [],
    totalPecas: 148,
    totalMaoDeObra: 280,
    desconto: 0,
    totalGeral: 428,
    totalPago: 0,
    pagamentoStatus: "Pendente",
    dataEntrada: "2026-08-07T08:00:00Z",
    observacoes: "Não cobrou em teste — aguardando validação do cliente.",
  },
  {
    id: "os-0137",
    clienteId: "cli-nivaldo",
    numero: 137,
    clienteNome: "NIVALDO",
    veiculo: { placa: "MKO8580", modelo: "VW Fox", marca: "Volkswagen", ano: 2016 },
    status: "Entregue",
    itens: [
      item("Peca", "Lâmpada H4 12V", 2, 30, 0, { codigo: "H4-12", compartimento: "Balcão" }),
      item("Peca", "Soquete farol", 2, 15, 0, { codigo: "SOQ-FAR", compartimento: "Gaveta 2" }),
      item("Servico", "Troca + ajuste de farol", 1, 0, 180),
    ],
    pagamentos: [
      { id: "pg-2", forma: "Dinheiro", valor: 270, pagoEm: "2026-08-03T17:00:00Z" },
    ],
    totalPecas: 90,
    totalMaoDeObra: 180,
    desconto: 0,
    totalGeral: 270,
    totalPago: 270,
    pagamentoStatus: "Pago",
    dataEntrada: "2026-08-03T11:00:00Z",
    dataSaida: "2026-08-03T17:20:00Z",
  },
  {
    id: "os-0136",
    clienteId: "cli-carlinhos",
    numero: 136,
    clienteNome: "CARLINHOS",
    veiculo: { placa: "MKJ5555", modelo: "Fiat Strada", marca: "Fiat", ano: 2021 },
    mecanicoNome: "Mario",
    status: "EmExecucao",
    itens: [
      item("Peca", "Terminal de bateria", 2, 18, 0, { codigo: "TER-BAT", compartimento: "Gaveta 5" }),
      item("Peca", "Cabo 2x1", 3, 14, 0, { codigo: "CAB-2X1", compartimento: "Balcão" }),
      item("Servico", "Socorro — bateria + cabos", 1, 0, 60),
    ],
    pagamentos: [],
    totalPecas: 78,
    totalMaoDeObra: 60,
    desconto: 0,
    totalGeral: 138,
    totalPago: 0,
    pagamentoStatus: "Pendente",
    dataEntrada: "2026-08-07T13:45:00Z",
  },
];

/** Mock de clientes para o formulário Nova OS. */
export const CLIENTES_MOCK = [
  { id: "cli-frigo", nome: "FRIGO", documento: "12.345.678/0001-90" },
  { id: "cli-eliane", nome: "ELIANE", documento: "123.456.789-01" },
  { id: "cli-birolo", nome: "BIROLO", documento: "987.654.321-09" },
  { id: "cli-fragnani", nome: "FRAGNANI", documento: "456.789.123-45" },
  { id: "cli-rodowapi", nome: "RODOWAPI", documento: "23.456.789/0001-01" },
  { id: "cli-nivaldo", nome: "NIVALDO", documento: "321.654.987-10" },
  { id: "cli-carlinhos", nome: "CARLINHOS", documento: "654.321.987-65" },
  { id: "cli-passante", nome: "PASSANTE", documento: "111.222.333-44" },
  { id: "cli-andreia", nome: "ANDREIA", documento: "222.333.444-55" },
];

/** Mock de veículos por cliente. */
export const VEICULOS_POR_CLIENTE_MOCK: Record<string, { placa: string; modelo: string; marca?: string; ano?: number; cor?: string }[]> = {
  "cli-frigo": [{ placa: "OCZ8034", modelo: "Scania R450", marca: "Scania", cor: "Branco" }],
  "cli-eliane": [{ placa: "RFX0H93", modelo: "Fiat Uno", marca: "Fiat", ano: 2015 }],
  "cli-birolo": [
    { placa: "MBQ4884", modelo: "VW Saveiro", marca: "Volkswagen", ano: 2018, cor: "Prata" },
    { placa: "BYH2310", modelo: "Fiat Cronos", marca: "Fiat", ano: 2022 },
  ],
  "cli-fragnani": [{ placa: "MLX3E92", modelo: "GM Corsa", marca: "Chevrolet", ano: 2012 }],
  "cli-rodowapi": [{ placa: "RDU2B01", modelo: "Furgão", marca: "Mercedes", ano: 2020 }],
  "cli-nivaldo": [{ placa: "MKO8580", modelo: "VW Fox", marca: "Volkswagen", ano: 2016 }],
  "cli-carlinhos": [
    { placa: "MKJ5555", modelo: "Fiat Strada", marca: "Fiat", ano: 2021 },
    { placa: "MJX6666", modelo: "Fiat Toro", marca: "Fiat", ano: 2023 },
  ],
  "cli-passante": [{ placa: "SXV8I67", modelo: "Honda CG", marca: "Honda", ano: 2019 }],
  "cli-andreia": [{ placa: "MLY6H92", modelo: "Renault Kwid", marca: "Renault", ano: 2023 }],
};

/** Mock de peças para o formulário Nova OS (catálogo simplificado). */
export const PECAS_MOCK = [
  { id: "p-h4-12", nome: "Lâmpada H4 12V", codigo: "H4-12", preco: 30, compartimento: "Balcão", estoque: 9 },
  { id: "p-h1-24", nome: "Lâmpada H1 24V", codigo: "H1-24", preco: 40, compartimento: "Balcão", estoque: 6 },
  { id: "p-hb4-12", nome: "Lâmpada HB4 12V", codigo: "HB4-12", preco: 28, compartimento: "Balcão", estoque: 4 },
  { id: "p-ping-24", nome: "Pingão 24V", codigo: "PING-24", preco: 10, compartimento: "Gaveta 1", estoque: 22 },
  { id: "p-ping-12", nome: "Pingão 12V", codigo: "PING-12", preco: 22, compartimento: "Gaveta 1", estoque: 18 },
  { id: "p-soq-far", nome: "Soquete farol", codigo: "SOQ-FAR", preco: 15, compartimento: "Gaveta 2", estoque: 11 },
  { id: "p-soq-2p", nome: "Soquete 2 polos", codigo: "SOQ-2P", preco: 29, compartimento: "Gaveta 2", estoque: 7 },
  { id: "p-c5v", nome: "Conector 5 vias", codigo: "C5V", preco: 26, compartimento: "Gaveta 3", estoque: 15 },
  { id: "p-sin-tras", nome: "Sinaleira traseira", codigo: "SIN-TRAS", preco: 160, compartimento: "Balcão", estoque: 3 },
  { id: "p-sir-re", nome: "Sirene de ré", codigo: "SIR-RE", preco: 40, compartimento: "Balcão", estoque: 5 },
  { id: "p-ter-bat", nome: "Terminal de bateria", codigo: "TER-BAT", preco: 18, compartimento: "Gaveta 5", estoque: 20 },
  { id: "p-cab-2x1", nome: "Cabo 2x1", codigo: "CAB-2X1", preco: 14, compartimento: "Balcão", estoque: 30 },
];

/** Mock de serviços (mão de obra) para o formulário Nova OS. */
export const SERVICOS_MOCK = [
  { id: "s-socorro-basico", nome: "Socorro — básico", valorBase: 60 },
  { id: "s-socorro-completo", nome: "Socorro — chicote completo", valorBase: 280 },
  { id: "s-instalacao", nome: "Instalação simples", valorBase: 20 },
  { id: "s-troca-lampada", nome: "Troca de lâmpadas", valorBase: 30 },
  { id: "s-ajuste-farol", nome: "Troca + ajuste de farol", valorBase: 180 },
  { id: "s-patio", nome: "Serviço de pátio", valorBase: 80 },
  { id: "s-oficina-socorro", nome: "Oficina + socorro", valorBase: 800 },
];
