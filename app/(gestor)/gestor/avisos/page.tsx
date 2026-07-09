import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvisoForm } from "@/components/gestor/AvisoForm";
import { NotificacoesTable } from "@/components/gestor/NotificacoesTable";

export default async function GestorAvisosPage() {
  const enviados = await db.notificacao.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avisos"
        description="Envie um comunicado para alunos, instrutores ou todos os usuários."
      />

      <Card>
        <CardHeader>
          <CardTitle>Novo aviso</CardTitle>
        </CardHeader>
        <CardContent>
          <AvisoForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos avisos enviados</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificacoesTable notificacoes={enviados} />
        </CardContent>
      </Card>
    </div>
  );
}
