"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

/**
 * Wrench DropdownMenu — wrapper sobre Base UI Menu.
 * Estilo Ethereal Glass: popup translúcido + blur + hairlines.
 */

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuPortal = Menu.Portal;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof Menu.Popup>,
  Omit<React.ComponentPropsWithoutRef<typeof Menu.Popup>, "ref"> & {
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }
>(({ className, align = "end", sideOffset = 6, ...props }, ref) => (
  <Menu.Portal>
    <Menu.Positioner align={align} sideOffset={sideOffset}>
      <Menu.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-xl glass p-1 text-foreground shadow-soft-lg",
          "origin-[var(--transform-origin)]",
          className,
        )}
        {...props}
      />
    </Menu.Positioner>
  </Menu.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2.5 py-1.5 text-xs font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Menu.Item>) {
  return (
    <Menu.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none",
        "transition-colors data-[highlighted]:bg-[var(--glass-bg-active)]",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-line", className)} />;
}
