/**
 * Wrench — Catálogo API.
 * Tipos batem com os DTOs do backend C# (JSON camelCase).
 */
import { apiGet } from "@/lib/api-client";

export type PecaDto = {
  id: string;
  codigo: string;
  nome: string;
  categoriaId: string | null;
  compartimento: string;
  unidade: string;
  preco: number;
  custo: number | null;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  abaixoDoMinimo: boolean;
};

export type ServicoDto = {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  valorBase: number;
  tempoEstimadoMin: number | null;
  ativo: boolean;
};

export async function listarPecas(): Promise<PecaDto[]> {
  return apiGet<PecaDto[]>("/api/pecas");
}

export async function listarServicos(): Promise<ServicoDto[]> {
  return apiGet<ServicoDto[]>("/api/servicos");
}

// ─── Adapters: DTO backend → tipo local (Peca/Servico) ───────────────
import type { Peca, Servico, UnidadeMedida } from "./types";

const UNIDADE_MAP: Record<string, UnidadeMedida> = {
  Un: "Un", Par: "Par", Metro: "Metro", Kg: "Kg", Litro: "Litro",
};

/** Converte PecaDto do backend para Peca local (view compatibility). */
export function pecaDtoToLocal(dto: PecaDto): Peca {
  const st = dto.abaixoDoMinimo
    ? dto.quantidadeEstoque === 0
      ? { tone: "alert" as const, label: "Sem estoque" }
      : { tone: "warn" as const, label: "Abaixo mínimo" }
    : { tone: "ok" as const, label: "Em estoque" };
  void st; // statusEstoque é recalculado na view
  return {
    id: dto.id,
    codigo: dto.codigo,
    nome: dto.nome,
    categoria: "Geral",
    compartimento: dto.compartimento,
    preco: dto.preco,
    custo: dto.custo ?? undefined,
    quantidadeEstoque: dto.quantidadeEstoque,
    estoqueMinimo: dto.estoqueMinimo,
    unidade: UNIDADE_MAP[dto.unidade] ?? "Un",
    ativo: true,
  };
}

/** Converte ServicoDto do backend para Servico local. */
export function servicoDtoToLocal(dto: ServicoDto): Servico {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nome: dto.nome,
    categoria: dto.categoria,
    valorBase: dto.valorBase,
    tempoEstimadoMin: dto.tempoEstimadoMin ?? undefined,
    ativo: dto.ativo,
  };
}
