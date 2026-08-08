"use client";

import { Banknote } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Caixa & Tesouraria"
      subtitle="Turnos de caixa e movimentos"
      icon={Banknote}
      description="Abertura/fechamento de turno, sangrias e suprimentos. Disponível na Fase 2."
    />
  );
}