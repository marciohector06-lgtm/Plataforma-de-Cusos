"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PlanoFormDialog } from "@/components/gestor/PlanoFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatBRL, formatDate, planoRecorrenciaLabels } from "@/lib/utils";

type Plano = Prisma.PlanoGetPayload<{
  include: { _count: { select: { assinaturas: true; vendas: true } } };
}>;

export function PlanosTable({ planos }: { planos: Plano[] }) {
  const columns = useMemo<ColumnDef<Plano>[]>(
    () => [
      { accessorKey: "nome", header: "Nome" },
      {
        id: "recorrencia",
        header: "Recorrência",
        accessorFn: (row) => planoRecorrenciaLabels[row.recorrencia],
      },
      {
        id: "preco",
        header: "Preço",
        accessorFn: (row) => formatBRL(row.precoCentavos / 100),
      },
      {
        id: "ativo",
        header: "Status",
        accessorFn: (row) => row.ativo,
        cell: ({ row }) => (
          <Badge variant={row.original.ativo ? "outline" : "secondary"}>
            {row.original.ativo ? "Ativo" : "Inativo"}
          </Badge>
        ),
      },
      {
        id: "assinaturas",
        header: "Assinaturas",
        accessorFn: (row) => row._count.assinaturas,
      },
      {
        id: "createdAt",
        header: "Criado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => <PlanoFormDialog plano={row.original} />,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={planos}
      searchPlaceholder="Buscar plano..."
      emptyState={{
        icon: Package,
        title: "Nenhum plano cadastrado",
        description: "Assim que um plano for criado, ele aparecerá aqui.",
      }}
    />
  );
}
