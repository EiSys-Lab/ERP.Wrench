"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { SPRING_HOVER } from "@/lib/motion";

/**
 * Wrench ThemeToggle — alterna dark/light com persistência (next-themes).
 * Animação rotate/scale entre ícones.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita flash de tema errado na hidratação.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      title={isDark ? "Tema claro" : "Tema escuro"}
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 600, damping: 38 } }}
      className="relative flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--glass-bg-hover)] hover:text-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={SPRING_HOVER}
            className="absolute"
          >
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
