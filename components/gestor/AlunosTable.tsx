"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type Aluno = Prisma.UserGetPayload<{
  include: { _count: { select: { matriculas: true; certificados: true } } };
}>;

export function AlunosTable({ alunos }: { alunos: Aluno[] }) {
  const columns = useMemo<ColumnDef<Aluno>[]>(
    () => [
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "email", header: "E-mail" },
      {
        id: "matriculas",
        header: "Matrículas",
        accessorFn: (row) => row._count.matriculas,
      },
      {
        id: "certificados",
        header: "Certificados",
        accessorFn: (row) => row._count.certificados,
      },
      {
        id: "createdAt",
        header: "Cadastrado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={alunos}
      searchPlaceholder="Buscar aluno..."
      emptyState={{
        icon: Users,
        title: "Nenhum aluno cadastrado",
        description: "Assim que um aluno se cadastrar, ele aparecerá aqui.",
      }}
    />
  );
}
