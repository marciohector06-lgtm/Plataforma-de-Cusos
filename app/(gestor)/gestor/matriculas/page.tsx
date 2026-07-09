import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { MatriculasTable } from "@/components/gestor/MatriculasTable";
import { MatriculaFormDialog } from "@/components/gestor/MatriculaFormDialog";

export default async function GestorMatriculasPage() {
  const [matriculas, alunos, turmas] = await Promise.all([
    db.matricula.findMany({
      include: { aluno: true, turma: { include: { curso: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findMany({
      where: { role: "ALUNO" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.turma.findMany({
      select: { id: true, nome: true, curso: { select: { titulo: true } } },
      orderBy: { nome: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matrículas"
        description="Todas as matrículas registradas na plataforma."
        actions={<MatriculaFormDialog alunos={alunos} turmas={turmas} />}
      />
      <MatriculasTable matriculas={matriculas} alunos={alunos} turmas={turmas} />
    </div>
  );
}
