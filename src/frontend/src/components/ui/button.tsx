"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Wrench Button — Ethereal Glass.
 * Variantes: default (gradient brand), glass (translúcida), outline, ghost,
 * destructive. Sizes compactos para densidade de ERP.
 */
export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium outline-none transition-all select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "gradient-brand text-primary-foreground shadow-soft-md hover:shadow-soft-lg",
        glass:
          "glass glass-hover text-foreground",
        outline:
          "border border-line bg-transparent text-foreground hover:bg-[var(--glass-bg-hover)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[var(--surface-3)]",
        ghost:
          "text-foreground hover:bg-[var(--glass-bg-hover)]",
        destructive:
          "bg-destructive text-white hover:brightness-110",
        link:
          "text-[var(--wrench-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        xs: "h-7 px-2.5 text-[11px]",
        lg: "h-11 px-7 text-base",
        icon: "size-9 p-0",
        "icon-sm": "size-7 p-0",
        "icon-xs": "size-6 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
