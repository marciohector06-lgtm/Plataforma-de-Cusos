import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { AlunosTable } from "@/components/gestor/AlunosTable";

export default async function GestorAlunosPage() {
  const alunos = await db.user.findMany({
    where: { role: "ALUNO" },
    include: { _count: { select: { matriculas: true, certificados: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        description="Todos os alunos cadastrados na plataforma."
      />
      <AlunosTable alunos={alunos} />
    </div>
  );
}
