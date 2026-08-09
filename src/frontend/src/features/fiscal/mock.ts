/** Wrench — Mock Fiscal (documentos + configuração). */

import type { DocumentoFiscal, ConfiguracaoFiscal } from "./types";

export const DOCUMENTOS_FISCAIS_MOCK: DocumentoFiscal[] = [
  { id: "df-1", numero: 1247, serie: "1", modelo: "NFe", chave: "35260812345678000190550010000012471123456789", destinatario: "FRIGO Transportes", documentoDest: "12.345.678/0001-90", valor: 346, status: "Autorizada", emissao: "2026-08-06T09:45:00Z", ambiente: "Producao" },
  { id: "df-2", numero: 1246, serie: "1", modelo: "NFe", chave: "35260812345678000190550010000012461123456780", destinatario: "Birolo Auto", documentoDest: "98.765.432/0001-09", valor: 158, status: "Autorizada", emissao: "2026-08-05T10:30:00Z", ambiente: "Producao" },
  { id: "df-3", numero: 1245, serie: "1", modelo: "NFCe", chave: "35260812345678000190650010000012451123456781", destinatario: "Venda Balcão #585", documentoDest: "Consumidor", valor: 64, status: "Autorizada", emissao: "2026-08-07T14:05:00Z", ambiente: "Producao" },
  { id: "df-4", numero: 1244, serie: "1", modelo: "NFe", chave: "35260812345678000190550010000012441123456782", destinatario: "Eliane Silva", documentoDest: "123.456.789-01", valor: 80, status: "Pendente", emissao: "2026-08-07T14:15:00Z", ambiente: "Producao" },
  { id: "df-5", numero: 1243, serie: "1", modelo: "NFCe", chave: "35260812345678000190650010000012431123456783", destinatario: "Venda Balcão #582", documentoDest: "Consumidor", valor: 30, status: "Autorizada", emissao: "2026-08-07T09:20:00Z", ambiente: "Producao" },
  { id: "df-6", numero: 1242, serie: "1", modelo: "NFe", chave: "35260812345678000190550010000012421123456784", destinatario: "Rodowapi Logística", documentoDest: "23.456.789/0001-01", valor: 520, status: "Rejeitada", emissao: "2026-08-06T16:00:00Z", ambiente: "Producao" },
  { id: "df-7", numero: 1240, serie: "1", modelo: "NFe", chave: "35260812345678000190550010000012401123456785", destinatario: "Carlinhos Auto Peças", documentoDest: "654.321.987-65", valor: 380, status: "Cancelada", emissao: "2026-07-30T11:00:00Z", ambiente: "Producao" },
];

export const CONFIGURACAO_FISCAL_MOCK: ConfiguracaoFiscal = {
  cnpj: "12.345.678/0001-90",
  razaoSocial: "FININHO Auto Elétrica LTDA",
  inscricaoEstadual: "254.378.219",
  regime: "SimplesNacional",
  ambiente: "Homologacao",
  certificadoCarregado: true,
  certificadoValidade: "2027-03-15",
  serieNFe: "1",
  serieNFCe: "2",
  proximoNumeroNFe: 1248,
  proximoNumeroNFCe: 891,
};
