/**
 * Wrench — Clientes API.
 */
import { apiGet } from "@/lib/api-client";
import type { Cliente, Veiculo, ClienteTipo } from "./types";

export type ClienteDto = {
  id: string;
  nome: string;
  tipo: string;
  documento: string | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  veiculos: {
    placa: string;
    modelo: string;
    marca: string | null;
    ano: number | null;
    cor: string | null;
  }[];
};

export async function listarClientes(): Promise<ClienteDto[]> {
  return apiGet<ClienteDto[]>("/api/clientes");
}

// ─── Adapter: DTO → tipo local ───────────────────────────────────────

const TIPO_MAP: Record<string, ClienteTipo> = {
  PessoaFisica: "PessoaFisica",
  PessoaJuridica: "PessoaJuridica",
  Especial: "Especial",
};

export function clienteDtoToLocal(dto: ClienteDto): Cliente {
  const veiculos: Veiculo[] = dto.veiculos.map((v, i) => ({
    id: `${dto.id}-v${i}`,
    clienteId: dto.id,
    placa: v.placa,
    modelo: v.modelo,
    marca: v.marca ?? undefined,
    ano: v.ano ?? undefined,
    cor: v.cor ?? undefined,
  }));

  return {
    id: dto.id,
    nome: dto.nome,
    tipo: TIPO_MAP[dto.tipo] ?? "PessoaFisica",
    documento: dto.documento ?? "",
    telefone: dto.telefone ?? undefined,
    email: dto.email ?? undefined,
    veiculos,
    totalOs: 0, // não vem no endpoint de listagem
    totalGasto: 0,
    ativo: dto.ativo,
  };
}
