import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { MensagensTable } from "@/components/instrutor/MensagensTable";
import { MensagemFormDialog } from "@/components/instrutor/MensagemFormDialog";

export default async function InstrutorMensagensPage() {
  const session = await requireSession();

  const [mensagens, matriculas] = await Promise.all([
    db.mensagem.findMany({
      where: {
        OR: [{ remetenteId: session.user.id }, { destinatarioId: session.user.id }],
      },
      include: { remetente: true, destinatario: true },
      orderBy: { createdAt: "desc" },
    }),
    db.matricula.findMany({
      where: { turma: { instrutorId: session.user.id } },
      include: { aluno: true },
    }),
  ]);

  const alunos = Array.from(
    new Map(matriculas.map((m) => [m.aluno.id, { id: m.aluno.id, name: m.aluno.name }])).values()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensagens"
        description="Converse diretamente com seus alunos."
        actions={<MensagemFormDialog alunos={alunos} />}
      />
      <MensagensTable mensagens={mensagens} userId={session.user.id} />
    </div>
  );
}
