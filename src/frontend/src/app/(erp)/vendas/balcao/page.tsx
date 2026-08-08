"use client";

import { ShoppingCart } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Vendas de Balcão"
      subtitle="PDV simplificado"
      icon={ShoppingCart}
      description="Venda avulsa de peças sem OS, com pagamento no balcão. Disponível na Fase 2."
    />
  );
}