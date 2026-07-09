"use client";

import { useMemo } from "react";
import { BookOpen } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { CursoFormDialog } from "@/components/gestor/CursoFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { cursoStatusLabels, formatDate } from "@/lib/utils";

type Curso = Prisma.CursoGetPayload<{
  include: { autor: true; _count: { select: { turmas: true } } };
}>;

export function CursosTable({
  cursos,
  instrutores,
}: {
  cursos: Curso[];
  instrutores: { id: string; name: string }[];
}) {
  const columns = useMemo<ColumnDef<Curso>[]>(
    () => [
      { accessorKey: "titulo", header: "Título" },
      {
        id: "autor",
        header: "Autor",
        accessorFn: (row) => row.autor.name,
      },
      { accessorKey: "cargaHoraria", header: "Carga horária (h)" },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">{cursoStatusLabels[row.original.status]}</Badge>
        ),
      },
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
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => (
          <CursoFormDialog curso={row.original} instrutores={instrutores} />
        ),
      },
    ],
    [instrutores]
  );

  return (
    <DataTable
      columns={columns}
      data={cursos}
      searchPlaceholder="Buscar curso..."
      emptyState={{
        icon: BookOpen,
        title: "Nenhum curso cadastrado",
        description: "Assim que um curso for criado, ele aparecerá aqui.",
      }}
    />
  );
}
