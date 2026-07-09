import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContratosTable } from "@/components/aluno/ContratosTable";

export default async function ContratosPage() {
  const session = await requireSession();

  const contratos = await db.contrato.findMany({
    where: { alunoId: session.user.id },
    include: { turma: { include: { curso: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contratos"
        description="Contratos de matrícula vinculados às suas turmas."
      />
      <ContratosTable data={contratos} />
    </div>
  );
}
