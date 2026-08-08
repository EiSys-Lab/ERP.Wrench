"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Command } from "cmdk";
import { ArrowRight, PlusCircle, Search } from "lucide-react";
import { useCommandPalette } from "@/store/use-command-palette";
import { MODULES, DEFAULT_PATH } from "@/lib/navigation";
import { SPRING_DRAWER } from "@/lib/motion";

/**
 * Wrench CommandPalette — ⌘K.
 * Abertura controlada pelo store use-command-palette (listener no ErpLayout).
 * Grupos: Ações rápidas + Navegar (todos módulos/views).
 */
export function CommandPalette() {
  const open = useCommandPalette((s) => s.open);
  const setOpen = useCommandPalette((s) => s.setOpen);
  const router = useRouter();

  function run(path: string) {
    router.push(path);
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-background/50 backdrop-blur-sm"
          />
          {/* Panel */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center px-4 pt-[12vh]">
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={SPRING_DRAWER}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-popover shadow-soft-xl"
            >
              <Command className="flex flex-col">
                {/* Input */}
                <div className="flex items-center gap-2 border-b border-line px-4">
                  <Search size={15} className="text-muted-foreground" />
                  <Command.Input
                    autoFocus
                    placeholder="Buscar ações ou navegar..."
                    className="flex h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>

                {/* Results */}
                <Command.List className="max-h-[320px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
                    Nenhum resultado encontrado.
                  </Command.Empty>

                  {/* Ações rápidas */}
                  <Command.Group
                    heading="Ações rápidas"
                    className="mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    <PaletteItem
                      icon={<PlusCircle size={14} />}
                      label="Nova Ordem de Serviço"
                      onSelect={() => run("/ordens-servico/nova")}
                    />
                    <PaletteItem
                      icon={<ArrowRight size={14} />}
                      label="Ir para Dashboard"
                      onSelect={() => run("/dashboard")}
                    />
                    <PaletteItem
                      icon={<ArrowRight size={14} />}
                      label="Ir para Workspace"
                      onSelect={() => run(DEFAULT_PATH)}
                    />
                  </Command.Group>

                  {/* Navegar — todos módulos/views */}
                  <Command.Group
                    heading="Navegar"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    {MODULES.filter((m) => m.id !== "workspace").flatMap((mod) =>
                      mod.views.map((view) => (
                        <PaletteItem
                          key={view.id}
                          icon={<view.icon size={14} />}
                          label={`${mod.label} · ${view.label}`}
                          onSelect={() => run(view.path)}
                        />
                      )),
                    )}
                  </Command.Group>
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[10px] text-muted-foreground">
                  <span>ESC para fechar</span>
                  <span>Wrench ERP</span>
                </div>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function PaletteItem({
  icon,
  label,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground outline-none transition-colors data-[selected=true]:bg-[var(--glass-bg-active)] data-[selected=true]:text-foreground"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
    </Command.Item>
  );
}
