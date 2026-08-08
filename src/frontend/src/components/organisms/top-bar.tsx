"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MODULES } from "@/lib/navigation";
import { useNav } from "@/store/use-nav";
import { useCommandPalette } from "@/store/use-command-palette";
import { useAuth } from "@/store/use-auth";
import { AppSwitcher } from "./app-switcher";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { cn } from "@/lib/utils";
import { SPRING_HOVER as SPRING_TAB, SPRING_PRESS } from "@/lib/motion";

const NAV_W_EXPANDED = 224;
const NAV_W_COLLAPSED = 56;

/**
 * Wrench TopBar — barra superior glass.
 * [AppSwitcher] [⇆ collapse] [view tabs do módulo ativo] ... [⌘K] [🔔] [◐] [user]
 */
export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeModuleId, sideNavCollapsed, toggleSideNav } = useNav();
  const openPalette = useCommandPalette((s) => s.toggle);
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const activeModule = MODULES.find((m) => m.id === activeModuleId);

  const userInitial = (user?.nome?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();
  const userDisplayName = user?.nome ?? "Usuário";

  return (
    <header
      className="relative z-50 flex h-12 shrink-0 items-center border-b border-line backdrop-blur-xl"
      style={{ background: "var(--topbar-bg)" }}
    >
      {/* ── Logo zone / AppSwitcher ── */}
      <motion.div
        animate={{ width: sideNavCollapsed ? NAV_W_COLLAPSED : NAV_W_EXPANDED }}
        transition={SPRING_TAB}
        className="flex h-full shrink-0 items-center overflow-hidden border-r border-sidebar-border px-3"
        style={{ background: "var(--sidebar)" }}
      >
        <AppSwitcher />
      </motion.div>

      {/* ── Collapse ── */}
      <GlassIconBtn
        title={sideNavCollapsed ? "Expandir painel" : "Colapsar painel"}
        onClick={toggleSideNav}
      >
        {sideNavCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </GlassIconBtn>

      {/* ── View tabs ── */}
      <nav className="flex flex-1 items-center gap-0.5 overflow-hidden px-1">
        <AnimatePresence mode="wait">
          {activeModule && (
            <motion.div
              key={activeModuleId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-0.5"
            >
              {activeModule.views.map((view) => {
                const isActive = pathname.startsWith(view.path);
                const Icon = view.icon;
                return (
                  <motion.button
                    key={view.id}
                    onClick={() => router.push(view.path)}
                    whileTap={{ scale: 0.95, transition: SPRING_PRESS }}
                    className="relative cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium select-none outline-none"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="topbar-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "var(--glass-bg-active)",
                          border: "1px solid var(--glass-border-hover)",
                        }}
                        transition={SPRING_TAB}
                      />
                    )}
                    <motion.span
                      className="absolute inset-0 rounded-lg opacity-0"
                      style={{ background: "var(--glass-bg-hover)" }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    />
                    <span
                      className={cn(
                        "relative flex items-center gap-1.5 transition-colors duration-150",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <motion.span whileHover={{ rotate: -4 }} transition={SPRING_TAB}>
                        <Icon size={13} />
                      </motion.span>
                      {view.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1 pr-3">
        {/* Search → Command Palette */}
        <motion.button
          title="Buscar (⌘K)"
          onClick={openPalette}
          whileTap={{ scale: 0.97, transition: SPRING_PRESS }}
          className="relative flex h-7 cursor-pointer items-center gap-2 rounded-lg border border-line bg-card px-2.5 text-muted-foreground transition-colors hover:border-[var(--glass-border-hover)] hover:text-foreground"
          aria-label="Buscar (Command K)"
        >
          <Search size={13} />
          <span className="hidden text-[11px] sm:inline">Buscar...</span>
          <kbd
            className="hidden items-center rounded border border-line-2 bg-muted px-1 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-muted-foreground sm:inline-flex"
            aria-hidden="true"
          >
            ⌘K
          </kbd>
        </motion.button>

        {/* Bell */}
        <GlassIconBtn title="Notificações" onClick={() => {}}>
          <Bell size={14} />
        </GlassIconBtn>

        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <motion.button
                whileTap={{ scale: 0.96, transition: SPRING_PRESS }}
                className="relative ml-1 flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs outline-none"
                aria-label="Menu do usuário"
              >
                <motion.span
                  className="absolute inset-0 rounded-lg opacity-0"
                  style={{ background: "var(--glass-bg-hover)" }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <span className="relative flex size-5 items-center justify-center rounded-full bg-[var(--wrench-accent-soft)] text-[10px] font-semibold text-[var(--wrench-accent)]">
                  {userInitial}
                </span>
                <span className="relative text-xs text-foreground/70">
                  {userDisplayName.split(" ")[0]}
                </span>
                <ChevronDown size={11} className="relative text-muted-foreground" />
              </motion.button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{userDisplayName}</span>
                <span className="text-[11px] text-muted-foreground">{user?.email ?? "—"}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/sistema/empresa")}>
              <User size={13} className="mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/sistema")}>
              <Settings size={13} className="mr-2" />
              Preferências
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[var(--status-alert)] focus:text-[var(--status-alert)]"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut size={13} className="mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* ─── GlassIconBtn ─── */
function GlassIconBtn({
  children,
  title,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      title={title}
      onClick={onClick}
      whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 600, damping: 38 } }}
      className={cn(
        "relative flex size-7 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <motion.span
        className="absolute inset-0 rounded-lg"
        style={{ background: "var(--glass-bg-hover)" }}
        initial={{ opacity: active ? 1 : 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
      <span className="relative">{children}</span>
    </motion.button>
  );
}
