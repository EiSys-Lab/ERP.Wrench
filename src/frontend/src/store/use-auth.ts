"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Wrench — Auth store (Fase 7: API real).
 *
 * login() chama POST /api/identity/login e armazena o token JWT + user.
 * O token é lido pelo api-client.ts (header Authorization: Bearer).
 *
 * _hydrated: flag crítica pro AuthGuard evitar flash de redirect antes
 * da reidratação do persist.
 */

type AuthUser = {
  userId: string;
  email: string;
  nome: string;
  tenantId: string;
};

type AuthState = {
  token: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  _hydrated: boolean;

  /** Recebe os dados do login real (chamado pela page de login). */
  login: (data: {
    token: string;
    expiresAt: string;
    user: AuthUser;
  }) => void;
  logout: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      _hydrated: false,

      login: (data) =>
        set({
          token: data.token,
          expiresAt: data.expiresAt,
          user: data.user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({ token: null, expiresAt: null, user: null, isAuthenticated: false }),

      setHydrated: (v) => set({ _hydrated: v }),
    }),
    {
      name: "wrench-auth",
      partialize: (s) => ({
        token: s.token,
        expiresAt: s.expiresAt,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
