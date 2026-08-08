"use client";

import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Configuração Fiscal"
      subtitle="Certificado e regime tributário"
      icon={Settings}
      description="Configuração de certificado A1, regime e ambiente SEFAZ. Disponível na Fase 2."
    />
  );
}