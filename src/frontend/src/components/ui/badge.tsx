import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Wrench Badge — pill semântico.
 * Tons fixos (não seguem marca) para status; accent para marca.
 */
export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--wrench-accent-soft)] text-[var(--wrench-accent)]",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-line text-foreground",
        ok: "bg-[color-mix(in_oklch,var(--status-ok)_14%,transparent)] text-[var(--status-ok)]",
        warn: "bg-[color-mix(in_oklch,var(--status-warn)_14%,transparent)] text-[var(--status-warn)]",
        alert: "bg-[color-mix(in_oklch,var(--status-alert)_14%,transparent)] text-[var(--status-alert)]",
        info: "bg-[color-mix(in_oklch,var(--status-info)_14%,transparent)] text-[var(--status-info)]",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
