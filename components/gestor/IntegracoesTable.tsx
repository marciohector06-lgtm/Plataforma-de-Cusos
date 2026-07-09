"use client";

import { useMemo } from "react";
import { Plug } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { IntegracaoFormDialog } from "@/components/gestor/IntegracaoFormDialog";
import type { Integracao } from "@/lib/generated/prisma/client";
import { formatDate, mascarar, tipoIntegracaoLabels } from "@/lib/utils";

export function IntegracoesTable({ integracoes }: { integracoes: Integracao[] }) {
  const columns = useMemo<ColumnDef<Integracao>[]>(
    () => [
      { accessorKey: "nome", header: "Nome" },
      {
        id: "tipo",
        header: "Tipo",
        accessorFn: (row) => row.tipo,
        cell: ({ row }) => (
          <Badge variant="outline">{tipoIntegracaoLabels[row.original.tipo]}</Badge>
        ),
      },
      {
        id: "valor",
        header: "Valor",
        accessorFn: (row) => mascarar(row.valor),
      },
      {
        id: "ativo",
        header: "Status",
        accessorFn: (row) => row.ativo,
        cell: ({ row }) => (
          <Badge variant={row.original.ativo ? "default" : "outline"}>
            {row.original.ativo ? "Ativa" : "Inativa"}
          </Badge>
        ),
      },
      {
        id: "createdAt",
        header: "Criada em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => <IntegracaoFormDialog integracao={row.original} />,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={integracoes}
      searchPlaceholder="Buscar integração..."
      emptyState={{
        icon: Plug,
        title: "Nenhuma integração cadastrada",
        description: "Chaves e webhooks configurados aparecerão aqui.",
      }}
    />
  );
}
