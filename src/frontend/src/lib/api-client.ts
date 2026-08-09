/**
 * Wrench — HTTP client.
 *
 * Na Fase 0-3 (Front End First) o app usa dados mockados, então este client
 * fica inerte. Na Fase 7 (integração backend) ele ganha vida: cada feature
 * troca seus mocks por apiGet/apiPost via TanStack Query.
 *
 * Padrão ProblemDetails (RFC 7807): { status, title?, detail?, errors? }.
 * 401 → logout automático + redirect /login.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5012";

/** ProblemDetails RFC 7807 enriquecido com categoria e traceId. */
export type ApiProblem = {
  status?: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  /** Categoria do erro (do backend): ValidationError, ServerError, etc. */
  category?: string;
  /** ID de rastreamento para o suporte. */
  traceId?: string;
  timestamp?: string;
};

/** Tipo de erro para classificação UI. */
export type ErrorKind = "user" | "system" | "network" | "auth";

/**
 * Classifica um erro e retorna a mensagem certa para o usuário.
 *
 * - user: erro de validação (input inválido). Mensagem do backend.
 * - system: bug/infra. Mensagem genérica + traceId para suporte.
 * - network: API fora do ar / sem conexão. Orientação de retry.
 * - auth: sessão expirada. Orienta relogin.
 */
export function classifyError(err: unknown): {
  kind: ErrorKind;
  message: string;
  traceId?: string;
} {
  // Erro de rede (API não respondeu)
  if (err instanceof TypeError && err.message.includes("fetch")) {
    return {
      kind: "network",
      message: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    };
  }

  if (err instanceof ApiError) {
    const category = err.problem.category;
    const traceId = err.problem.traceId;

    // Erro de validação (usuário errou input)
    if (category === "ValidationError" || (err.status >= 400 && err.status < 500 && category !== "ServerError")) {
      return {
        kind: "user",
        // Mensagem do backend é amigável (ex: "Cliente é obrigatório")
        message: err.problem.detail ?? err.problem.title ?? "Dados inválidos. Verifique os campos e tente novamente.",
        traceId,
      };
    }

    // Não autorizado
    if (err.status === 401 || category === "Unauthorized") {
      return {
        kind: "auth",
        message: "Sua sessão expirou. Faça login novamente.",
        traceId,
      };
    }

    // Recurso não encontrado
    if (err.status === 404) {
      return {
        kind: "user",
        message: err.problem.detail ?? "Recurso não encontrado.",
        traceId,
      };
    }

    // Conflito de regra de negócio
    if (err.status === 409) {
      return {
        kind: "user",
        message: err.problem.detail ?? "Operação não permitida no estado atual.",
        traceId,
      };
    }

    // Erro de servidor (bug/infra)
    return {
      kind: "system",
      message: "Ocorreu um erro inesperado em nossos servidores. Nossa equipe já foi notificada.",
      traceId,
    };
  }

  // Erro genérico desconhecido
  return {
    kind: "system",
    message: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

/** Erro HTTP com ProblemDetails anexado. */
export class ApiError extends Error {
  status: number;
  problem: ApiProblem;

  constructor(status: number, problem: ApiProblem) {
    super(problem.title ?? problem.detail ?? `Erro ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

// Lógica de auth (logout em 401) é conectada na Fase 1, quando o store existe.
// Por ora, hook inerte que não quebra o build.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

function getAuthToken(): string | null {
  // Lido fora do React na Fase 1 via useAuth.getState().token.
  // Guard em try/catch: roda também no SSR onde localStorage não existe.
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("wrench-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    ...init,
  });

  if (res.status === 401) {
    onUnauthorized?.();
  }

  if (!res.ok) {
    let problem: ApiProblem = { status: res.status };
    try {
      problem = (await res.json()) as ApiProblem;
    } catch {
      /* corpo vazio — mantém status */
    }
    throw new ApiError(res.status, problem);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiGet = <T>(path: string, init?: RequestInit) =>
  request<T>("GET", path, undefined, init);

export const apiPost = <TBody, TResp = TBody>(path: string, body?: TBody, init?: RequestInit) =>
  request<TResp>("POST", path, body, init);

export const apiPut = <TBody, TResp = TBody>(path: string, body?: TBody, init?: RequestInit) =>
  request<TResp>("PUT", path, body, init);

export const apiPatch = <TBody, TResp = TBody>(path: string, body?: TBody, init?: RequestInit) =>
  request<TResp>("PATCH", path, body, init);

export const apiDelete = <T = void>(path: string, init?: RequestInit) =>
  request<T>("DELETE", path, undefined, init);

export const apiFormPost = <TResp>(path: string, formData: FormData, init?: RequestInit) =>
  request<TResp>("POST", path, formData, init);
