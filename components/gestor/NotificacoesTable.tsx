"use client";

import { useMemo } from "react";
import { Bell } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDateTime } from "@/lib/utils";

type Notificacao = Prisma.NotificacaoGetPayload<{ include: { user: true } }>;

export function NotificacoesTable({
  notificacoes,
}: {
  notificacoes: Notificacao[];
}) {
  const columns = useMemo<ColumnDef<Notificacao>[]>(
    () => [
      { accessorKey: "titulo", header: "Título" },
      { accessorKey: "mensagem", header: "Mensagem" },
      {
        id: "destinatario",
        header: "Destinatário",
        accessorFn: (row) => row.user.name,
      },
      {
        id: "lida",
        header: "Status",
        accessorFn: (row) => row.lida,
        cell: ({ row }) => (
          <Badge variant={row.original.lida ? "outline" : "secondary"}>
            {row.original.lida ? "Lida" : "Não lida"}
          </Badge>
        ),
      },
      {
        id: "createdAt",
        header: "Enviada em",
        accessorFn: (row) => formatDateTime(row.createdAt),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={notificacoes}
      searchPlaceholder="Buscar notificação..."
      emptyState={{
        icon: Bell,
        title: "Nenhuma notificação enviada",
        description: "Notificações enviadas aos usuários aparecerão aqui.",
      }}
    />
  );
}
