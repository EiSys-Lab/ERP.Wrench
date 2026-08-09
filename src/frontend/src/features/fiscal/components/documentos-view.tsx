"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, FileText, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/organisms/page-header";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/atoms/glass-card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { KpiCard } from "@/components/molecules/kpi-card";
import {
  STATUS_DOC_TONE,
  MODELO_LABEL,
} from "../types";
import { DOCUMENTOS_FISCAIS_MOCK } from "../mock";
import { brl, formatDate, formatDateTime } from "@/lib/formatters";
import { fadeUp } from "@/lib/motion";

/**
 * Wrench DocumentosFiscaisView — lista de NF-e/NFC-e emitidas.
 */
export function DocumentosFiscaisView() {
  const [busca, setBusca] = useState("");
  const [modeloFiltro, setModeloFiltro] = useState("");

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return DOCUMENTOS_FISCAIS_MOCK.filter((d) => {
      const matchBusca =
        !q ||
        d.destinatario.toLowerCase().includes(q) ||
        String(d.numero).includes(q) ||
        d.chave.includes(q);
      const matchModelo = !modeloFiltro || d.modelo === modeloFiltro;
      return matchBusca && matchModelo;
    }).sort((a, b) => b.numero - a.numero);
  }, [busca, modeloFiltro]);

  const autorizadas = DOCUMENTOS_FISCAIS_MOCK.filter((d) => d.status === "Autorizada");
  const pendentes = DOCUMENTOS_FISCAIS_MOCK.filter((d) => d.status === "Pendente");
  const rejeitadas = DOCUMENTOS_FISCAIS_MOCK.filter((d) => d.status === "Rejeitada");
  const valorAutorizado = autorizadas.reduce((s, d) => s + d.valor, 0);

  return (
    <>
      <PageHeader title="Documentos Fiscais" subtitle="NF-e e NFC-e emitidas" />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard index={0} label="Autorizadas" value={autorizadas.length} icon={ShieldCheck} status="ok" />
        <KpiCard index={1} label="Pendentes" value={pendentes.length} icon={FileText} status="warn" />
        <KpiCard index={2} label="Rejeitadas" value={rejeitadas.length} icon={FileText} status="alert" />
        <KpiCard index={3} label="Valor autorizado" value={valorAutorizado} format={brl} icon={FileText} glow />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por número, destinatário ou chave..." className="pl-9" />
        </div>
        <select
          value={modeloFiltro}
          onChange={(e) => setModeloFiltro(e.target.value)}
          className="h-9 rounded-xl border border-line bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--wrench-accent)]"
        >
          <option value="">Todos modelos</option>
          <option value="NFe">NF-e</option>
          <option value="NFCe">NFC-e</option>
        </select>
      </div>

      <motion.div {...fadeUp(0.1)}>
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="px-4 py-2.5">Número</th>
                  <th className="px-4 py-2.5">Modelo</th>
                  <th className="px-4 py-2.5">Destinatário</th>
                  <th className="px-4 py-2.5">Emissão</th>
                  <th className="px-4 py-2.5 text-right">Valor</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="stagger-rows">
                {filtrados.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-2.5">
                      <span className="font-mono tabular text-xs font-semibold text-[var(--wrench-accent)]">
                        {String(d.numero).padStart(6, "0")}
                      </span>
                      <span className="ml-1 text-[10px] text-muted-foreground">série {d.serie}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={d.modelo === "NFe" ? "info" : "muted"} size="sm">
                        {MODELO_LABEL[d.modelo]}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium text-foreground">{d.destinatario}</p>
                      <p className="tabular text-[11px] text-muted-foreground">{d.documentoDest}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] text-muted-foreground">{formatDateTime(d.emissao)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="tabular text-sm font-medium text-foreground">{brl(d.valor)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={STATUS_DOC_TONE[d.status]} size="sm">
                        {d.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrados.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhum documento encontrado.
            </div>
          )}
        </GlassCard>
      </motion.div>
    </>
  );
}
