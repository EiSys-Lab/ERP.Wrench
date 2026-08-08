/**
 * Wrench template.tsx — re-montado a cada navegação (diferente do layout).
 * Aciona o stagger de fade-in escalonado via CSS puro (.app-template).
 * Opt-out: data-no-stagger no root da página.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="app-template h-full">{children}</div>;
}
