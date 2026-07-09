import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { CursosTable } from "@/components/gestor/CursosTable";
import { CursoFormDialog } from "@/components/gestor/CursoFormDialog";

export default async function GestorCursosPage() {
  const [cursos, instrutores] = await Promise.all([
    db.curso.findMany({
      include: { autor: true, _count: { select: { turmas: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findMany({
      where: { role: "INSTRUTOR" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cursos"
        description="Todos os cursos cadastrados na plataforma."
        actions={<CursoFormDialog instrutores={instrutores} />}
      />
      <CursosTable cursos={cursos} instrutores={instrutores} />
    </div>
  );
}
