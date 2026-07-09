import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { MeusCursosTable } from "@/components/instrutor/MeusCursosTable";

export default async function InstrutorMeusCursosPage() {
  const session = await requireSession();

  const cursos = await db.curso.findMany({
    where: { autorId: session.user.id },
    include: { _count: { select: { turmas: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Meus Cursos" description="Cursos que você criou." />
      <MeusCursosTable cursos={cursos} />
    </div>
  );
}
