"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WrenchLogo } from "@/components/atoms/wrench-logo";
import { useAuth } from "@/store/use-auth";
import { SPRING_DRAWER } from "@/lib/motion";
import { apiPost } from "@/lib/api-client";

const loginSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginValues = z.infer<typeof loginSchema>;

/**
 * Wrench Login — Fase 0-3 (MOCK).
 * Aceita qualquer credencial. Na Fase 7 troca por apiPost('/api/identity/login').
 * Visual: glass card com mesh gradient de fundo (já vem do body::before).
 */
export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@wrench.com.br", password: "Admin@123" },
  });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      const resp = await apiPost<{ email: string; password: string }, {
        token: string;
        expiresAt: string;
        user: { userId: string; email: string; nome: string; tenantId: string };
      }>("/api/identity/login", values);

      login(resp);
      toast.success("Bem-vindo ao Wrench");
      router.replace("/workspace");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha na autenticação";
      setError("root", { message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING_DRAWER}
        className="bezel w-full max-w-sm p-2 shadow-soft-xl"
      >
        <div className="bezel-inner p-8">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center text-center">
            <WrenchLogo size={36} className="mb-3" />
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Wrench
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              ERP Oficina · Acesse sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Email" error={errors.email?.message} htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="voce@oficina.com.br"
                autoComplete="email"
                {...register("email")}
              />
            </Field>

            <Field label="Senha" error={errors.password?.message} htmlFor="password">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
              />
            </Field>

            {errors.root && (
              <p className="text-center text-[11px] text-[var(--status-alert)]">
                {errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="group w-full"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  Entrar
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={12} />
                  </span>
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-[10px] text-muted-foreground">
            Acesso restrito · admin@wrench.com.br
          </p>
        </div>
      </motion.div>
    </main>
  );
}
