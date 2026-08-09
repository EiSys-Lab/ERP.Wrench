/** Wrench — Mock de Sistema (empresa, usuários, perfis). */

import type { Empresa, Usuario, Perfil } from "./types";

export const EMPRESA_MOCK: Empresa = {
  id: "emp-1",
  razaoSocial: "FININHO Auto Elétrica LTDA",
  nomeFantasia: "FININHO Auto Elétrica",
  cnpj: "12.345.678/0001-90",
  inscricaoEstadual: "254.378.219",
  telefone: "(48) 3224-1000",
  email: "contato@fininhoeletrica.com.br",
  endereco: "Rua das Lâmpadas, 150 - Centro",
  cidade: "Criciúma",
  estado: "SC",
  cep: "88801-000",
};

export const USUARIOS_MOCK: Usuario[] = [
  { id: "u-1", nome: "FININHO (Admin)", email: "admin@wrench.com.br", perfil: "Administrador", status: "Ativo", ultimoAcesso: "2026-08-07T18:30:00Z" },
  { id: "u-2", nome: "Mario da Silva", email: "mario@wrench.com.br", perfil: "Mecânico", status: "Ativo", ultimoAcesso: "2026-08-07T17:00:00Z" },
  { id: "u-3", nome: "Andreia Souza", email: "andreia@wrench.com.br", perfil: "Caixa", status: "Ativo", ultimoAcesso: "2026-08-07T16:45:00Z" },
  { id: "u-4", nome: "Contador Externo", email: "contabilidade@cont.com.br", perfil: "Contador", status: "Inativo", ultimoAcesso: "2026-07-30T10:00:00Z" },
];

export const PERFIS_MOCK: Perfil[] = [
  {
    id: "p-admin",
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    usuarios: 1,
    permissoes: [
      { modulo: "Ordens de Serviço", acessar: true, editar: true },
      { modulo: "Catálogo", acessar: true, editar: true },
      { modulo: "Financeiro", acessar: true, editar: true },
      { modulo: "Fiscal", acessar: true, editar: true },
      { modulo: "Sistema", acessar: true, editar: true },
    ],
  },
  {
    id: "p-mecanico",
    nome: "Mecânico",
    descricao: "Acessa OS e catálogo, sem financeiro",
    usuarios: 1,
    permissoes: [
      { modulo: "Ordens de Serviço", acessar: true, editar: true },
      { modulo: "Catálogo", acessar: true, editar: false },
      { modulo: "Financeiro", acessar: false, editar: false },
      { modulo: "Fiscal", acessar: false, editar: false },
      { modulo: "Sistema", acessar: false, editar: false },
    ],
  },
  {
    id: "p-caixa",
    nome: "Caixa",
    descricao: "PDV, caixa e vendas",
    usuarios: 1,
    permissoes: [
      { modulo: "Ordens de Serviço", acessar: true, editar: false },
      { modulo: "Catálogo", acessar: true, editar: false },
      { modulo: "Financeiro", acessar: true, editar: false },
      { modulo: "Fiscal", acessar: false, editar: false },
      { modulo: "Sistema", acessar: false, editar: false },
    ],
  },
  {
    id: "p-contador",
    nome: "Contador",
    descricao: "Acesso a fiscal e relatórios",
    usuarios: 1,
    permissoes: [
      { modulo: "Ordens de Serviço", acessar: false, editar: false },
      { modulo: "Catálogo", acessar: false, editar: false },
      { modulo: "Financeiro", acessar: true, editar: false },
      { modulo: "Fiscal", acessar: true, editar: true },
      { modulo: "Sistema", acessar: false, editar: false },
    ],
  },
];
