import {
  Award,
  BookOpen,
  ClipboardList,
  FileSignature,
  GraduationCap,
  Users,
  Users2,
} from "lucide-react";
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

export default async function GestorDashboardPage() {
  const [
    totalAlunos,
    totalInstrutores,
    cursosPublicados,
    turmasEmAndamento,
    matriculasAtivas,
    contratosPendentes,
    certificadosEmitidos,
    turmasRecentes,
  ] = await Promise.all([
    db.user.count({ where: { role: "ALUNO" } }),
    db.user.count({ where: { role: "INSTRUTOR" } }),
    db.curso.count({ where: { status: "PUBLICADO" } }),
    db.turma.count({ where: { status: "EM_ANDAMENTO" } }),
    db.matricula.count({ where: { status: "ATIVA" } }),
    db.contrato.count({ where: { status: "PENDENTE" } }),
    db.certificado.count(),
    db.turma.findMany({
      include: { curso: true, instrutor: true, matriculas: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        description="Panorama da plataforma Frontline Medical."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Alunos" value={totalAlunos} />
        <StatCard
          icon={GraduationCap}
          label="Instrutores"
          value={totalInstrutores}
        />
        <StatCard icon={BookOpen} label="Cursos publicados" value={cursosPublicados} />
        <StatCard icon={Users2} label="Turmas em andamento" value={turmasEmAndamento} />
        <StatCard
          icon={ClipboardList}
          label="Matrículas ativas"
          value={matriculasAtivas}
        />
        <StatCard
          icon={FileSignature}
          label="Contratos pendentes"
          value={contratosPendentes}
        />
        <StatCard icon={Award} label="Certificados emitidos" value={certificadosEmitidos} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turmas recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {turmasRecentes.length === 0 ? (
            <EmptyState
              icon={Users2}
              title="Nenhuma turma cadastrada"
              description="Assim que uma turma for criada, ela aparecerá aqui."
            />
          ) : (
            <div className="space-y-4">
              {turmasRecentes.map((turma) => (
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
                    <span>
                      {turma.nome} · Instrutor: {turma.instrutor.name}
                    </span>
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
