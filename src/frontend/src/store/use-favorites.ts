"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Wrench — Favoritos (módulos fixados pelo usuário no SideNav).
 * Persiste por usuário (localStorage).
 */
type FavoritesState = {
  favorites: string[];
  toggle: (moduleId: string) => void;
  isFavorite: (moduleId: string) => boolean;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (moduleId) =>
        set((s) => ({
          favorites: s.favorites.includes(moduleId)
            ? s.favorites.filter((id) => id !== moduleId)
            : [...s.favorites, moduleId],
        })),
      isFavorite: (moduleId) => get().favorites.includes(moduleId),
    }),
    { name: "wrench-favorites" },
  ),
);
