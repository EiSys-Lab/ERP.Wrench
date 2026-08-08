"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/organisms/top-bar";
import { SideNav } from "@/components/organisms/side-nav";
import { CommandPalette } from "@/components/organisms/command-palette";
import { useNav } from "@/store/use-nav";
import { useCommandPalette } from "@/store/use-command-palette";

/**
 * Wrench ErpLayout — shell principal.
 * TopBar + SideNav + área de conteúdo + Command Palette.
 * Listener global ⌘K/Ctrl+K abre o palette.
 */
export function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const syncFromPath = useNav((s) => s.syncFromPath);
  const togglePalette = useCommandPalette((s) => s.toggle);

  // Sincroniza módulo/view ativo a partir do path.
  useEffect(() => {
    syncFromPath(pathname);
  }, [pathname, syncFromPath]);

  // Atalho global ⌘K / Ctrl+K.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [togglePalette]);

  return (
    <div className="flex h-dvh flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
