import { Award, CheckCircle2, ClipboardCheck, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesempenhoChart } from "@/components/gestor/DesempenhoChart";

export default async function GestorDesempenhoPage() {
  const [tentativasCorrigidas, matriculas] = await Promise.all([
    db.tentativaAvaliacao.findMany({
      where: { status: "CORRIGIDA", nota: { not: null } },
      include: { avaliacao: { include: { curso: true } } },
    }),
    db.matricula.findMany({ select: { progresso: true } }),
  ]);

  const notaMediaGeral =
    tentativasCorrigidas.length === 0
      ? 0
      : Math.round(
          tentativasCorrigidas.reduce((acc, t) => acc + (t.nota ?? 0), 0) /
            tentativasCorrigidas.length
        );

  const aprovadas = tentativasCorrigidas.filter(
    (t) => (t.nota ?? 0) >= t.avaliacao.notaMinima
  ).length;
  const taxaAprovacao =
    tentativasCorrigidas.length === 0
      ? 0
      : Math.round((aprovadas / tentativasCorrigidas.length) * 100);

  const progressoMedio =
    matriculas.length === 0
      ? 0
      : Math.round(
          matriculas.reduce((acc, m) => acc + m.progresso, 0) / matriculas.length
        );

  const porCurso = new Map<string, { soma: number; total: number }>();
  for (const t of tentativasCorrigidas) {
    const key = t.avaliacao.curso.titulo;
    const atual = porCurso.get(key) ?? { soma: 0, total: 0 };
    atual.soma += t.nota ?? 0;
    atual.total += 1;
    porCurso.set(key, atual);
  }
  const dadosGrafico = Array.from(porCurso.entries()).map(([curso, v]) => ({
    curso,
    notaMedia: Math.round(v.soma / v.total),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Desempenho"
        description="Notas, aprovação e progresso dos alunos na plataforma."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Award} label="Nota média geral" value={notaMediaGeral} />
        <StatCard
          icon={CheckCircle2}
          label="Taxa de aprovação"
          value={`${taxaAprovacao}%`}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Avaliações corrigidas"
          value={tentativasCorrigidas.length}
        />
        <StatCard
          icon={TrendingUp}
          label="Progresso médio"
          value={`${progressoMedio}%`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nota média por curso</CardTitle>
        </CardHeader>
        <CardContent>
          {dadosGrafico.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="Sem avaliações corrigidas"
              description="Assim que avaliações forem corrigidas, o desempenho por curso aparecerá aqui."
            />
          ) : (
            <DesempenhoChart data={dadosGrafico} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
