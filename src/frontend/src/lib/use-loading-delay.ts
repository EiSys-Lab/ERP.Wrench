"use client";

import { useEffect, useState } from "react";

/**
 * Wrench — useLoadingDelay.
 *
 * Simula latência de carregamento para os skeletons aparecerem no dev.
 * Na Fase 7 (integração backend), cada view troca por `isLoading` real
 * do TanStack Query (`useQuery({ ... }).isLoading`).
 *
 * @param ms tempo do "carregamento" simulado (default 450ms)
 * @returns `true` enquanto carrega, `false` quando pronto
 *
 * @example
 * const loading = useLoadingDelay();
 * if (loading) return <TableSkeleton />;
 */
export function useLoadingDelay(ms = 450): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);

  return loading;
}
