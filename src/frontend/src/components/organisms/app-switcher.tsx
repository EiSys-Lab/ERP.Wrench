"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { WrenchWordmark } from "@/components/atoms/wrench-logo";
import { SPRING_PRESS } from "@/lib/motion";

/**
 * Wrench AppSwitcher — dropdown de contextos de app.
 * Por ora só o ERP principal. Mecânica pronta p/ adicionar apps standalone
 * (Mecânico, Separador) quando existirem rotas fora do shell.
 */

type AppDef = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  match: (pathname: string) => boolean;
};

const APPS: AppDef[] = [
  {
    id: "erp",
    label: "ERP Oficina",
    href: "/workspace",
    match: (p) => !p.startsWith("/app/"),
  },
];

export function AppSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = APPS.find((a) => a.match(pathname)) ?? APPS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <motion.button
            whileTap={{ scale: 0.97, transition: SPRING_PRESS }}
            className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left outline-none"
          >
            <WrenchWordmark size={20} />
            <ChevronDown size={13} className="text-muted-foreground" />
          </motion.button>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Aplicativos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {APPS.map((app) => {
          const isActive = app.id === current.id;
          return (
            <DropdownMenuItem
              key={app.id}
              onClick={() => router.push(app.href)}
            >
              <span className="flex-1 text-sm">{app.label}</span>
              {isActive && <Check size={14} className="text-[var(--wrench-accent)]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
