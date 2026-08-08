"use client";

import { create } from "zustand";
import {
  MODULES,
  getModuleByPath,
  type Module,
  type View,
} from "@/lib/navigation";

/**
 * Wrench — Nav store.
 *
 * Estado de navegação NÃO persiste (sempre resync do path na rota).
 * activeModuleId determina quais views aparecem no TopBar.
 */
type NavState = {
  activeModuleId: string;
  activeViewPath: string | null;
  sideNavCollapsed: boolean;

  setActiveModule: (id: string) => void;
  setActiveView: (path: string) => void;
  syncFromPath: (pathname: string) => void;
  toggleSideNav: () => void;

  activeModule: () => Module | undefined;
  activeView: () => View | undefined;
};

export const useNav = create<NavState>()((set, get) => ({
  activeModuleId: "workspace",
  activeViewPath: null,
  sideNavCollapsed: false,

  setActiveModule: (id) => set({ activeModuleId: id }),

  setActiveView: (path) => set({ activeViewPath: path }),

  // Resolve módulo/view a partir do pathname — chamado no useEffect do ErpLayout.
  syncFromPath: (pathname) => {
    const mod = getModuleByPath(pathname);
    const view = MODULES.flatMap((m) => m.views).find((v) =>
      pathname.startsWith(v.path),
    );
    set({
      activeModuleId: mod?.id ?? "workspace",
      activeViewPath: view?.path ?? null,
    });
  },

  toggleSideNav: () =>
    set((s) => ({ sideNavCollapsed: !s.sideNavCollapsed })),

  activeModule: () =>
    MODULES.find((m) => m.id === get().activeModuleId),

  activeView: () => {
    const path = get().activeViewPath;
    if (!path) return undefined;
    return MODULES.flatMap((m) => m.views).find((v) => v.path === path);
  },
}));
