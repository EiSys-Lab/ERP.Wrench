/**
 * Wrench — Ordens de Serviço API.
 */
import { apiGet, apiPost } from "@/lib/api-client";
import type { OrdemServico, OsItem, OsStatus, PagamentoStatus, OsItemTipo } from "./types";

export type OsSummaryDto = {
  id: string;
  numero: number;
  clienteNome: string;
  veiculoPlaca: string;
  veiculoModelo: string;
  status: string;
  totalPecas: number;
  totalMaoDeObra: number;
  totalGeral: number;
  pagamentoStatus: string;
  dataEntrada: string;
  itensCount: number;
};

export async function listarOrdens(status?: string): Promise<OsSummaryDto[]> {
  const query = status ? `?status=${status}` : "";
  return apiGet<OsSummaryDto[]>(`/api/ordens-servico${query}`);
}

export async function avancarOs(id: string, statusDestino: string): Promise<void> {
  await apiPost<{}, void>(`/api/ordens-servico/${id}/avancar`, { statusDestino });
}

// ─── Adapter: DTO → tipo local OrdemServico ──────────────────────────

export function osSummaryDtoToOs(dto: OsSummaryDto): OrdemServico {
  return {
    id: dto.id,
    numero: dto.numero,
    clienteId: "",
    clienteNome: dto.clienteNome,
    veiculo: { placa: dto.veiculoPlaca, modelo: dto.veiculoModelo },
    status: dto.status as OsStatus,
    itens: [],
    pagamentos: [],
    totalPecas: dto.totalPecas,
    totalMaoDeObra: dto.totalMaoDeObra,
    desconto: 0,
    totalGeral: dto.totalGeral,
    totalPago: 0,
    pagamentoStatus: dto.pagamentoStatus as PagamentoStatus,
    dataEntrada: dto.dataEntrada,
  };
}
