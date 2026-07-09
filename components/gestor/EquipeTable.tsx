"use client";

import { useMemo } from "react";
import { UsersRound } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { EquipeFormDialog } from "@/components/gestor/EquipeFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate, roleLabels } from "@/lib/utils";

type Membro = Prisma.UserGetPayload<object>;

export function EquipeTable({ membros }: { membros: Membro[] }) {
  const columns = useMemo<ColumnDef<Membro>[]>(
    () => [
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "email", header: "E-mail" },
      {
        id: "role",
        header: "Papel",
        accessorFn: (row) => row.role,
        cell: ({ row }) => (
          <Badge variant="outline">{roleLabels[row.original.role]}</Badge>
        ),
      },
      {
        id: "createdAt",
        header: "Desde",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => <EquipeFormDialog membro={row.original} />,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={membros}
      searchPlaceholder="Buscar membro da equipe..."
      emptyState={{
        icon: UsersRound,
        title: "Nenhum membro cadastrado",
        description: "Gestores e administradores aparecerão aqui.",
      }}
    />
  );
}
