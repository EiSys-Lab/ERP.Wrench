/**
 * Wrench — Mock de Clientes e Veículos.
 * Baseado nos clientes reais do Excel.
 */

import type { Cliente } from "./types";

export const CLIENTES_MOCK: Cliente[] = [
  {
    id: "cli-frigo",
    nome: "FRIGO Transportes",
    tipo: "PessoaJuridica",
    documento: "12.345.678/0001-90",
    telefone: "(48) 3224-1000",
    email: "contato@frigo.com.br",
    endereco: "Rod. BR-101, km 200 - Criciúma/SC",
    veiculos: [
      { id: "v-1", clienteId: "cli-frigo", placa: "OCZ8034", modelo: "Scania R450", marca: "Scania", ano: 2022, cor: "Branco" },
    ],
    totalOs: 28,
    totalGasto: 14250,
    ultimaOs: "2026-08-06T09:30:00Z",
    ativo: true,
  },
  {
    id: "cli-eliane",
    nome: "Eliane Silva",
    tipo: "PessoaFisica",
    documento: "123.456.789-01",
    telefone: "(48) 98828-9083",
    veiculos: [
      { id: "v-2", clienteId: "cli-eliane", placa: "RFX0H93", modelo: "Fiat Uno", marca: "Fiat", ano: 2015, cor: "Vermelho" },
    ],
    totalOs: 14,
    totalGasto: 3480,
    ultimaOs: "2026-08-07T14:00:00Z",
    ativo: true,
  },
  {
    id: "cli-birolo",
    nome: "Birolo Auto",
    tipo: "PessoaJuridica",
    documento: "98.765.432/0001-09",
    telefone: "(48) 3261-5500",
    veiculos: [
      { id: "v-3", clienteId: "cli-birolo", placa: "MBQ4884", modelo: "VW Saveiro", marca: "Volkswagen", ano: 2018, cor: "Prata" },
      { id: "v-4", clienteId: "cli-birolo", placa: "BYH2310", modelo: "Fiat Cronos", marca: "Fiat", ano: 2022, cor: "Preto" },
    ],
    totalOs: 22,
    totalGasto: 8120,
    ultimaOs: "2026-08-05T10:15:00Z",
    ativo: true,
  },
  {
    id: "cli-fragnani",
    nome: "Marcos Fragnani",
    tipo: "PessoaFisica",
    documento: "456.789.123-45",
    telefone: "(48) 99876-1234",
    veiculos: [
      { id: "v-5", clienteId: "cli-fragnani", placa: "MLX3E92", modelo: "GM Corsa", marca: "Chevrolet", ano: 2012 },
    ],
    totalOs: 9,
    totalGasto: 1980,
    ultimaOs: "2026-08-04T15:30:00Z",
    ativo: true,
  },
  {
    id: "cli-rodowapi",
    nome: "Rodowapi Logística",
    tipo: "PessoaJuridica",
    documento: "23.456.789/0001-01",
    telefone: "(48) 3222-7700",
    email: "frota@rodowapi.com.br",
    veiculos: [
      { id: "v-6", clienteId: "cli-rodowapi", placa: "RDU2B01", modelo: "Sprinter Furgão", marca: "Mercedes", ano: 2020, cor: "Branco" },
    ],
    totalOs: 17,
    totalGasto: 6450,
    ultimaOs: "2026-08-07T08:00:00Z",
    ativo: true,
  },
  {
    id: "cli-nivaldo",
    nome: "Nivaldo Souza",
    tipo: "PessoaFisica",
    documento: "321.654.987-10",
    telefone: "(48) 98765-4321",
    veiculos: [
      { id: "v-7", clienteId: "cli-nivaldo", placa: "MKO8580", modelo: "VW Fox", marca: "Volkswagen", ano: 2016, cor: "Prata" },
    ],
    totalOs: 6,
    totalGasto: 1620,
    ultimaOs: "2026-08-03T11:00:00Z",
    ativo: true,
  },
  {
    id: "cli-carlinhos",
    nome: "Carlinhos Auto Peças",
    tipo: "Especial",
    documento: "654.321.987-65",
    telefone: "(48) 99999-8888",
    veiculos: [
      { id: "v-8", clienteId: "cli-carlinhos", placa: "MKJ5555", modelo: "Fiat Strada", marca: "Fiat", ano: 2021 },
      { id: "v-9", clienteId: "cli-carlinhos", placa: "MJX6666", modelo: "Fiat Toro", marca: "Fiat", ano: 2023 },
    ],
    totalOs: 11,
    totalGasto: 4280,
    ultimaOs: "2026-08-07T13:45:00Z",
    ativo: true,
  },
  {
    id: "cli-passante",
    nome: "João Passante",
    tipo: "PessoaFisica",
    documento: "111.222.333-44",
    veiculos: [
      { id: "v-10", clienteId: "cli-passante", placa: "SXV8I67", modelo: "Honda CG", marca: "Honda", ano: 2019 },
    ],
    totalOs: 4,
    totalGasto: 680,
    ultimaOs: "2026-05-04T00:00:00Z",
    ativo: false,
  },
];
