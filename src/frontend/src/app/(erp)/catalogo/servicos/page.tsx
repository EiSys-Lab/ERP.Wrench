"use client";

import { Wrench } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Serviços"
      subtitle="Catálogo de mão de obra"
      icon={Wrench}
      description="Cadastro de serviços (mão de obra) com valor base e tempo estimado. Disponível na Fase 2."
    />
  );
}