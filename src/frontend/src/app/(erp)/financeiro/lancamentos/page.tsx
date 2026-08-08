"use client";

import { Receipt } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Lançamentos"
      subtitle="Contas a receber e pagar"
      icon={Receipt}
      description="Títulos financeiros com status de pagamento. Disponível na Fase 2."
    />
  );
}