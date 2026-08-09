/**
 * Wrench — Clientes hooks (TanStack Query).
 */
import { useQuery } from "@tanstack/react-query";
import { listarClientes } from "./api";

export const clientesKeys = {
  all: ["clientes"] as const,
};

export function useClientes() {
  return useQuery({
    queryKey: clientesKeys.all,
    queryFn: listarClientes,
    staleTime: 30_000,
  });
}
