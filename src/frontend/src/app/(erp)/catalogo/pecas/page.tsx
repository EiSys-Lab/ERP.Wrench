"use client";

import { Package } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Peças"
      subtitle="Catálogo de peças e componentes"
      icon={Package}
      description="Cadastro de peças com código, compartimento, preço e estoque. Disponível na Fase 2."
    />
  );
}