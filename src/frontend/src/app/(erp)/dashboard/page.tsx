"use client";

import { LayoutDashboard } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Dashboard"
      subtitle="Indicadores e métricas da oficina"
      icon={LayoutDashboard}
      description="Gráficos de faturamento, OS por status e top peças. Disponível na Fase 2."
    />
  );
}