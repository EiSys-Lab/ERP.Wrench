"use client";

import { useState } from "react";
import { Search, Plus, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/atoms/glass-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/atoms/status-badge";
import { USUARIO_STATUS_TONE } from "../types";
import { USUARIOS_MOCK } from "../mock";
import { formatDateTime } from "@/lib/formatters";
import { toast } from "sonner";

export function UsuariosView() {
  const [busca, setBusca] = useState("");
  const usuarios = USUARIOS_MOCK.filter(
    (u) => !busca || u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle={`${USUARIOS_MOCK.length} usuários cadastrados`}
        actions={<Button size="sm" onClick={() => toast.info("Novo usuário — Fase 3")}><Plus size={14} /> Novo usuário</Button>}
      />

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar usuário..." className="pl-9" />
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="responsive-table w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-2.5">Usuário</th>
                <th className="px-4 py-2.5">Perfil</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Último acesso</th>
              </tr>
            </thead>
            <tbody className="stagger-rows">
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0 hover:bg-[var(--glass-bg-hover)]">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[var(--wrench-accent-soft)] text-[10px] font-bold text-[var(--wrench-accent)]">
                        {u.nome[0]}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.nome}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{u.perfil}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge tone={USUARIO_STATUS_TONE[u.status]} size="sm">{u.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] text-muted-foreground">{u.ultimoAcesso ? formatDateTime(u.ultimoAcesso) : "Nunca"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}
