"use client";

import { Shield, Check, X } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { Button } from "@/components/ui/button";
import { PERFIS_MOCK } from "../mock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Wrench PermissoesView — matriz de perfis × módulos (acessar/editar). */
export function PermissoesView() {
  const modulos = PERFIS_MOCK[0].permissoes.map((p) => p.modulo);

  return (
    <>
      <PageHeader
        title="Perfis & Permissões"
        subtitle="Controle de acesso por módulo"
        actions={<Button size="sm" onClick={() => toast.success("Permissões salvas")}>Salvar</Button>}
      />

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="responsive-table w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3">Módulo</th>
                {PERFIS_MOCK.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-center">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{p.nome}</p>
                      <p className="text-[10px] text-muted-foreground">{p.usuarios} usuário{p.usuarios !== 1 ? "s" : ""}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modulos.map((mod) => (
                <tr key={mod} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Shield size={13} className="text-muted-foreground" />
                      {mod}
                    </span>
                  </td>
                  {PERFIS_MOCK.map((perfil) => {
                    const perm = perfil.permissoes.find((p) => p.modulo === mod);
                    const acessar = perm?.acessar ?? false;
                    const editar = perm?.editar ?? false;
                    return (
                      <td key={perfil.id} className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("flex items-center gap-1 text-[11px]", acessar ? "text-[var(--status-ok)]" : "text-muted-foreground")}>
                            {acessar ? <Check size={12} /> : <X size={12} />} Acessar
                          </span>
                          <span className={cn("flex items-center gap-1 text-[11px]", editar ? "text-[var(--status-ok)]" : "text-muted-foreground")}>
                            {editar ? <Check size={12} /> : <X size={12} />} Editar
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Descrição dos perfis */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PERFIS_MOCK.map((p) => (
          <GlassCard key={p.id} className="p-4">
            <p className="text-sm font-semibold text-foreground">{p.nome}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{p.descricao}</p>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
