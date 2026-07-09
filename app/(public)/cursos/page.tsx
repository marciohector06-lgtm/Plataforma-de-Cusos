import Link from "next/link";
import { BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function CursosPage() {
  const cursos = await db.curso.findMany({
    where: { status: "PUBLICADO" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
          Cursos
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Cursos certificados em suporte de vida e emergências médicas para
          profissionais e equipes.
        </p>
      </div>

      {cursos.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum curso disponível no momento"
          description="Em breve novos cursos serão publicados."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <Card key={curso.id}>
              <CardHeader>
                <CardTitle>{curso.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {curso.descricao}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{curso.cargaHoraria}h</Badge>
                  <Link
                    href={`/cursos/${curso.slug}`}
                    className="text-sm font-medium text-brand-teal-600 hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
