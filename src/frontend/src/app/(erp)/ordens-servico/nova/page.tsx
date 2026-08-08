"use client";

import { PlusCircle } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Nova Ordem de Serviço"
      subtitle="Abrir uma nova OS"
      icon={PlusCircle}
      description="Formulário com cliente, veículo, itens de peça/serviço e totais. Disponível na Fase 2."
    />
  );
}