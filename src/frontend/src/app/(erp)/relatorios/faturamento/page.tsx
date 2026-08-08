"use client";

import { BarChart2 } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Faturamento"
      subtitle="Análise de receita"
      icon={BarChart2}
      description="Faturamento por período, cliente e categoria. Disponível na Fase 2."
    />
  );
}