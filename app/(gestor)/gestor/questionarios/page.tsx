import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuestoesTable } from "@/components/gestor/QuestoesTable";
import { QuestaoFormDialog } from "@/components/gestor/QuestaoFormDialog";

export default async function GestorQuestionariosPage() {
  const [questoes, avaliacoesRaw] = await Promise.all([
    db.questao.findMany({
      include: { avaliacao: { include: { curso: true } }, alternativas: true },
      orderBy: { ordem: "asc" },
    }),
    db.avaliacao.findMany({
      include: { curso: { select: { titulo: true } } },
      orderBy: { titulo: "asc" },
    }),
  ]);

  const avaliacoes = avaliacoesRaw.map((a) => ({
    id: a.id,
    titulo: a.titulo,
    cursoTitulo: a.curso.titulo,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Questionários"
        description="Banco de questões de todas as avaliações da plataforma."
        actions={<QuestaoFormDialog avaliacoes={avaliacoes} />}
      />
      <QuestoesTable questoes={questoes} avaliacoes={avaliacoes} />
    </div>
  );
}
