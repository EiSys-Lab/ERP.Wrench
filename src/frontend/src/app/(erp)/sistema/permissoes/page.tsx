"use client";

import { Shield } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Perfis & Permissões"
      subtitle="Controle de acesso"
      icon={Shield}
      description="Perfis (admin, mecânico, caixa) e suas permissões. Disponível na Fase 2."
    />
  );
}