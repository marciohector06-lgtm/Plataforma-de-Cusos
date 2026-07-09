import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { AvaliacoesTable } from "@/components/gestor/AvaliacoesTable";
import { AvaliacaoFormDialog } from "@/components/gestor/AvaliacaoFormDialog";

export default async function GestorAvaliacoesPage() {
  const [avaliacoes, cursos] = await Promise.all([
    db.avaliacao.findMany({
      include: { curso: true, _count: { select: { questoes: true, tentativas: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.curso.findMany({ select: { id: true, titulo: true }, orderBy: { titulo: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avaliações"
        description="Todas as avaliações cadastradas na plataforma."
        actions={<AvaliacaoFormDialog cursos={cursos} />}
      />
      <AvaliacoesTable avaliacoes={avaliacoes} cursos={cursos} />
    </div>
  );
}
