"use client";

import { PieChart } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="KPIs"
      subtitle="Indicadores-chave"
      icon={PieChart}
      description="KPIs de faturamento, produtividade e estoque. Disponível na Fase 2."
    />
  );
}