import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { TurmasTable } from "@/components/gestor/TurmasTable";
import { TurmaFormDialog } from "@/components/gestor/TurmaFormDialog";

export default async function GestorTurmasPage() {
  const [turmas, cursos, instrutores] = await Promise.all([
    db.turma.findMany({
      include: { curso: true, instrutor: true, _count: { select: { matriculas: true } } },
      orderBy: { dataInicio: "desc" },
    }),
    db.curso.findMany({ select: { id: true, titulo: true }, orderBy: { titulo: "asc" } }),
    db.user.findMany({
      where: { role: "INSTRUTOR" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Turmas"
        description="Todas as turmas cadastradas na plataforma."
        actions={<TurmaFormDialog cursos={cursos} instrutores={instrutores} />}
      />
      <TurmasTable turmas={turmas} cursos={cursos} instrutores={instrutores} />
    </div>
  );
}
