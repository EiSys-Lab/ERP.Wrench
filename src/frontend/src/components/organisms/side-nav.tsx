"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Search, Star, X } from "lucide-react";
import {
  MODULES,
  CATEGORY_ORDER,
  CATEGORY_LABEL,
  type Module,
} from "@/lib/navigation";
import { useNav } from "@/store/use-nav";
import { useFavorites } from "@/store/use-favorites";
import { useAuth } from "@/store/use-auth";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";

const SPRING_WIDTH = { type: "spring", stiffness: 420, damping: 32 } as const;

/**
 * Wrench SideNav — barra lateral glass.
 * Módulos agrupados por categoria. Workspace fixo no topo (sem header).
 * Busca filtra por label de módulo OU view. Favoritos persistidos.
 */
export function SideNav() {
  const router = useRouter();
  const { activeModuleId, setActiveModule, sideNavCollapsed } = useNav();
  const [query, setQuery] = useState("");

  const favorites = useFavorites((s) => s.favorites);
  const toggleFavorite = useFavorites((s) => s.toggle);
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);

  const filteredModules = useMemo(() => {
    if (!query.trim()) return MODULES;
    const q = query.toLowerCase();
    return MODULES.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.views.some((v) => v.label.toLowerCase().includes(q)),
    );
  }, [query]);

  const favoriteModules = useMemo(
    () =>
      favorites
        .map((id) => MODULES.find((m) => m.id === id))
        .filter((m): m is Module => Boolean(m)),
    [favorites],
  );

  function handleModuleClick(moduleId: string) {
    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) return;
    setActiveModule(moduleId);
    router.push(mod.views[0].path);
  }

  const displayName = user?.nome ?? "Usuário";
  const displayEmail = user?.email ?? "—";
  const initial = (displayName[0] ?? "U").toUpperCase();

  return (
    <motion.aside
      animate={{ width: sideNavCollapsed ? 56 : 224 }}
      transition={SPRING_WIDTH}
      className="relative flex h-full shrink-0 flex-col overflow-hidden border-r border-sidebar-border"
      style={{ background: "var(--sidebar)" }}
    >
      {/* ── Busca ── */}
      {!sideNavCollapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar..."
              className="w-full rounded-lg border border-line bg-[var(--glass-bg)] py-1.5 pl-7 pr-7 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--wrench-accent)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Limpar"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Lista navegável ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Favoritos */}
        {!query && favoriteModules.length > 0 && (
          <SideNavSection label="Favoritos" icon={Star} collapsed={sideNavCollapsed}>
            {favoriteModules.map((mod, i) => (
              <SideNavItem
                key={`fav-${mod.id}`}
                module={mod}
                isActive={mod.id === activeModuleId}
                collapsed={sideNavCollapsed}
                isFavorite
                onToggleFavorite={() => toggleFavorite(mod.id)}
                index={i}
                onClick={() => handleModuleClick(mod.id)}
              />
            ))}
          </SideNavSection>
        )}

        {/* Módulos por categoria */}
        {CATEGORY_ORDER.map((cat) => {
          if (cat === "workspace") {
            const mods = filteredModules.filter((m) => m.category === "workspace");
            if (mods.length === 0) return null;
            return (
              <div key={cat} className="mb-1">
                {mods.map((mod, i) => (
                  <SideNavItem
                    key={mod.id}
                    module={mod}
                    isActive={mod.id === activeModuleId}
                    collapsed={sideNavCollapsed}
                    isFavorite={favorites.includes(mod.id)}
                    onToggleFavorite={() => toggleFavorite(mod.id)}
                    index={i}
                    onClick={() => handleModuleClick(mod.id)}
                  />
                ))}
              </div>
            );
          }
          const mods = filteredModules.filter((m) => m.category === cat);
          if (mods.length === 0) return null;
          return (
            <SideNavSection
              key={cat}
              label={CATEGORY_LABEL[cat]}
              collapsed={sideNavCollapsed}
            >
              {mods.map((mod, i) => (
                <SideNavItem
                  key={mod.id}
                  module={mod}
                  isActive={mod.id === activeModuleId}
                  collapsed={sideNavCollapsed}
                  isFavorite={favorites.includes(mod.id)}
                  onToggleFavorite={() => toggleFavorite(mod.id)}
                  index={i}
                  onClick={() => handleModuleClick(mod.id)}
                />
              ))}
            </SideNavSection>
          );
        })}

        {query && filteredModules.length === 0 && (
          <div className="px-3 py-6 text-center text-[11px] text-muted-foreground">
            Nenhum módulo encontrado para &ldquo;{query}&rdquo;.
          </div>
        )}
      </nav>

      {/* ── Footer / User ── */}
      {!sideNavCollapsed && (
        <div className="border-t border-sidebar-border p-2">
          <div className="group/footer relative flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--glass-bg-hover)]">
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground"
              style={{ background: "var(--wrench-accent)" }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{displayName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{displayEmail}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title="Sair"
              aria-label="Sair"
              className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-[var(--glass-bg-active)] hover:text-foreground group-hover/footer:opacity-100"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Subcomponentes                                                           */
/* ──────────────────────────────────────────────────────────────────────── */

function SideNavSection({
  label,
  icon: Icon,
  collapsed,
  children,
}: {
  label: string;
  icon?: typeof Star;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  if (collapsed) return <div className="mb-1">{children}</div>;
  return (
    <div className="mb-2">
      <div className="flex items-center gap-1 px-2 pb-1 pt-2">
        {Icon && <Icon size={9} className="text-muted-foreground" />}
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function SideNavItem({
  module: mod,
  isActive,
  collapsed,
  isFavorite,
  onToggleFavorite,
  index,
  onClick,
}: {
  module: Module;
  isActive: boolean;
  collapsed: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index: number;
  onClick: () => void;
}) {
  const Icon = mod.icon;
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative list-none"
    >
      <motion.button
        title={collapsed ? mod.label : undefined}
        onClick={onClick}
        whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 600, damping: 40 } }}
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors duration-100",
          isActive ? "text-foreground" : "text-sidebar-foreground hover:text-foreground",
        )}
      >
        {/* Glass pill ativo */}
        {isActive && (
          <motion.span
            layoutId="sidenav-active"
            className="absolute inset-0 rounded-lg"
            style={{
              background: "var(--glass-bg-active)",
              border: "1px solid var(--glass-border-hover)",
            }}
            transition={SPRING}
          />
        )}

        {/* Hover overlay */}
        <motion.span
          className="absolute inset-0 rounded-lg opacity-0"
          style={{ background: "var(--glass-bg-hover)" }}
          whileHover={isActive ? {} : { opacity: 1 }}
          transition={{ duration: 0.13 }}
        />

        {/* Barra accent esquerda */}
        {isActive && (
          <motion.span
            layoutId="sidenav-bar"
            className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-full"
            style={{ background: "var(--wrench-accent)" }}
            transition={SPRING}
          />
        )}

        {/* Ícone */}
        <motion.span
          className="relative shrink-0"
          whileHover={{ x: 2 }}
          transition={SPRING}
          style={{ color: isActive ? "var(--nav-icon-accent)" : "var(--nav-icon-dim)" }}
        >
          <Icon size={14} />
        </motion.span>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="relative truncate text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {mod.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Star toggle */}
        {!collapsed && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }
            }}
            className={cn(
              "absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 transition-all",
              isFavorite
                ? "text-[var(--wrench-accent)] opacity-100"
                : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground",
            )}
            aria-label={isFavorite ? "Desfavoritar" : "Favoritar"}
          >
            <Star size={11} fill={isFavorite ? "currentColor" : "none"} />
          </span>
        )}
      </motion.button>
    </motion.li>
  );
}
