"use client";

import { useMemo } from "react";
import { MessageCircle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { WhatsappTemplateFormDialog } from "@/components/gestor/WhatsappTemplateFormDialog";
import type { WhatsappTemplate } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

export function WhatsappTemplatesTable({ templates }: { templates: WhatsappTemplate[] }) {
  const columns = useMemo<ColumnDef<WhatsappTemplate>[]>(
    () => [
      { accessorKey: "nome", header: "Nome" },
      {
        id: "corpo",
        header: "Mensagem",
        accessorFn: (row) => row.corpo,
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-xs text-muted-foreground">
            {row.original.corpo}
          </span>
        ),
      },
      {
        id: "ativo",
        header: "Status",
        accessorFn: (row) => row.ativo,
        cell: ({ row }) => (
          <Badge variant={row.original.ativo ? "default" : "outline"}>
            {row.original.ativo ? "Ativo" : "Inativo"}
          </Badge>
        ),
      },
      {
        id: "createdAt",
        header: "Criado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => <WhatsappTemplateFormDialog template={row.original} />,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={templates}
      searchPlaceholder="Buscar modelo..."
      emptyState={{
        icon: MessageCircle,
        title: "Nenhum modelo cadastrado",
        description: "Modelos de mensagem para envio manual via WhatsApp aparecerão aqui.",
      }}
    />
  );
}
