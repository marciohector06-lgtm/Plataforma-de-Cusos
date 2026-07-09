import { FileText, FolderOpen, Link as LinkIcon, Video } from "lucide-react";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ConteudoTipo } from "@/lib/generated/prisma/client";

const tipoIcon: Record<ConteudoTipo, typeof FileText> = {
  VIDEO: Video,
  PDF: FileText,
  TEXTO: FileText,
  LINK: LinkIcon,
};

export default async function MaterialApoioPage() {
  const session = await requireSession();

  const matriculas = await db.matricula.findMany({
    where: { alunoId: session.user.id },
    select: {
      turma: {
        select: {
          curso: {
            select: {
              id: true,
              titulo: true,
              conteudos: { orderBy: { ordem: "asc" } },
            },
          },
        },
      },
    },
  });

  const cursos = Array.from(
    new Map(matriculas.map((m) => [m.turma.curso.id, m.turma.curso])).values()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Material de Apoio"
        description="Conteúdos disponíveis para os cursos em que você está matriculado."
      />

      {cursos.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhum material disponível"
          description="Materiais aparecem aqui assim que você se matricula em um curso com conteúdo publicado."
        />
      ) : (
        <div className="space-y-4">
          {cursos.map((curso) => (
            <Card key={curso.id}>
              <CardHeader>
                <CardTitle>{curso.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                {curso.conteudos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum material publicado para este curso ainda.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {curso.conteudos.map((conteudo) => {
                      const Icon = tipoIcon[conteudo.tipo];
                      return (
                        <li key={conteudo.id}>
                          <a
                            href={conteudo.url ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm hover:bg-muted"
                          >
                            <Icon className="size-4 shrink-0 text-brand-teal" />
                            {conteudo.titulo}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
