"use client";

import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Documentos Fiscais"
      subtitle="NF-e e NFC-e emitidas"
      icon={FileText}
      description="Lista de documentos fiscais com chave e status SEFAZ. Disponível na Fase 2."
    />
  );
}