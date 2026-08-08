/**
 * Wrench — Tipos de Clientes e Veículos.
 * Batem com agregados Cliente/Veiculo do futuro backend C#.
 */

export type ClienteTipo = "PessoaFisica" | "PessoaJuridica" | "Especial";

export type Veiculo = {
  id: string;
  clienteId: string;
  placa: string;
  modelo: string;
  marca?: string;
  ano?: number;
  cor?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  tipo: ClienteTipo;
  documento: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  veiculos: Veiculo[];
  totalOs: number;
  totalGasto: number;
  ultimaOs?: string;
  ativo: boolean;
};

export const CLIENTE_TIPO_LABEL: Record<ClienteTipo, string> = {
  PessoaFisica: "Pessoa Física",
  PessoaJuridica: "Pessoa Jurídica",
  Especial: "Especial",
};

export const CLIENTE_TIPO_TONE: Record<
  ClienteTipo,
  "info" | "ok" | "warn"
> = {
  PessoaFisica: "info",
  PessoaJuridica: "ok",
  Especial: "warn",
};
