"use client";

import { useMemo } from "react";
import { ClipboardCheck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { AvaliacaoFormDialog } from "@/components/gestor/AvaliacaoFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type Avaliacao = Prisma.AvaliacaoGetPayload<{
  include: { curso: true; _count: { select: { questoes: true; tentativas: true } } };
}>;

export function AvaliacoesTable({
  avaliacoes,
  cursos,
}: {
  avaliacoes: Avaliacao[];
  cursos: { id: string; titulo: string }[];
}) {
  const columns = useMemo<ColumnDef<Avaliacao>[]>(
    () => [
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.curso.titulo,
      },
      { accessorKey: "titulo", header: "Avaliação" },
      {
        id: "questoes",
        header: "Questões",
        accessorFn: (row) => row._count.questoes,
      },
      {
        id: "tentativas",
        header: "Tentativas",
        accessorFn: (row) => row._count.tentativas,
      },
      { accessorKey: "notaMinima", header: "Nota mínima" },
      {
        id: "createdAt",
        header: "Criada em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => (
          <AvaliacaoFormDialog avaliacao={row.original} cursos={cursos} />
        ),
      },
    ],
    [cursos]
  );

  return (
    <DataTable
      columns={columns}
      data={avaliacoes}
      searchPlaceholder="Buscar avaliação..."
      emptyState={{
        icon: ClipboardCheck,
        title: "Nenhuma avaliação cadastrada",
        description: "Assim que uma avaliação for criada, ela aparecerá aqui.",
      }}
    />
  );
}
