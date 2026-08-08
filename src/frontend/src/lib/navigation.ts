import {
  Gauge,
  LayoutDashboard,
  Package,
  Wrench,
  ClipboardList,
  PlusCircle,
  Users,
  Car,
  Boxes,
  ArrowLeftRight,
  TrendingUp,
  ShoppingCart,
  Banknote,
  Wallet,
  Receipt,
  FileText,
  Settings,
  BarChart2,
  PieChart,
  Building2,
  UsersRound,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type View = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
};

/**
 * Categoria do módulo — agrupamento no SideNav.
 * 'workspace' fica sempre no topo, sem header de categoria.
 */
export type ModuleCategory =
  | "workspace"
  | "catalogo"
  | "ordens"
  | "clientes"
  | "estoque"
  | "vendas"
  | "financeiro"
  | "fiscal"
  | "relatorios"
  | "sistema";

export type Module = {
  id: string;
  label: string;
  icon: LucideIcon;
  views: View[];
  category: ModuleCategory;
};

export const MODULES: Module[] = [
  // ── WORKSPACE ──
  {
    id: "workspace",
    label: "Workspace",
    icon: Gauge,
    category: "workspace",
    views: [
      { id: "workspace", label: "Workspace", icon: Gauge, path: "/workspace" },
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },

  // ── CATÁLOGO ──
  {
    id: "catalogo",
    label: "Catálogo",
    icon: Package,
    category: "catalogo",
    views: [
      { id: "pecas", label: "Peças", icon: Package, path: "/catalogo/pecas" },
      { id: "servicos", label: "Serviços", icon: Wrench, path: "/catalogo/servicos" },
    ],
  },

  // ── ORDENS DE SERVIÇO (núcleo) ──
  {
    id: "ordens",
    label: "Ordens de Serviço",
    icon: ClipboardList,
    category: "ordens",
    views: [
      { id: "kanban", label: "Kanban", icon: LayoutDashboard, path: "/ordens-servico/kanban" },
      { id: "lista", label: "Lista", icon: ClipboardList, path: "/ordens-servico" },
      { id: "nova", label: "Nova OS", icon: PlusCircle, path: "/ordens-servico/nova" },
    ],
  },

  // ── CLIENTES ──
  {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    category: "clientes",
    views: [
      { id: "lista", label: "Clientes", icon: Users, path: "/clientes" },
      { id: "veiculos", label: "Veículos", icon: Car, path: "/clientes/veiculos" },
    ],
  },

  // ── ESTOQUE ──
  {
    id: "estoque",
    label: "Estoque",
    icon: Boxes,
    category: "estoque",
    views: [
      { id: "movimentos", label: "Movimentos", icon: ArrowLeftRight, path: "/estoque" },
      { id: "saldo", label: "Saldo", icon: Boxes, path: "/estoque/saldo" },
    ],
  },

  // ── VENDAS ──
  {
    id: "vendas",
    label: "Vendas",
    icon: ShoppingCart,
    category: "vendas",
    views: [
      { id: "balcao", label: "Balcão", icon: ShoppingCart, path: "/vendas/balcao" },
      { id: "caixa", label: "Caixa & Tesouraria", icon: Banknote, path: "/vendas/caixa" },
    ],
  },

  // ── FINANCEIRO ──
  {
    id: "financeiro",
    label: "Financeiro",
    icon: Wallet,
    category: "financeiro",
    views: [
      { id: "fluxo", label: "Fluxo de Caixa", icon: TrendingUp, path: "/financeiro/fluxo" },
      { id: "lancamentos", label: "Lançamentos", icon: Receipt, path: "/financeiro/lancamentos" },
    ],
  },

  // ── FISCAL ──
  {
    id: "fiscal",
    label: "Fiscal",
    icon: FileText,
    category: "fiscal",
    views: [
      { id: "documentos", label: "Documentos", icon: FileText, path: "/fiscal/documentos" },
      { id: "configuracao", label: "Configuração", icon: Settings, path: "/fiscal/configuracao" },
    ],
  },

  // ── RELATÓRIOS ──
  {
    id: "relatorios",
    label: "Relatórios",
    icon: BarChart2,
    category: "relatorios",
    views: [
      { id: "kpis", label: "KPIs", icon: PieChart, path: "/relatorios/kpis" },
      { id: "faturamento", label: "Faturamento", icon: BarChart2, path: "/relatorios/faturamento" },
    ],
  },

  // ── SISTEMA ──
  {
    id: "sistema",
    label: "Sistema",
    icon: Settings,
    category: "sistema",
    views: [
      { id: "empresa", label: "Empresa & Lojas", icon: Building2, path: "/sistema/empresa" },
      { id: "usuarios", label: "Usuários", icon: UsersRound, path: "/sistema/usuarios" },
      { id: "permissoes", label: "Perfis & Permissões", icon: Shield, path: "/sistema/permissoes" },
    ],
  },
];

/**
 * Ordem de exibição das categorias no SideNav.
 * 'workspace' fica sempre no topo (sem header); as demais seguem esta ordem.
 */
export const CATEGORY_ORDER: ModuleCategory[] = [
  "workspace",
  "catalogo",
  "ordens",
  "clientes",
  "estoque",
  "vendas",
  "financeiro",
  "fiscal",
  "relatorios",
  "sistema",
];

/** Label legível por categoria (header do agrupamento no SideNav). */
export const CATEGORY_LABEL: Record<Exclude<ModuleCategory, "workspace">, string> = {
  catalogo: "Catálogo",
  ordens: "Oficina",
  clientes: "Clientes",
  estoque: "Estoque",
  vendas: "Vendas",
  financeiro: "Financeiro",
  fiscal: "Fiscal",
  relatorios: "Relatórios",
  sistema: "Sistema",
};

export const DEFAULT_PATH = "/workspace";

/** Resolve módulo pelo pathname (primeiro match por prefixo). */
export function getModuleByPath(pathname: string): Module | undefined {
  // Caso especial: /dashboard pertence ao workspace
  if (pathname === "/dashboard" || pathname === "/workspace") {
    return MODULES.find((m) => m.id === "workspace");
  }
  return MODULES.find((m) => {
    if (m.id === "workspace") return false;
    return m.views.some((v) => pathname.startsWith(v.path));
  });
}

/** Resolve view pelo pathname. */
export function getViewByPath(pathname: string): View | undefined {
  for (const mod of MODULES) {
    const view = mod.views.find((v) => pathname.startsWith(v.path));
    if (view) return view;
  }
  return undefined;
}
