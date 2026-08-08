/**
 * Wrench — Tipos de Ordem de Serviço.
 *
 * Casam 1:1 com os SmartEnums e agregados do futuro backend C#
 * (Wrench.Domain.OrdensServico). JSON camelCase sempre (lição Indagor).
 *
 * Mapeamento do Excel original:
 * - Cada linha (peça + cliente + placa + data) vira um OsItem.
 * - Coluna H (=PRODUCT(E,F)) → OsItem.subtotal
 * - Coluna J (=SUM(H,I)) → OsItem.valorFinal
 * - Coluna M (=SUM(H:H,I:I)) → OrdemServico.totalGeral
 * - Coluna D (estoque) → baixa automática ao finalizar (domain event)
 */

// ─── Enums (batem com SmartEnums C#) ──────────────────────────────────────

export type OsStatus =
  | "Aberta"
  | "EmAndamento"
  | "AguardandoAprovacao"
  | "Aprovada"
  | "EmExecucao"
  | "Pronta"
  | "Faturada"
  | "Entregue"
  | "Concluida"
  | "Cancelada";

export type OsItemTipo = "Peca" | "Servico";

export type FormaPagamento =
  | "Dinheiro"
  | "Pix"
  | "Debito"
  | "Credito"
  | "Boleto"
  | "Prazo";

export type PagamentoStatus =
  | "Pendente"
  | "Pago"
  | "Parcial"
  | "Isento";

// ─── Entidades ────────────────────────────────────────────────────────────

export type OsItem = {
  id: string;
  tipo: OsItemTipo;
  /** FK para Peca (se tipo=Peca) — snapshot vem do catálogo. */
  pecaId?: string;
  /** FK para Servico (se tipo=Servico). */
  servicoId?: string;
  /** Nome legível (snapshot no momento da inclusão). */
  nome: string;
  codigo?: string;
  /** Compartimento/gaveta (só peça) — localização física. */
  compartimento?: string;
  quantidade: number;
  precoUnitario: number;
  /** = quantidade × precoUnitario (equivalente à coluna H do Excel). */
  subtotal: number;
  /** Valor da mão de obra do item (equivalente à coluna I do Excel). */
  maoDeObra: number;
  /** = subtotal + maoDeObra (equivalente à coluna J do Excel). */
  valorFinal: number;
};

export type OsPagamento = {
  id: string;
  forma: FormaPagamento;
  valor: number;
  pagoEm: string;
};

export type VeiculoResumo = {
  placa: string;
  modelo: string;
  marca?: string;
  ano?: number;
  cor?: string;
};

export type OrdemServico = {
  id: string;
  /** Número humano sequencial (#0142 etc). */
  numero: number;
  clienteId: string;
  clienteNome: string;
  veiculo: VeiculoResumo;
  /** Mecânico responsável pela execução. */
  mecanicoNome?: string;
  status: OsStatus;
  itens: OsItem[];
  pagamentos: OsPagamento[];
  /** Σ subtotais dos itens peça. */
  totalPecas: number;
  /** Σ mão de obra dos itens. */
  totalMaoDeObra: number;
  desconto: number;
  /** = totalPecas + totalMaoDeObra − desconto. */
  totalGeral: number;
  /** Valor já pago (Σ pagamentos). */
  totalPago: number;
  pagamentoStatus: PagamentoStatus;
  dataEntrada: string;
  dataSaida?: string;
  observacoes?: string;
};

// ─── Config de UI (estágios Kanban, cores, labels) ────────────────────────

export type OsStageId =
  | "Aberta"
  | "EmExecucao"
  | "Pronta"
  | "Faturada"
  | "Entregue";

export type OsStage = {
  id: OsStageId;
  label: string;
  /** Status que pertencem a este estágio do Kanban. */
  statuses: OsStatus[];
  /** Cor accent do estágio (barra superior dos cards). */
  accent: string;
  /** Cor soft de fundo (coluna). */
  soft: string;
};

export const OS_STAGES: OsStage[] = [
  {
    id: "Aberta",
    label: "Abertas",
    statuses: ["Aberta", "AguardandoAprovacao", "Aprovada"],
    accent: "var(--status-info)",
    soft: "color-mix(in oklch, var(--status-info) 6%, transparent)",
  },
  {
    id: "EmExecucao",
    label: "Em execução",
    statuses: ["EmAndamento", "EmExecucao"],
    accent: "var(--wrench-accent)",
    soft: "color-mix(in oklch, var(--wrench-accent) 6%, transparent)",
  },
  {
    id: "Pronta",
    label: "Prontas",
    statuses: ["Pronta"],
    accent: "var(--status-warn)",
    soft: "color-mix(in oklch, var(--status-warn) 6%, transparent)",
  },
  {
    id: "Faturada",
    label: "Faturadas",
    statuses: ["Faturada"],
    accent: "var(--chart-4)",
    soft: "color-mix(in oklch, var(--chart-4) 6%, transparent)",
  },
  {
    id: "Entregue",
    label: "Entregues",
    statuses: ["Entregue", "Concluida"],
    accent: "var(--status-ok)",
    soft: "color-mix(in oklch, var(--status-ok) 6%, transparent)",
  },
];

/** Resolve em qual estágio do Kanban uma OS está. */
export function stageOf(os: OrdemServico): OsStage {
  return (
    OS_STAGES.find((s) => s.statuses.includes(os.status)) ?? OS_STAGES[0]
  );
}

/** Label legível por status. */
export const OS_STATUS_LABEL: Record<OsStatus, string> = {
  Aberta: "Aberta",
  EmAndamento: "Em andamento",
  AguardandoAprovacao: "Aguardando aprovação",
  Aprovada: "Aprovada",
  EmExecucao: "Em execução",
  Pronta: "Pronta",
  Faturada: "Faturada",
  Entregue: "Entregue",
  Concluida: "Concluída",
  Cancelada: "Cancelada",
};

/** Tom do StatusBadge por status. */
export const OS_STATUS_TONE: Record<
  OsStatus,
  "ok" | "warn" | "alert" | "info" | "muted"
> = {
  Aberta: "info",
  EmAndamento: "info",
  AguardandoAprovacao: "warn",
  Aprovada: "info",
  EmExecucao: "info",
  Pronta: "warn",
  Faturada: "info",
  Entregue: "ok",
  Concluida: "ok",
  Cancelada: "alert",
};

/** Tom do PagamentoStatus. */
export const PAGAMENTO_TONE: Record<
  PagamentoStatus,
  "ok" | "warn" | "alert" | "muted"
> = {
  Pago: "ok",
  Parcial: "warn",
  Pendente: "alert",
  Isento: "muted",
};

/** Próximo status válido (botão "Avançar" do drawer). */
export function proximoStatus(status: OsStatus): OsStatus | null {
  const ordem: OsStatus[] = [
    "Aberta",
    "Aprovada",
    "EmExecucao",
    "Pronta",
    "Faturada",
    "Entregue",
    "Concluida",
  ];
  const idx = ordem.indexOf(status);
  if (idx === -1 || idx === ordem.length - 1) return null;
  return ordem[idx + 1];
}
