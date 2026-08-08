"use client";

import { create } from "zustand";

/**
 * Wrench — Command Palette (⌘K).
 * Estado efêmero: sempre inicia fechado. Toggle disparado pelo listener
 * ⌘K/Ctrl+K no ErpLayout.
 */
type CommandPaletteState = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  close: () => void;
};

export const useCommandPalette = create<CommandPaletteState>()((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
  close: () => set({ open: false }),
}));
