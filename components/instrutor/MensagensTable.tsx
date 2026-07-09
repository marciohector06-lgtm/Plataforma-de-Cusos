"use client";

import { useMemo } from "react";
import { MessagesSquare } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDateTime } from "@/lib/utils";

type Mensagem = Prisma.MensagemGetPayload<{
  include: { remetente: true; destinatario: true };
}>;

export function MensagensTable({
  mensagens,
  userId,
}: {
  mensagens: Mensagem[];
  userId: string;
}) {
  const columns = useMemo<ColumnDef<Mensagem>[]>(
    () => [
      {
        id: "direcao",
        header: "",
        accessorFn: (row) => (row.remetenteId === userId ? "Enviada" : "Recebida"),
        cell: ({ row }) => (
          <Badge variant={row.original.remetenteId === userId ? "outline" : "default"}>
            {row.original.remetenteId === userId ? "Enviada" : "Recebida"}
          </Badge>
        ),
      },
      {
        id: "contato",
        header: "Aluno",
        accessorFn: (row) =>
          row.remetenteId === userId ? row.destinatario.name : row.remetente.name,
      },
      {
        id: "corpo",
        header: "Mensagem",
        accessorFn: (row) => row.corpo,
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-sm">{row.original.corpo}</span>
        ),
      },
      {
        id: "createdAt",
        header: "Data/hora",
        accessorFn: (row) => formatDateTime(row.createdAt),
      },
    ],
    [userId]
  );

  return (
    <DataTable
      columns={columns}
      data={mensagens}
      searchPlaceholder="Buscar mensagem..."
      emptyState={{
        icon: MessagesSquare,
        title: "Nenhuma mensagem ainda",
        description: "Suas conversas com alunos aparecerão aqui.",
      }}
    />
  );
}
