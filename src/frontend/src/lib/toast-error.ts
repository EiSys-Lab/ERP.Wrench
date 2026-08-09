"use client";

import { toast } from "sonner";
import { classifyError, type ErrorKind } from "./api-client";

/**
 * Mostra um toast de erro com a mensagem e tom corretos conforme a categoria.
 *
 * - user: vermelho, mensagem do backend (input inválido)
 * - system: vermelho, mensagem genérica + traceId para suporte
 * - network: âmbar, orientação de retry
 * - auth: âmbar, orienta relogin
 */
export function toastError(err: unknown): void {
  const { kind, message, traceId } = classifyError(err);

  const suffix = traceId ? `\nTrace: ${traceId.slice(0, 8)}` : "";

  if (kind === "network" || kind === "auth") {
    toast.warning(message + suffix);
  } else {
    toast.error(message + suffix);
  }
}

/**
 * Retorna o tom visual (para StatusBadge) conforme categoria do erro.
 */
export function errorTone(kind: ErrorKind): "alert" | "warn" {
  return kind === "network" || kind === "auth" ? "warn" : "alert";
}
