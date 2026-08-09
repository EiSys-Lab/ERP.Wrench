/**
 * Wrench — Ordens de Serviço hooks (TanStack Query).
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarOrdens, avancarOs } from "./api";

export const osKeys = {
  all: ["ordens-servico"] as const,
};

export function useOrdens() {
  return useQuery({
    queryKey: osKeys.all,
    queryFn: () => listarOrdens(),
    staleTime: 5_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useAvancarOs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statusDestino }: { id: string; statusDestino: string }) =>
      avancarOs(id, statusDestino),
    onSuccess: () => qc.invalidateQueries({ queryKey: osKeys.all }),
  });
}
