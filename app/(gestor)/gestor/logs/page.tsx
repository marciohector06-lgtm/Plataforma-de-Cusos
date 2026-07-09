import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { LogsTable } from "@/components/gestor/LogsTable";

export default async function GestorLogsPage() {
  const logs = await db.logAtividade.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs"
        description="Registro de auditoria de ações realizadas na plataforma."
      />
      <LogsTable logs={logs} />
    </div>
  );
}
