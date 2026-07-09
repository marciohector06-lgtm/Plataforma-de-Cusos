"use client";

import { useMemo } from "react";
import { Users2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { TurmaFormDialog } from "@/components/gestor/TurmaFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate, turmaStatusLabels } from "@/lib/utils";

type Turma = Prisma.TurmaGetPayload<{
  include: { curso: true; instrutor: true; _count: { select: { matriculas: true } } };
}>;

export function TurmasTable({
  turmas,
  cursos,
  instrutores,
}: {
  turmas: Turma[];
  cursos: { id: string; titulo: string }[];
  instrutores: { id: string; name: string }[];
}) {
  const columns = useMemo<ColumnDef<Turma>[]>(
    () => [
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.curso.titulo,
      },
      { accessorKey: "nome", header: "Turma" },
      {
        id: "instrutor",
        header: "Instrutor",
        accessorFn: (row) => row.instrutor.name,
      },
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
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => (
          <TurmaFormDialog turma={row.original} cursos={cursos} instrutores={instrutores} />
        ),
      },
    ],
    [cursos, instrutores]
  );

  return (
    <DataTable
      columns={columns}
      data={turmas}
      searchPlaceholder="Buscar turma..."
      emptyState={{
        icon: Users2,
        title: "Nenhuma turma cadastrada",
        description: "Assim que uma turma for criada, ela aparecerá aqui.",
      }}
    />
  );
}
