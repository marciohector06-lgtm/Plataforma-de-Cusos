import { CalendarDays } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { formatDate, turmaStatusLabels } from "@/lib/utils";

export default async function InstrutorAgendaPage() {
  const session = await requireSession();

  const turmas = await db.turma.findMany({
    where: { instrutorId: session.user.id },
    include: { curso: true, _count: { select: { matriculas: true } } },
    orderBy: { dataInicio: "asc" },
  });

  const hoje = new Date();
  const proximas = turmas.filter((t) => t.dataFim >= hoje);
  const encerradas = turmas.filter((t) => t.dataFim < hoje);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Cronograma das turmas que você leciona."
      />

      {turmas.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma turma agendada"
          description="Assim que uma turma for atribuída a você, ela aparecerá aqui."
        />
      ) : (
        <div className="space-y-6">
          {proximas.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Em andamento / próximas
              </h2>
              {proximas.map((turma) => (
                <div
                  key={turma.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-medium text-brand-navy">
                      {turma.curso.titulo} — {turma.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(turma.dataInicio)} a {formatDate(turma.dataFim)} ·{" "}
                      {turma._count.matriculas}/{turma.vagas} vagas
                    </p>
                  </div>
                  <Badge variant="outline">{turmaStatusLabels[turma.status]}</Badge>
                </div>
              ))}
            </div>
          )}

          {encerradas.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Encerradas
              </h2>
              {encerradas.map((turma) => (
                <div
                  key={turma.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 opacity-70"
                >
                  <div>
                    <p className="font-medium text-brand-navy">
                      {turma.curso.titulo} — {turma.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(turma.dataInicio)} a {formatDate(turma.dataFim)}
                    </p>
                  </div>
                  <Badge variant="outline">{turmaStatusLabels[turma.status]}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
