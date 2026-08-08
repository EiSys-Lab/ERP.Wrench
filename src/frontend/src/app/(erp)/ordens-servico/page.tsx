"use client";

import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Ordens de Serviço"
      subtitle="Lista de OS da oficina"
      icon={ClipboardList}
      description="Lista de todas as ordens de serviço com filtros e detalhes. Disponível na Fase 2."
    />
  );
}