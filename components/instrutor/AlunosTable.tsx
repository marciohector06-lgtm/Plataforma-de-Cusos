"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { matriculaStatusLabels } from "@/lib/utils";

type Matricula = Prisma.MatriculaGetPayload<{
  include: { aluno: true; turma: { include: { curso: true } } };
}>;

export function AlunosTable({ matriculas }: { matriculas: Matricula[] }) {
  const columns = useMemo<ColumnDef<Matricula>[]>(
    () => [
      {
        id: "aluno",
        header: "Aluno",
        accessorFn: (row) => row.aluno.name,
      },
      {
        id: "email",
        header: "E-mail",
        accessorFn: (row) => row.aluno.email,
      },
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.turma.curso.titulo,
      },
      {
        id: "turma",
        header: "Turma",
        accessorFn: (row) => row.turma.nome,
      },
      {
        id: "progresso",
        header: "Progresso",
        accessorFn: (row) => row.progresso,
        cell: ({ row }) => (
          <ProgressBar value={row.original.progresso} className="w-32" />
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">
            {matriculaStatusLabels[row.original.status]}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={matriculas}
      searchPlaceholder="Buscar aluno..."
      emptyState={{
        icon: Users,
        title: "Nenhum aluno matriculado nas suas turmas",
        description: "Assim que um aluno se matricular, ele aparecerá aqui.",
      }}
    />
  );
}
