"use client";

import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { EMPRESA_MOCK } from "../mock";
import { fadeUp } from "@/lib/motion";
import { motion } from "motion/react";
import { toast } from "sonner";

export function EmpresaView() {
  const [empresa, setEmpresa] = useState(EMPRESA_MOCK);
  return (
    <>
      <PageHeader
        title="Empresa & Lojas"
        subtitle="Dados cadastrais da oficina"
        actions={<Button size="sm" onClick={() => toast.success("Dados salvos")}><Save size={14} /> Salvar</Button>}
      />
      <motion.div {...fadeUp(0)}>
        <GlassCard className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 size={15} className="text-[var(--wrench-accent)]" />
            Dados da empresa
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Razão social" className="col-span-2"><Input value={empresa.razaoSocial} onChange={(e) => setEmpresa({ ...empresa, razaoSocial: e.target.value })} /></Field>
            <Field label="Nome fantasia"><Input value={empresa.nomeFantasia} onChange={(e) => setEmpresa({ ...empresa, nomeFantasia: e.target.value })} /></Field>
            <Field label="CNPJ"><Input value={empresa.cnpj} onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })} className="tabular" /></Field>
            <Field label="Inscrição estadual"><Input value={empresa.inscricaoEstadual} onChange={(e) => setEmpresa({ ...empresa, inscricaoEstadual: e.target.value })} className="tabular" /></Field>
            <Field label="Telefone"><Input value={empresa.telefone} onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })} className="tabular" /></Field>
            <Field label="Email"><Input value={empresa.email} onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })} /></Field>
            <Field label="Endereço" className="col-span-2"><Input value={empresa.endereco} onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })} /></Field>
            <Field label="Cidade"><Input value={empresa.cidade} onChange={(e) => setEmpresa({ ...empresa, cidade: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Estado"><Input value={empresa.estado} onChange={(e) => setEmpresa({ ...empresa, estado: e.target.value })} /></Field>
              <Field label="CEP"><Input value={empresa.cep} onChange={(e) => setEmpresa({ ...empresa, cep: e.target.value })} className="tabular" /></Field>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}
