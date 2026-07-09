"use client";

import { useMemo } from "react";
import { Layers } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { ConteudoFormDialog } from "@/components/gestor/ConteudoFormDialog";
import type { ConteudoTipo, Prisma } from "@/lib/generated/prisma/client";
import { conteudoTipoLabels, formatDate } from "@/lib/utils";

type Conteudo = Prisma.ConteudoGetPayload<{ include: { curso: true } }>;

export function ConteudosTable({
  conteudos,
  cursos,
  tiposPermitidos,
  searchPlaceholder = "Buscar conteúdo...",
  emptyState,
}: {
  conteudos: Conteudo[];
  cursos?: { id: string; titulo: string }[];
  tiposPermitidos?: ConteudoTipo[];
  searchPlaceholder?: string;
  emptyState?: { title: string; description?: string };
}) {
  const columns = useMemo<ColumnDef<Conteudo>[]>(() => {
    const base: ColumnDef<Conteudo>[] = [
      { accessorKey: "titulo", header: "Título" },
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.curso.titulo,
      },
      {
        id: "tipo",
        header: "Tipo",
        accessorFn: (row) => row.tipo,
        cell: ({ row }) => (
          <Badge variant="outline">{conteudoTipoLabels[row.original.tipo]}</Badge>
        ),
      },
      { accessorKey: "ordem", header: "Ordem" },
      {
        id: "createdAt",
        header: "Criado em",
        accessorFn: (row) => formatDate(row.createdAt),
      },
    ];

    if (cursos) {
      base.push({
        id: "acoes",
        header: "",
        cell: ({ row }) => (
          <ConteudoFormDialog
            conteudo={row.original}
            cursos={cursos}
            tiposPermitidos={tiposPermitidos}
          />
        ),
      });
    }

    return base;
  }, [cursos, tiposPermitidos]);

  return (
    <DataTable
      columns={columns}
      data={conteudos}
      searchPlaceholder={searchPlaceholder}
      emptyState={{
        icon: Layers,
        title: emptyState?.title ?? "Nenhum conteúdo cadastrado",
        description:
          emptyState?.description ??
          "Assim que um conteúdo for criado, ele aparecerá aqui.",
      }}
    />
  );
}
