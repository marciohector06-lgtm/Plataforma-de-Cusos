"use client";

import { useMemo } from "react";
import { Mail } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { EmailTemplateFormDialog } from "@/components/gestor/EmailTemplateFormDialog";
import type { EmailTemplate } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

export function EmailTemplatesTable({ templates }: { templates: EmailTemplate[] }) {
  const columns = useMemo<ColumnDef<EmailTemplate>[]>(
    () => [
      { accessorKey: "nome", header: "Nome" },
      { accessorKey: "assunto", header: "Assunto" },
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
        cell: ({ row }) => <EmailTemplateFormDialog template={row.original} />,
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
        icon: Mail,
        title: "Nenhum modelo cadastrado",
        description: "Modelos de e-mail para uso futuro no envio automático aparecerão aqui.",
      }}
    />
  );
}
