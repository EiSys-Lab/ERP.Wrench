"use client";

import { UsersRound } from "lucide-react";
import { PlaceholderPage } from "@/components/organisms/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Usuários"
      subtitle="Gestão de acessos"
      icon={UsersRound}
      description="Usuários do sistema com perfis e permissões. Disponível na Fase 2."
    />
  );
}