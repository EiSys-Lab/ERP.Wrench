"use client";

import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Empresa & Lojas"
      subtitle="Dados cadastrais"
      icon={Building2}
      description="Configuração da empresa, CNPJ e unidades. Disponível na Fase 2."
    />
  );
}