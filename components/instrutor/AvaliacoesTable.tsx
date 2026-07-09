"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type Avaliacao = Prisma.AvaliacaoGetPayload<{
  include: { curso: true; _count: { select: { questoes: true; tentativas: true } } };
}>;

export function AvaliacoesTable({ avaliacoes }: { avaliacoes: Avaliacao[] }) {
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
          <Link
            href={`/instrutor/avaliacoes/${row.original.id}`}
            className="text-sm font-medium text-brand-teal-600 hover:underline"
          >
            Corrigir
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={avaliacoes}
      searchPlaceholder="Buscar avaliação..."
      emptyState={{
        icon: ClipboardCheck,
        title: "Nenhuma avaliação cadastrada nos seus cursos",
        description: "Assim que uma avaliação for criada, ela aparecerá aqui.",
      }}
    />
  );
}
