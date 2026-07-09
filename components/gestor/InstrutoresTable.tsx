"use client";

import { useMemo } from "react";
import { GraduationCap } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { InstrutorFormDialog } from "@/components/gestor/InstrutorFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type Instrutor = Prisma.UserGetPayload<{
  include: {
    _count: { select: { cursosCriados: true; turmasLecionadas: true } };
  };
}>;

export function InstrutoresTable({ instrutores }: { instrutores: Instrutor[] }) {
  const columns = useMemo<ColumnDef<Instrutor>[]>(
    () => [
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "email", header: "E-mail" },
      {
        id: "cursosCriados",
        header: "Cursos criados",
        accessorFn: (row) => row._count.cursosCriados,
      },
      {
        id: "turmasLecionadas",
        header: "Turmas",
        accessorFn: (row) => row._count.turmasLecionadas,
      },
      {
        id: "createdAt",
        header: "Cadastrado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => <InstrutorFormDialog instrutor={row.original} />,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={instrutores}
      searchPlaceholder="Buscar instrutor..."
      emptyState={{
        icon: GraduationCap,
        title: "Nenhum instrutor cadastrado",
        description: "Assim que um instrutor for cadastrado, ele aparecerá aqui.",
      }}
    />
  );
}
