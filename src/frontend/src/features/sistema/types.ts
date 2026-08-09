/** Wrench — Tipos de Sistema (empresa, usuários, perfis). */

export type Empresa = {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
};

export type UsuarioStatus = "Ativo" | "Inativo" | "Bloqueado";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: UsuarioStatus;
  ultimoAcesso?: string;
};

export type Perfil = {
  id: string;
  nome: string;
  descricao: string;
  usuarios: number;
  permissoes: { modulo: string; acessar: boolean; editar: boolean }[];
};

export const USUARIO_STATUS_TONE: Record<
  UsuarioStatus,
  "ok" | "muted" | "alert"
> = {
  Ativo: "ok",
  Inativo: "muted",
  Bloqueado: "alert",
};
