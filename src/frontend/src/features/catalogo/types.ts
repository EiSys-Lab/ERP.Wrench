/**
 * Wrench — Tipos do Catálogo (Peças + Serviços).
 * Batem com agregados Peca/Servico do futuro backend C#.
 */

export type UnidadeMedida = "Un" | "Par" | "Metro" | "Kg" | "Litro";

export type Peca = {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  compartimento: string;
  preco: number;
  custo?: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  estoqueMaximo?: number;
  unidade: UnidadeMedida;
  ncm?: string;
  codigoBarras?: string;
  ativo: boolean;
};

export type Servico = {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  valorBase: number;
  tempoEstimadoMin?: number;
  ativo: boolean;
};

/** Label de unidade. */
export const UNIDADE_LABEL: Record<UnidadeMedida, string> = {
  Un: "Unidade",
  Par: "Par",
  Metro: "Metro",
  Kg: "Quilo",
  Litro: "Litro",
};

/** Status de estoque para badge. */
export function statusEstoque(p: Peca): {
  tone: "ok" | "warn" | "alert";
  label: string;
} {
  if (p.quantidadeEstoque === 0)
    return { tone: "alert", label: "Sem estoque" };
  if (p.quantidadeEstoque <= p.estoqueMinimo)
    return { tone: "warn", label: "Abaixo mínimo" };
  return { tone: "ok", label: "Em estoque" };
}

/** Calcula margem percentual (se custo existir). */
export function margem(p: Peca): number | null {
  if (!p.custo || p.custo === 0) return null;
  return (p.preco - p.custo) / p.preco;
}
