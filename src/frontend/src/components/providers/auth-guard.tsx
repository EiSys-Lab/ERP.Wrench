"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/use-auth";

/**
 * Wrench AuthGuard — protege rotas (erp).
 *
 * Pré-hidratação (antes do persist reidratar): mostra spinner.
 * Após hidratar: se não autenticado → redirect /login.
 *
 * Na Fase 0-3, login é mock (aceita qualquer credencial) então qualquer
 * usuário que fez login mock passa aqui. Na Fase 7, token JWT real é validado.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const hydrated = useAuth((s) => s._hydrated);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
