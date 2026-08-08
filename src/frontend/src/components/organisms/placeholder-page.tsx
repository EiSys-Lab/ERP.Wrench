"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { EmptyState } from "@/components/molecules/empty-state";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";

/**
 * Wrench PlaceholderPage — esqueleto temporário para rotas ainda não
 * implementadas (Fase 2). Substituído pela feature real módulo a módulo.
 */
export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
  description,
  ctaLabel = "Em breve",
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  description: string;
  ctaLabel?: string;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="p-6">
          <EmptyState
            icon={Icon}
            title={title}
            message={description}
            size="lg"
            action={
              <Button variant="glass" disabled>
                {ctaLabel}
              </Button>
            }
          />
        </GlassCard>
      </motion.div>
    </>
  );
}
