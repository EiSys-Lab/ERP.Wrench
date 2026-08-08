"use client";

import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Clientes"
      subtitle="Cadastro de clientes"
      icon={Users}
      description="Lista de clientes com histórico de OS e veículos vinculados. Disponível na Fase 2."
    />
  );
}