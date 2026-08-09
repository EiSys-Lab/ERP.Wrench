/**
 * Wrench — Catálogo hooks (TanStack Query).
 */
import { useQuery } from "@tanstack/react-query";
import { listarPecas, listarServicos } from "./api";

export const pecasKeys = {
  all: ["pecas"] as const,
};

export function usePecas() {
  return useQuery({
    queryKey: pecasKeys.all,
    queryFn: listarPecas,
    staleTime: 30_000,
  });
}

export const servicosKeys = {
  all: ["servicos"] as const,
};

export function useServicos() {
  return useQuery({
    queryKey: servicosKeys.all,
    queryFn: listarServicos,
    staleTime: 30_000,
  });
}
