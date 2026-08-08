"use client";

import { TrendingUp } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Fluxo de Caixa"
      subtitle="Entradas e saídas do período"
      icon={TrendingUp}
      description="Projeção de fluxo de caixa por dia/semana/mês. Disponível na Fase 2."
    />
  );
}