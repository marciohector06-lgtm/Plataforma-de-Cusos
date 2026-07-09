"use client";

import { useMemo } from "react";
import { Users2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate, turmaStatusLabels } from "@/lib/utils";

type Turma = Prisma.TurmaGetPayload<{
  include: { curso: true; _count: { select: { matriculas: true } } };
}>;

export function TurmasTable({ turmas }: { turmas: Turma[] }) {
  const columns = useMemo<ColumnDef<Turma>[]>(
    () => [
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.curso.titulo,
      },
      { accessorKey: "nome", header: "Turma" },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">{turmaStatusLabels[row.original.status]}</Badge>
        ),
      },
      {
        id: "vagas",
        header: "Vagas",
        accessorFn: (row) => `${row._count.matriculas}/${row.vagas}`,
      },
      {
        id: "dataInicio",
        header: "Início",
        accessorFn: (row) => formatDate(row.dataInicio),
      },
      {
        id: "dataFim",
        header: "Fim",
        accessorFn: (row) => formatDate(row.dataFim),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={turmas}
      searchPlaceholder="Buscar turma..."
      emptyState={{
        icon: Users2,
        title: "Você ainda não leciona nenhuma turma",
        description: "Assim que uma turma for atribuída a você, ela aparecerá aqui.",
      }}
    />
  );
}
