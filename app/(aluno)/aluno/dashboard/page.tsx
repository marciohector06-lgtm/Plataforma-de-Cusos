import { Award, BookOpen, TrendingUp } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProgressBar } from "@/components/shared/ProgressBar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function AlunoDashboardPage() {
  const session = await requireSession();

  const [matriculas, certificadosCount] = await Promise.all([
    db.matricula.findMany({
      where: { alunoId: session.user.id },
      include: { turma: { include: { curso: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.certificado.count({ where: { alunoId: session.user.id } }),
  ]);

  const progressoMedio =
    matriculas.length > 0
      ? Math.round(
          matriculas.reduce((acc, m) => acc + m.progresso, 0) /
            matriculas.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${session.user.name ?? "aluno"}`}
        description="Seu progresso e atividades recentes."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Cursos matriculados"
          value={matriculas.length}
        />
        <StatCard
          icon={TrendingUp}
          label="Progresso médio"
          value={`${progressoMedio}%`}
        />
        <StatCard
          icon={Award}
          label="Certificados emitidos"
          value={certificadosCount}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus cursos em andamento</CardTitle>
        </CardHeader>
        <CardContent>
          {matriculas.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Você ainda não está matriculado em nenhum curso"
              description="Assim que sua matrícula for confirmada, ela aparecerá aqui."
              action={{ label: "Ver cursos disponíveis", href: "/cursos" }}
            />
          ) : (
            <div className="space-y-4">
              {matriculas.map((m) => (
                <div
                  key={m.id}
                  className="space-y-2 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-brand-navy">
                      {m.turma.curso.titulo}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {m.turma.nome}
                    </span>
                  </div>
                  <ProgressBar value={m.progresso} />
                  <p className="text-xs text-muted-foreground">
                    Início: {formatDate(m.turma.dataInicio)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
