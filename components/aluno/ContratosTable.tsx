"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, FileSignature } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import type { Contrato, Turma, Curso } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type ContratoRow = Contrato & { turma: Turma & { curso: Curso } };

const statusVariant: Record<
  ContratoRow["status"],
  { label: string; className: string }
> = {
  PENDENTE: { label: "Pendente", className: "text-amber-700" },
  ASSINADO: { label: "Assinado", className: "text-brand-teal-600" },
  CANCELADO: { label: "Cancelado", className: "text-destructive" },
};

export function ContratosTable({ data }: { data: ContratoRow[] }) {
  const columns = useMemo<ColumnDef<ContratoRow>[]>(
    () => [
      {
        id: "curso",
        accessorFn: (row) => row.turma.curso.titulo,
        header: "Curso",
      },
      {
        id: "turma",
        accessorFn: (row) => row.turma.nome,
        header: "Turma",
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = statusVariant[row.original.status];
          return (
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          );
        },
      },
      {
        id: "assinadoEm",
        header: "Assinado em",
        cell: ({ row }) =>
          row.original.assinadoEm ? formatDate(row.original.assinadoEm) : "—",
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) =>
          row.original.urlArquivo ? (
            <Button
              variant="outline"
              size="sm"
              render={<a href={row.original.urlArquivo} target="_blank" />}
            >
              <Download className="size-4" />
              Ver contrato
            </Button>
          ) : null,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por curso ou turma..."
      emptyState={{
        icon: FileSignature,
        title: "Nenhum contrato encontrado",
        description: "Contratos aparecem aqui após a confirmação da matrícula.",
      }}
    />
  );
}
