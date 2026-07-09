import { notFound } from "next/navigation";
import { CircleCheck, Clock, ClipboardList } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CorrigirTentativaForm } from "@/components/instrutor/CorrigirTentativaForm";
import { formatDateTime } from "@/lib/utils";

interface AvaliacaoDetalhePageProps {
  params: Promise<{ id: string }>;
}

export default async function InstrutorAvaliacaoDetalhePage({
  params,
}: AvaliacaoDetalhePageProps) {
  const { id } = await params;
  const session = await requireSession();

  const avaliacao = await db.avaliacao.findUnique({
    where: { id },
    include: {
      curso: true,
      questoes: true,
      tentativas: {
        include: {
          matricula: { include: { aluno: true } },
          respostas: { include: { alternativa: true } },
        },
        orderBy: { enviadaEm: "desc" },
      },
    },
  });

  if (!avaliacao || avaliacao.curso.autorId !== session.user.id) {
    notFound();
  }

  const totalQuestoes = avaliacao.questoes.length;
  const pendentes = avaliacao.tentativas.filter((t) => t.status === "ENVIADA");
  const corrigidas = avaliacao.tentativas.filter((t) => t.status === "CORRIGIDA");

  return (
    <div className="space-y-6">
      <PageHeader
        title={avaliacao.titulo}
        description={`Curso: ${avaliacao.curso.titulo}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Tentativas" value={avaliacao.tentativas.length} />
        <StatCard icon={Clock} label="Pendentes de correção" value={pendentes.length} />
        <StatCard icon={CircleCheck} label="Corrigidas" value={corrigidas.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tentativas</CardTitle>
        </CardHeader>
        <CardContent>
          {avaliacao.tentativas.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nenhuma tentativa enviada ainda"
              description="Assim que um aluno enviar a avaliação, ela aparecerá aqui."
            />
          ) : (
            <div className="space-y-4">
              {avaliacao.tentativas.map((tentativa) => {
                const acertos = tentativa.respostas.filter(
                  (r) => r.alternativa.correta
                ).length;
                const notaSugerida =
                  totalQuestoes > 0
                    ? Math.round((acertos / totalQuestoes) * 100)
                    : 0;

                return (
                  <div
                    key={tentativa.id}
                    className="space-y-3 rounded-xl border border-border p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-brand-navy">
                          {tentativa.matricula.aluno.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tentativa.matricula.aluno.email}
                        </p>
                      </div>
                      <Badge
                        variant={tentativa.status === "CORRIGIDA" ? "outline" : "secondary"}
                      >
                        {tentativa.status === "CORRIGIDA"
                          ? "Corrigida"
                          : "Aguardando correção"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {acertos}/{totalQuestoes} respostas corretas · enviada em{" "}
                      {formatDateTime(tentativa.enviadaEm)}
                    </p>

                    {tentativa.status === "CORRIGIDA" ? (
                      <p className="text-sm font-medium text-brand-navy">
                        Nota final: {tentativa.nota}
                      </p>
                    ) : (
                      <CorrigirTentativaForm
                        tentativaId={tentativa.id}
                        notaSugerida={notaSugerida}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
