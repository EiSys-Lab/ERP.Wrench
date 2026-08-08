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

/** ProblemDetails RFC 7807. */
export type ApiProblem = {
  status?: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

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
