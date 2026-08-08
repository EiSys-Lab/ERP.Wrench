"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

/**
 * Wrench PageHeader — cabeçalho padrão de página.
 * Título + subtítulo + slot de ações.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  animate = true,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  animate?: boolean;
}) {
  const motionProps = animate ? fadeUp(0) : {};

  return (
    <motion.div
      {...motionProps}
      className="mb-6 flex flex-wrap items-start justify-between gap-4"
    >
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </motion.div>
  );
}
