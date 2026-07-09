import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { AvaliacoesTable } from "@/components/instrutor/AvaliacoesTable";

export default async function InstrutorAvaliacoesPage() {
  const session = await requireSession();

  const avaliacoes = await db.avaliacao.findMany({
    where: { curso: { autorId: session.user.id } },
    include: { curso: true, _count: { select: { questoes: true, tentativas: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avaliações"
        description="Avaliações dos seus cursos."
      />
      <AvaliacoesTable avaliacoes={avaliacoes} />
    </div>
  );
}
