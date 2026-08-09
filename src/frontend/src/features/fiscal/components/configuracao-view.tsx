"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  ShieldAlert,
  Upload,
  Building2,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { GlassCard } from "@/components/atoms/glass-card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Separator } from "@/components/ui/separator";
import {
  REGIME_LABEL,
  type RegimeTributario,
  type AmbienteSefaz,
} from "../types";
import { CONFIGURACAO_FISCAL_MOCK } from "../mock";
import { formatDate } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";
import { toast } from "sonner";

/**
 * Wrench ConfiguracaoFiscalView — certificado A1, regime, ambiente, séries.
 */
export function ConfiguracaoFiscalView() {
  const [config, setConfig] = useState(CONFIGURACAO_FISCAL_MOCK);

  function salvar() {
    toast.success("Configuração fiscal salva");
  }

  return (
    <>
      <PageHeader
        title="Configuração Fiscal"
        subtitle="Certificado digital, regime e ambiente SEFAZ"
        actions={<Button size="sm" onClick={salvar}>Salvar</Button>}
      />

      {/* Status do certificado */}
      <motion.div {...fadeUp(0)} className="mb-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-lg ${config.certificadoCarregado ? "bg-[color-mix(in_oklch,var(--status-ok)_14%,transparent)]" : "bg-[color-mix(in_oklch,var(--status-alert)_14%,transparent)]"}`}>
                {config.certificadoCarregado ? (
                  <ShieldCheck size={20} className="text-[var(--status-ok)]" />
                ) : (
                  <ShieldAlert size={20} className="text-[var(--status-alert)]" />
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Certificado A1 {config.certificadoCarregado ? "ativo" : "ausente"}
                </p>
                {config.certificadoValidade && (
                  <p className="text-[11px] text-muted-foreground">
                    Válido até {formatDate(config.certificadoValidade)}
                  </p>
                )}
              </div>
            </div>
            <Button size="sm" variant="glass" onClick={() => toast.info("Upload de certificado — Fase 3")}>
              <Upload size={13} /> {config.certificadoCarregado ? "Trocar" : "Carregar"}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Dados da empresa */}
      <motion.div {...fadeUp(0.1)} className="mb-4">
        <GlassCard className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 size={15} className="text-[var(--wrench-accent)]" />
            Dados da empresa
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Razão social">
              <Input value={config.razaoSocial} onChange={(e) => setConfig({ ...config, razaoSocial: e.target.value })} />
            </Field>
            <Field label="CNPJ">
              <Input value={config.cnpj} onChange={(e) => setConfig({ ...config, cnpj: e.target.value })} className="tabular" />
            </Field>
            <Field label="Inscrição estadual">
              <Input value={config.inscricaoEstadual} onChange={(e) => setConfig({ ...config, inscricaoEstadual: e.target.value })} className="tabular" />
            </Field>
            <Field label="Regime tributário">
              <select
                value={config.regime}
                onChange={(e) => setConfig({ ...config, regime: e.target.value as RegimeTributario })}
                className="flex h-9 w-full rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
              >
                {Object.entries(REGIME_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
          </div>
        </GlassCard>
      </motion.div>

      {/* Ambiente + Séries */}
      <motion.div {...fadeUp(0.2)}>
        <GlassCard className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText size={15} className="text-[var(--wrench-accent)]" />
            Ambiente SEFAZ e numeração
          </h2>
          <div className="mb-4">
            <Field label="Ambiente">
              <div className="flex gap-2">
                {(["Homologacao", "Producao"] as AmbienteSefaz[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setConfig({ ...config, ambiente: a })}
                    className={
                      config.ambiente === a
                        ? "flex-1 rounded-lg border-2 border-[var(--wrench-accent)] bg-[var(--wrench-accent-soft)] py-2 text-sm font-medium text-[var(--wrench-accent)]"
                        : "flex-1 rounded-lg border border-line py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    }
                  >
                    {a === "Homologacao" ? "Homologação" : "Produção"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Separator className="my-3" />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-card-2 p-3">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">NF-e</p>
              <p className="text-sm text-foreground">Série <span className="tabular font-semibold">{config.serieNFe}</span></p>
              <p className="text-[11px] text-muted-foreground">Próximo nº <span className="tabular">{config.proximoNumeroNFe}</span></p>
            </div>
            <div className="rounded-xl border border-line bg-card-2 p-3">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">NFC-e</p>
              <p className="text-sm text-foreground">Série <span className="tabular font-semibold">{config.serieNFCe}</span></p>
              <p className="text-[11px] text-muted-foreground">Próximo nº <span className="tabular">{config.proximoNumeroNFCe}</span></p>
            </div>
          </div>

          {config.ambiente === "Homologacao" && (
            <div className="mt-3 rounded-lg border border-[var(--status-warn)] bg-[color-mix(in_oklch,var(--status-warn)_8%,transparent)] p-3">
              <p className="text-xs text-[var(--status-warn)]">
                Ambiente de homologação: documentos emitidos aqui não têm validade fiscal.
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </>
  );
}
