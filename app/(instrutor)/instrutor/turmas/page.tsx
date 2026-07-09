import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { TurmasTable } from "@/components/instrutor/TurmasTable";

export default async function InstrutorTurmasPage() {
  const session = await requireSession();

  const turmas = await db.turma.findMany({
    where: { instrutorId: session.user.id },
    include: { curso: true, _count: { select: { matriculas: true } } },
    orderBy: { dataInicio: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Turmas" description="Turmas que você leciona." />
      <TurmasTable turmas={turmas} />
    </div>
  );
}
