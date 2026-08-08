"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

/**
 * Wrench EmptyState — estado vazio rico.
 * Princípio UX: ícone + título + mensagem + CTA opcional.
 */
export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  title: string;
  message?: string;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pad = size === "sm" ? "py-8" : size === "lg" ? "py-16" : "py-12";
  const iconSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;

  return (
    <motion.div
      {...fadeUp(0)}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        pad,
        className,
      )}
    >
      <div className="mb-3 rounded-2xl glass p-3">
        <Icon size={iconSize} className="text-muted-foreground opacity-50" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {message && (
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
