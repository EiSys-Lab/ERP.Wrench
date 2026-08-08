"use client";

import { LayoutDashboard } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Kanban OS"
      subtitle="Quadro de ordens por estágio"
      icon={LayoutDashboard}
      description="Arraste OS entre estágios: Aberta, Em andamento, Pronta, Faturada, Entregue. Disponível na Fase 2."
    />
  );
}