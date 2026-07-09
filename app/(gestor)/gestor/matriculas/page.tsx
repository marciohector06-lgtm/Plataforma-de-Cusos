import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { MatriculasTable } from "@/components/gestor/MatriculasTable";

export default async function GestorMatriculasPage() {
  const matriculas = await db.matricula.findMany({
    include: { aluno: true, turma: { include: { curso: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matrículas"
        description="Todas as matrículas registradas na plataforma."
      />
      <MatriculasTable matriculas={matriculas} />
    </div>
  );
}
