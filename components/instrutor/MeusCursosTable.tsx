"use client";

import { useMemo } from "react";
import { BookOpen } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { cursoStatusLabels, formatDate } from "@/lib/utils";

type Curso = Prisma.CursoGetPayload<{
  include: { _count: { select: { turmas: true } } };
}>;

export function MeusCursosTable({ cursos }: { cursos: Curso[] }) {
  const columns = useMemo<ColumnDef<Curso>[]>(
    () => [
      { accessorKey: "titulo", header: "Título" },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">{cursoStatusLabels[row.original.status]}</Badge>
        ),
      },
      { accessorKey: "cargaHoraria", header: "Carga horária (h)" },
      {
        id: "turmas",
        header: "Turmas",
        accessorFn: (row) => row._count.turmas,
      },
      {
        id: "createdAt",
        header: "Criado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={cursos}
      searchPlaceholder="Buscar curso..."
      emptyState={{
        icon: BookOpen,
        title: "Você ainda não criou nenhum curso",
        description: "Assim que você criar um curso, ele aparecerá aqui.",
      }}
    />
  );
}
