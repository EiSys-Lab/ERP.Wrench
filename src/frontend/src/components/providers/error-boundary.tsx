"use client";

import React, { Component } from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { WrenchLogo } from "@/components/atoms/wrench-logo";
import { Button } from "@/components/ui/button";

/**
 * Wrench ErrorBoundary — captura crashes de renderização e mostra
 * uma tela de recovery amigável em vez de tela branca.
 *
 * Princípio UX: nunca deixar o usuário ver uma tela branca/quebrada.
 * Oferece "Tentar novamente" (reset do boundary) e "Voltar ao início".
 *
 * Uso: envolve o app inteiro no root layout.
 */
type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log estruturado no console (não envia para servidor por ora —
    // Fase futura: enviar para Sentry/observabilidade com traceId).
    console.error("[ErrorBoundary] Crash capturado:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = "/workspace";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="w-full max-w-md text-center"
        >
          {/* Ícone de erro */}
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--status-alert)_12%,transparent)]">
              <AlertTriangle size={32} className="text-[var(--status-alert)]" strokeWidth={1.5} />
            </div>
          </div>

          {/* Logo */}
          <WrenchLogo size={24} className="mx-auto mb-4 opacity-60" />

          {/* Mensagem */}
          <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
            Algo deu errado
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Ocorreu um erro inesperado ao carregar esta tela.
            Tente novamente — se o problema persistir, recarregue a página
            ou volte ao início.
          </p>

          {/* Ações de recovery */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={this.handleReset} variant="glass">
              <RefreshCw size={14} />
              Tentar novamente
            </Button>
            <Button onClick={this.handleGoHome}>
              <Home size={14} />
              Voltar ao início
            </Button>
          </div>

          {/* Detalhe técnico (colapsado, para dev) */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 rounded-xl border border-line bg-card-2 p-3 text-left">
              <summary className="cursor-pointer text-[11px] font-medium text-muted-foreground">
                Detalhes técnicos (dev)
              </summary>
              <pre className="mt-2 overflow-x-auto text-[10px] text-muted-foreground">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </motion.div>
      </div>
    );
  }
}
