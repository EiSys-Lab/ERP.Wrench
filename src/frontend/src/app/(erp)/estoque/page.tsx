"use client";

import { ArrowLeftRight } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Movimentos de Estoque"
      subtitle="Entradas e saídas de peças"
      icon={ArrowLeftRight}
      description="Trilha imutável de movimentos de estoque por peça. Disponível na Fase 2."
    />
  );
}