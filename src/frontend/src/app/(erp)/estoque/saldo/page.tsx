"use client";

import { Boxes } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Saldo de Estoque"
      subtitle="Quantidades atuais por peça"
      icon={Boxes}
      description="Saldo de cada peça com mínimo/máximo e sugestão de compra. Disponível na Fase 2."
    />
  );
}