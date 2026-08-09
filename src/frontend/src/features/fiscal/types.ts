/** Wrench — Tipos Fiscais (NF-e/NFC-e). */

export type ModeloDocumento = "NFe" | "NFCe" | "SAT";

export type StatusDocumento =
  | "Autorizada"
  | "Pendente"
  | "Rejeitada"
  | "Cancelada"
  | "Contingencia";

export type AmbienteSefaz = "Homologacao" | "Producao";

export type RegimeTributario = "SimplesNacional" | "LucroPresumido" | "LucroReal";

export type DocumentoFiscal = {
  id: string;
  numero: number;
  serie: string;
  modelo: ModeloDocumento;
  chave: string;
  destinatario: string;
  documentoDest: string;
  valor: number;
  status: StatusDocumento;
  emissao: string;
  ambiente: AmbienteSefaz;
};

export type ConfiguracaoFiscal = {
  cnpj: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  regime: RegimeTributario;
  ambiente: AmbienteSefaz;
  certificadoCarregado: boolean;
  certificadoValidade?: string;
  serieNFe: string;
  serieNFCe: string;
  proximoNumeroNFe: number;
  proximoNumeroNFCe: number;
};

export const STATUS_DOC_TONE: Record<
  StatusDocumento,
  "ok" | "warn" | "alert" | "muted"
> = {
  Autorizada: "ok",
  Pendente: "warn",
  Rejeitada: "alert",
  Cancelada: "muted",
  Contingencia: "warn",
};

export const MODELO_LABEL: Record<ModeloDocumento, string> = {
  NFe: "NF-e",
  NFCe: "NFC-e",
  SAT: "SAT",
};

export const REGIME_LABEL: Record<RegimeTributario, string> = {
  SimplesNacional: "Simples Nacional",
  LucroPresumido: "Lucro Presumido",
  LucroReal: "Lucro Real",
};
