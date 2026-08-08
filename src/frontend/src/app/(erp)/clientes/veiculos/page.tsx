"use client";

import { Car } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Veículos"
      subtitle="Frota de clientes"
      icon={Car}
      description="Veículos por cliente com placa, modelo e histórico de atendimentos. Disponível na Fase 2."
    />
  );
}