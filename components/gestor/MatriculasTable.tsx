"use client";

import { useMemo } from "react";
import { ClipboardList } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { DataTable } from "@/components/shared/DataTable";
import { MatriculaFormDialog } from "@/components/gestor/MatriculaFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate, matriculaStatusLabels } from "@/lib/utils";

type Matricula = Prisma.MatriculaGetPayload<{
  include: { aluno: true; turma: { include: { curso: true } } };
}>;

export function MatriculasTable({
  matriculas,
  alunos,
  turmas,
}: {
  matriculas: Matricula[];
  alunos: { id: string; name: string }[];
  turmas: { id: string; nome: string; curso: { titulo: string } }[];
}) {
  const columns = useMemo<ColumnDef<Matricula>[]>(
    () => [
      {
        id: "aluno",
        header: "Aluno",
        accessorFn: (row) => row.aluno.name,
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
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">
            {matriculaStatusLabels[row.original.status]}
          </Badge>
        ),
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
        id: "createdAt",
        header: "Matriculado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => (
          <MatriculaFormDialog matricula={row.original} alunos={alunos} turmas={turmas} />
        ),
      },
    ],
    [alunos, turmas]
  );

  return (
    <DataTable
      columns={columns}
      data={matriculas}
      searchPlaceholder="Buscar matrícula..."
      emptyState={{
        icon: ClipboardList,
        title: "Nenhuma matrícula registrada",
        description: "Assim que um aluno se matricular, ela aparecerá aqui.",
      }}
    />
  );
}
