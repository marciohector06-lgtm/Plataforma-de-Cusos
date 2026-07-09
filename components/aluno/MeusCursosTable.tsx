"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { ProgressBar } from "@/components/shared/ProgressBar";
import type { Matricula, Turma, Curso } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type MatriculaRow = Matricula & { turma: Turma & { curso: Curso } };

const statusLabel: Record<MatriculaRow["status"], string> = {
  ATIVA: "Ativa",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  TRANCADA: "Trancada",
};

export function MeusCursosTable({ data }: { data: MatriculaRow[] }) {
  const columns = useMemo<ColumnDef<MatriculaRow>[]>(
    () => [
      {
        id: "titulo",
        accessorFn: (row) => row.turma.curso.titulo,
        header: "Curso",
      },
      {
        id: "turma",
        accessorFn: (row) => row.turma.nome,
        header: "Turma",
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: "Status",
        cell: ({ row }) => (
          <Badge variant="outline">{statusLabel[row.original.status]}</Badge>
        ),
      },
      {
        id: "progresso",
        header: "Progresso",
        cell: ({ row }) => (
          <ProgressBar value={row.original.progresso} className="w-32" />
        ),
      },
      {
        id: "dataInicio",
        header: "Início",
        cell: ({ row }) => formatDate(row.original.turma.dataInicio),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por curso ou turma..."
      emptyState={{
        icon: BookOpen,
        title: "Você ainda não está matriculado em nenhum curso",
        description: "Assim que sua matrícula for confirmada, ela aparecerá aqui.",
      }}
    />
  );
}
