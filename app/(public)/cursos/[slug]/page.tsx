import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface CursoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CursoDetalhePage({ params }: CursoPageProps) {
  const { slug } = await params;

  const curso = await db.curso.findUnique({
    where: { slug, status: "PUBLICADO" },
    include: {
      turmas: {
        where: { status: { in: ["PLANEJADA", "EM_ANDAMENTO"] } },
        include: { _count: { select: { matriculas: true } } },
        orderBy: { dataInicio: "asc" },
      },
    },
  });

  if (!curso) {
    notFound();
  }

  return (
    <div>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Badge variant="outline" className="border-white/30 text-white">
            <Clock className="size-3" aria-hidden />
            {curso.cargaHoraria}h
          </Badge>
          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
            {curso.titulo}
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">{curso.descricao}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-6 font-heading text-2xl font-bold text-brand-navy">
          Turmas abertas
        </h2>

        {curso.turmas.length === 0 ? (
          <p className="text-muted-foreground">
            Não há turmas abertas para este curso no momento. Fale conosco
            para saber sobre as próximas datas.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {curso.turmas.map((turma) => (
              <Card key={turma.id}>
                <CardHeader>
                  <CardTitle>{turma.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" aria-hidden />
                    {formatDate(turma.dataInicio)} a {formatDate(turma.dataFim)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {turma._count.matriculas}/{turma.vagas} vagas preenchidas
                  </p>
                  <Button className="w-full" render={<Link href="/cadastro" />}>
                    Quero me matricular
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
