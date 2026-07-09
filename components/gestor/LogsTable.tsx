"use client";

import { useMemo } from "react";
import { History } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { LogAtividade } from "@/lib/generated/prisma/client";
import { formatDateTime } from "@/lib/utils";

export function LogsTable({ logs }: { logs: LogAtividade[] }) {
  const columns = useMemo<ColumnDef<LogAtividade>[]>(
    () => [
      {
        id: "createdAt",
        header: "Data/hora",
        accessorFn: (row) => formatDateTime(row.createdAt),
      },
      { accessorKey: "userNome", header: "Usuário" },
      {
        id: "acao",
        header: "Ação",
        accessorFn: (row) => row.acao,
        cell: ({ row }) => <Badge variant="outline">{row.original.acao}</Badge>,
      },
      { accessorKey: "entidade", header: "Entidade" },
      {
        id: "detalhes",
        header: "Detalhes",
        accessorFn: (row) => row.detalhes ?? "—",
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={logs}
      searchPlaceholder="Buscar no log..."
      emptyState={{
        icon: History,
        title: "Nenhuma atividade registrada",
        description: "Ações realizadas no painel aparecerão aqui.",
      }}
    />
  );
}
