import { Award, BookOpen, Users2, GraduationCap } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, turmaStatusLabels } from "@/lib/utils";

export default async function InstrutorDashboardPage() {
  const session = await requireSession();

  const [cursosCriados, turmas, alunosMatriculados, certificadosEmitidos] =
    await Promise.all([
      db.curso.count({ where: { autorId: session.user.id } }),
      db.turma.findMany({
        where: { instrutorId: session.user.id },
        include: { curso: true, matriculas: true },
        orderBy: { dataInicio: "desc" },
      }),
      db.matricula.count({
        where: { turma: { instrutorId: session.user.id } },
      }),
      db.certificado.count({
        where: { matricula: { turma: { instrutorId: session.user.id } } },
      }),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${session.user.name ?? "instrutor"}`}
        description="Suas turmas e cursos em um só lugar."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Cursos criados" value={cursosCriados} />
        <StatCard icon={Users2} label="Turmas lecionadas" value={turmas.length} />
        <StatCard
          icon={GraduationCap}
          label="Alunos matriculados"
          value={alunosMatriculados}
        />
        <StatCard
          icon={Award}
          label="Certificados emitidos"
          value={certificadosEmitidos}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas turmas</CardTitle>
        </CardHeader>
        <CardContent>
          {turmas.length === 0 ? (
            <EmptyState
              icon={Users2}
              title="Você ainda não leciona nenhuma turma"
              description="Assim que uma turma for atribuída a você, ela aparecerá aqui."
            />
          ) : (
            <div className="space-y-4">
              {turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="space-y-2 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-brand-navy">
                      {turma.curso.titulo}
                    </p>
                    <Badge variant="outline">
                      {turmaStatusLabels[turma.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{turma.nome}</span>
                    <span>
                      {turma.matriculas.length}/{turma.vagas} vagas ocupadas
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Início: {formatDate(turma.dataInicio)}
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
