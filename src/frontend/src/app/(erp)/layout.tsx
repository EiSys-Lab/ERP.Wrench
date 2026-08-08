import { ErpLayout } from "@/components/templates/erp-layout";
import { AuthGuard } from "@/components/providers/auth-guard";

export default function ErpRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ErpLayout>{children}</ErpLayout>
    </AuthGuard>
  );
}
