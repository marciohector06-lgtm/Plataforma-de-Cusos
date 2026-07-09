import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { MeusCursosTable } from "@/components/aluno/MeusCursosTable";

export default async function MeusCursosPage() {
  const session = await requireSession();

  const matriculas = await db.matricula.findMany({
    where: { alunoId: session.user.id },
    include: { turma: { include: { curso: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meus Cursos"
        description="Acompanhe suas matrículas e o progresso em cada turma."
      />
      <MeusCursosTable data={matriculas} />
    </div>
  );
}
