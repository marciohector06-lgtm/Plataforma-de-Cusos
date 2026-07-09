import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { AlunosTable } from "@/components/instrutor/AlunosTable";

export default async function InstrutorAlunosPage() {
  const session = await requireSession();

  const matriculas = await db.matricula.findMany({
    where: { turma: { instrutorId: session.user.id } },
    include: { aluno: true, turma: { include: { curso: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        description="Alunos matriculados nas suas turmas."
      />
      <AlunosTable matriculas={matriculas} />
    </div>
  );
}
