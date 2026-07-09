import { LifeBuoy } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SuporteForm } from "@/components/aluno/SuporteForm";
import { formatDateTime } from "@/lib/utils";
import type { TicketStatus } from "@/lib/generated/prisma/client";

const statusLabel: Record<TicketStatus, string> = {
  ABERTO: "Aberto",
  EM_ANDAMENTO: "Em andamento",
  RESOLVIDO: "Resolvido",
  FECHADO: "Fechado",
};

export default async function SuportePage() {
  const session = await requireSession();

  const tickets = await db.ticketSuporte.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suporte"
        description="Abra um chamado ou acompanhe suas solicitações anteriores."
      />

      <Card>
        <CardHeader>
          <CardTitle>Novo chamado</CardTitle>
        </CardHeader>
        <CardContent>
          <SuporteForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meus chamados</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <EmptyState
              icon={LifeBuoy}
              title="Nenhum chamado aberto"
              description="Seus chamados de suporte aparecerão aqui."
            />
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="space-y-1 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-brand-navy">{t.assunto}</p>
                    <Badge variant="outline">{statusLabel[t.status]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.mensagem}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(t.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
