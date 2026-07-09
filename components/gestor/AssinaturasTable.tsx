"use client";

import { useMemo } from "react";
import { Repeat } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { assinaturaStatusLabels, formatDate } from "@/lib/utils";

type Assinatura = Prisma.AssinaturaGetPayload<{
  include: { user: true; plano: true };
}>;

export function AssinaturasTable({ assinaturas }: { assinaturas: Assinatura[] }) {
  const columns = useMemo<ColumnDef<Assinatura>[]>(
    () => [
      {
        id: "usuario",
        header: "Usuário",
        accessorFn: (row) => row.user.name,
      },
      {
        id: "plano",
        header: "Plano",
        accessorFn: (row) => row.plano.nome,
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">
            {assinaturaStatusLabels[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "dataInicio",
        header: "Início",
        accessorFn: (row) => formatDate(row.dataInicio),
      },
      {
        id: "dataFim",
        header: "Fim",
        accessorFn: (row) => (row.dataFim ? formatDate(row.dataFim) : "—"),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={assinaturas}
      searchPlaceholder="Buscar assinatura..."
      emptyState={{
        icon: Repeat,
        title: "Nenhuma assinatura registrada",
        description: "Assim que um usuário assinar um plano, ela aparecerá aqui.",
      }}
    />
  );
}
