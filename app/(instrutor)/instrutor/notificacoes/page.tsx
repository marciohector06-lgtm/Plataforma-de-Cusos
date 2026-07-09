import { Bell } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { marcarNotificacaoComoLidaAction } from "@/lib/actions/notificacoes";
import { cn, formatDateTime } from "@/lib/utils";

export default async function InstrutorNotificacoesPage() {
  const session = await requireSession();

  const notificacoes = await db.notificacao.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Avisos e atualizações da plataforma."
      />

      {notificacoes.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nenhuma notificação"
          description="Você será avisado aqui sobre atualizações importantes."
        />
      ) : (
        <div className="space-y-3">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4",
                !n.lida && "border-l-4 border-l-brand-teal"
              )}
            >
              <div>
                <p className="font-medium text-brand-navy">{n.titulo}</p>
                <p className="text-sm text-muted-foreground">{n.mensagem}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(n.createdAt)}
                </p>
              </div>
              {!n.lida && (
                <form
                  action={marcarNotificacaoComoLidaAction.bind(
                    null,
                    n.id,
                    "/instrutor/notificacoes"
                  )}
                >
                  <Button type="submit" variant="outline" size="sm">
                    Marcar como lida
                  </Button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
