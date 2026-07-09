"use client";

import { useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatBRL, formatDate, vendaStatusLabels } from "@/lib/utils";

type Venda = Prisma.VendaGetPayload<{
  include: { comprador: true; plano: true };
}>;

export function VendasTable({
  vendas,
  searchPlaceholder = "Buscar venda...",
  emptyState,
}: {
  vendas: Venda[];
  searchPlaceholder?: string;
  emptyState?: { title: string; description?: string };
}) {
  const columns = useMemo<ColumnDef<Venda>[]>(
    () => [
      {
        id: "comprador",
        header: "Comprador",
        accessorFn: (row) => row.comprador.name,
      },
      {
        id: "plano",
        header: "Plano",
        accessorFn: (row) => row.plano?.nome ?? "Avulsa",
      },
      { accessorKey: "descricao", header: "Descrição" },
      {
        id: "valor",
        header: "Valor",
        accessorFn: (row) => formatBRL(row.valorCentavos / 100),
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <Badge variant="outline">{vendaStatusLabels[row.original.status]}</Badge>
        ),
      },
      {
        id: "createdAt",
        header: "Criada em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={vendas}
      searchPlaceholder={searchPlaceholder}
      emptyState={{
        icon: ShoppingCart,
        title: emptyState?.title ?? "Nenhuma venda registrada",
        description:
          emptyState?.description ??
          "Assim que uma venda for registrada, ela aparecerá aqui.",
      }}
    />
  );
}
