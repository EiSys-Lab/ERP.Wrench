"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Wrench — Auth store (MOCK na Fase 0-3).
 *
 * Durante o Front End First, `login` aceita qualquer credencial para você
 * testar as telas. Na Fase 7 (integração backend), troca-se o mock por
 * `apiPost('/api/identity/login', ...)` real.
 *
 * _hydrated: flag crítica pro AuthGuard evitar flash de redirect antes
 * da reidratação do persist (lição do Indagor).
 */

export type AuthUser = {
  email: string;
  nome: string;
  userId: string;
  tenantId: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  _hydrated: boolean;

  login: (email: string, nome?: string) => void;
  logout: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hydrated: false,

      // MOCK: aceita qualquer email/senha. Extrai nome do email se não vier.
      login: (email, nome) => {
        const derivedName = nome ?? email.split("@")[0].replace(/[._-]/g, " ");
        const displayNome = derivedName
          .split(" ")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
        set({
          token: `mock-token-${Date.now()}`,
          user: {
            email,
            nome: displayNome,
            userId: `mock-user-${email}`,
            tenantId: "mock-tenant",
          },
          isAuthenticated: true,
        });
      },

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      setHydrated: (v) => set({ _hydrated: v }),
    }),
    {
      name: "wrench-auth",
      // Persiste só dados, nunca flags/métodos.
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
