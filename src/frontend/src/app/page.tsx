import { redirect } from "next/navigation";

/**
 * Raiz → redireciona para o workspace.
 * AuthGuard do (erp) cuida do redirect para /login se não autenticado.
 */
export default function RootPage() {
  redirect("/workspace");
}
